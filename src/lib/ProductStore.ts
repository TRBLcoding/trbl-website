import { browser } from '$app/environment'
import { supabase } from "$lib/supabase/supabaseClient"
import { get, writable, type Writable } from 'svelte/store'
import { Product, type Category, type Type } from './domain/Product'
import type { Database } from './supabase/database.types'
import { convertAndUploadImages, deleteImages, type UploadProgress } from './utils/UploadProgress'
import { arrayDifference, arraysContainSameElements } from './utils/Array'

function createProductStore() {
	const store = writable<Product[]>(undefined, set => {
		async function init() {
			if (!browser) return

			const response = await supabase.from("products").select()
			if (response.error) {
				console.error("Error loading products:", response.error)
			} else {
				let products = (response.data || []).map(Product.fromJSON)
				set(products)
			}
		}
		init()
	})
	const { subscribe, update } = store

	async function createProduct(newProduct: Product, images: File[], progressStore: Writable<UploadProgress[]>) {
		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages(images, "PublicImages", "product-images/", progressStore)
		newProduct.imageIds = uploadedImageIds

		// -- Create product --
		const { error } = await supabase
			.from('products')
			.insert(newProduct.toJSON())
		if (error)
			console.error(error)

		// -- Update store --
		update((products) => {
			return [...(products || []), newProduct].sort((a, b) => a.name.localeCompare(b.name))
		})
	}

	function getProductById(id: number) {
		// -- Get product --
		const products = get(store)
		return products.find((e) => e.id === id)
	}

	async function updateProduct(product: Product, newName: string, newVisible: boolean, newPrice: number, newCombinedImages: (string | File)[], newCategories: Category[], newType: Type, newDescription: string, progressStore: Writable<UploadProgress[]>) {
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
			} as Database['public']['Tables']['products']['Update'])
			.eq('id', product.id)
			.select('id')
		if (error || !data)
			console.error(error)
		else if (data.length !== 1)
			console.error(`Updated ${data.length} products:`, data)

		// -- Update store --
		product.name = newName
		product.visible = newVisible
		product.price = newPrice
		product.imageIds = uploadedImageIds
		product.categories = newCategories
		product.type = newType
		product.description = newDescription
		update((products) => [...products])
	}

	async function deleteProduct(product: Product) {
		// -- Remove images --
		await deleteImages("PublicImages", "product-images/", product.imageIds)
		await deleteImages("PublicImages", "product-images/thumbnails/", product.imageIds)

		// -- Remove product --
		const response = await supabase
			.from('products')
			.delete()
			.eq('id', product.id)
		if (response.error)
			console.error(response.error)

		// -- Remove from store --
		update((products) => (products.filter((e) => e.id !== product.id)))
	}

	return {
		subscribe,
		createProduct,
		getProductById,
		updateProduct,
		deleteProduct,
	}
}

export const productStore = createProductStore()
