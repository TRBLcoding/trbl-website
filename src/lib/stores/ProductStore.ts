import { browser } from '$app/environment'
import { supabase } from "$lib/supabase/supabaseClient"
import { createPostgrestErrorFromObject } from '$lib/utils/SupabaseUtils'
import { get, writable, type Writable } from 'svelte/store'
import { Product, type Category, type Type } from '../domain/Product'
import type { Database } from '../supabase/database.types'
import { arrayDifference, arraysContainSameElements } from '../utils/Array'
import { convertAndUploadImages, deleteImages, type UploadProgress } from '../utils/UploadProgress'

export function handleSupabaseError(error: any, data: any, type: string) {
	if (error) {
		console.error(error)
		if (error.message === "TypeError: Failed to fetch")
			throw new Error(`Network error while updating ${type}: ${error?.message}`)
		throw new Error(`Error updating ${type}: ${error?.message}`)
	}
	else if (!data || data.length === 0) {
		throw new Error(`No ${type} items updated. Possible causes: unverrified account, insufficient permissions, incorrect RLS policies, ...`)
	}
	else if (data.length > 1) {
		throw new Error(`Multiple (${data.length}) ${type} items updated. This should not happen because ID is unique`)
	}
}

function createProductStore() {
	const store = writable<Product[]>(undefined)
	const { subscribe, update } = store

	async function init() {
		if (!browser) return

		const { error, data } = await supabase.from("products").select()
		if (error) {
			if (error?.message === "TypeError: Failed to fetch")
				throw createPostgrestErrorFromObject(error)
			throw error
		} else {
			let products = (data || []).map(Product.fromJSON)
			update(() => products)
		}
	}
	const initPromise: Promise<void> = init()

	async function createProduct(newProduct: Product, images: File[], progressStore: Writable<UploadProgress[]>) {
		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages(images, "PublicImages", "product-images/", progressStore)
		newProduct.imageIds = uploadedImageIds

		// -- Create product --
		const { data, error } = await supabase
			.from('products')
			.insert(newProduct.toJSON())
			.select('id')
		if (error)
			throw createPostgrestErrorFromObject(error)
		newProduct.id = data[0].id

		// -- Update store --
		update((products) => {
			return [...(products || []), newProduct].sort((a, b) => a.name.localeCompare(b.name))
		})
	}

	async function getProductById(id: number) {
		// -- Get product --
		await initPromise
		const products = get(store)
		const foundProduct = products?.find((e) => e.id === id)
		if (foundProduct) return foundProduct
		const { data, error } = await supabase
			.from('products')
			.select()
			.eq('id', id)
			.single()
		if (error) {
			console.error(error)
			throw new Error(`Error fetching product by ID: ${error?.message}`)
		}
		if (!data) throw new Error(`No product found`)
		const product = Product.fromJSON(data)
		update((products) => {
			return [...(products || []), product].sort((a, b) => a.name.localeCompare(b.name))
		})
		return product
	}

	async function updateProduct(product: Product, newName: string, newVisible: boolean, newPrice: number, newCombinedImages: (string | File)[], newCategories: Category[], newType: Type, newDescription: string, newMaxOrderAmount: null | number, progressStore: Writable<UploadProgress[]>) {
		// -- Delete images removed by user --
		const existingImageIds = newCombinedImages.filter((e) => typeof e === 'string') as string[]
		if (!arraysContainSameElements(product.imageIds || [], existingImageIds)) {
			const imageIdsToRemove = arrayDifference(product.imageIds, existingImageIds)
			await deleteImages("PublicImages", "product-images/", imageIdsToRemove)
			await deleteImages("PublicImages", "product-images/thumbnails/", imageIdsToRemove)
		}

		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages(newCombinedImages, "PublicImages", "product-images/", progressStore)

		// -- Update product --
		const { data, error } = await supabase
			.from('products')
			.update({
				name: newName,
				visible: newVisible,
				price: newPrice,
				imageIds: uploadedImageIds,
				categories: newCategories,
				type: newType,
				description: newDescription,
				maxOrderAmount: newMaxOrderAmount
			} as Database['public']['Tables']['products']['Update'])
			.eq('id', product.id)
			.select('id')
		handleSupabaseError(error, data, "product")

		// -- Update store --
		product.name = newName
		product.visible = newVisible
		product.price = newPrice
		product.imageIds = uploadedImageIds
		product.categories = newCategories
		product.type = newType
		product.description = newDescription
		product.maxOrderAmount = newMaxOrderAmount
		update((products) => [...products])
	}

	async function deleteProduct(product: Product) {
		// -- Remove images --
		await deleteImages("PublicImages", "product-images/", product.imageIds)
		await deleteImages("PublicImages", "product-images/thumbnails/", product.imageIds)

		// -- Remove product --
		const { error, count } = await supabase
			.from('products')
			.delete({ count: 'exact' })
			.eq('id', product.id)
		if (error)
			throw error
		else if (!count || count === 0) {
			throw new Error(`No products deleted. Possible causes: unverrified account, insufficient permissions, incorrect RLS policies, ...`)
		}
		else if (count > 1) {
			throw new Error(`Multiple (${count}) products deleted. This should not happen because product ID is unique`)
		}

		// -- Remove from store --
		update((products) => (products.filter((e) => e.id !== product.id)))
	}

	return {
		subscribe,
		createProduct,
		getProductById,
		updateProduct,
		deleteProduct,
		initPromise
	}
}

export const productStore = createProductStore()
