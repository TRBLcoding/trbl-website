import { browser } from '$app/environment'
import { supabase } from "$lib/supabase/supabaseClient"
import { createPostgrestErrorFromObject, handleSupabaseDeleteError, handleSupabaseUpdateError } from '$lib/utils/SupabaseUtils'
import { get, writable, type Writable } from 'svelte/store'
import { Product, type Category, type Type } from '../domain/Product'
import type { Database } from '../supabase/database.types'
import { arrayDifference, arraysContainSameElements } from '../utils/Array'
import { convertAndUploadImages, deleteImages, type UploadProgress } from '../utils/UploadProgress'
import { ProductFactory } from '$lib/domain/ProductFactory'
import { ProductGroup } from '$lib/domain/ProductGroup'
import type { ProductAmount } from '$lib/domain/ProductAmount'

function createProductStore() {
	const store = writable<Product[]>(undefined)
	const { subscribe, update } = store

	async function init() {
		if (!browser) return

		const { error, data } = await supabase.from("products")
			.select("*, product_group_product_amounts!product_group_product_amounts_product_group_id_fkey(product_id, amount)")
		if (error) {
			if (error?.message === "TypeError: Failed to fetch")
				throw createPostgrestErrorFromObject(error)
			throw error
		} else {
			console.log("here")
			let products = await Promise.all((data || []).map(ProductFactory.fromJSON))
			console.log("here")
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

	async function createProductGroup(newProductGroup: ProductGroup, images: File[], progressStore: Writable<UploadProgress[]>) {
		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages(images, "PublicImages", "product-images/", progressStore)
		newProductGroup.imageIds = uploadedImageIds

		// -- Create product --
		const { data: data1, error: error1 } = await supabase
			.from('products')
			.insert(newProductGroup.toJSON())
			.select('id')
		if (error1)
			throw createPostgrestErrorFromObject(error1)
		newProductGroup.id = data1[0].id

		// -- Create product group product amounts --
		const { data: data2, error: error2 } = await supabase
			.from('product_group_product_amounts')
			.insert(newProductGroup.productAmounts.map(e => e.toJSON(newProductGroup.id)))
			.select('id')
		if (error2)
			throw createPostgrestErrorFromObject(error2)

		// -- Update store --
		update((products) => {
			return [...(products || []), newProductGroup].sort((a, b) => a.name.localeCompare(b.name))
		})
	}

	async function getProductById(id: number) {
		// -- Get product from store --
		await initPromise
		const products = get(store)
		const foundProduct = products?.find((e) => e.id === id)
		if (foundProduct) return foundProduct

		// -- Get product from database --
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
		const product = await Product.fromJSON(data)

		// -- Update store --
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
		handleSupabaseUpdateError(error, data, "product")

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

	async function updateProductGroup(productGroup: ProductGroup, newName: string, newVisible: boolean, newPrice: number, newCombinedImages: (string | File)[], newCategories: Category[], newType: Type, newDescription: string, newMaxOrderAmount: null | number, newProductAmounts: ProductAmount[], progressStore: Writable<UploadProgress[]>) {
		if (!arraysContainSameElements(productGroup.productAmounts || [], newProductAmounts)) {
			// It's easier to just delete all and re-insert
			const { error: error1, count: count1 } = await supabase.from('product_group_product_amounts')
				.delete({ count: 'exact' })
				.eq('product_group_id', productGroup.id)
			handleSupabaseDeleteError(error1, count1, "product group amounts", false)
			const { data: data2, error: error2 } = await supabase
				.from('product_group_product_amounts')
				.insert(newProductAmounts.map(e => e.toJSON(productGroup.id)))
				.select('id')
			if (error2)
				throw createPostgrestErrorFromObject(error2)
		}
		
		updateProduct(productGroup, newName, newVisible, newPrice, newCombinedImages, newCategories, newType, newDescription, newMaxOrderAmount, progressStore)
		
		productGroup.productAmounts = newProductAmounts
		update((products) => [...products])
	}

	async function deleteProduct(product: Product) {
		// -- Remove images --
		await deleteImages("PublicImages", "product-images/", product.imageIds)
		await deleteImages("PublicImages", "product-images/thumbnails/", product.imageIds)

		if(product instanceof ProductGroup) {
			// -- Remove product amounts --
			const { error: error1, count: count1 } = await supabase.from('product_group_product_amounts')
				.delete({ count: 'exact' })
				.eq('product_group_id', product.id)
			handleSupabaseDeleteError(error1, count1, "product group amounts", false)
		}

		// -- Remove product --
		const { error: error2, count: count2 } = await supabase
			.from('products')
			.delete({ count: 'exact' })
			.eq('id', product.id)
		handleSupabaseDeleteError(error2, count2, "product")

		// -- Remove from store --
		update((products) => (products.filter((e) => e.id !== product.id)))
	}

	return {
		subscribe,
		createProduct,
		createProductGroup,
		getProductById,
		updateProduct,
		updateProductGroup,
		deleteProduct,
		initPromise
	}
}

export const productStore = createProductStore()
