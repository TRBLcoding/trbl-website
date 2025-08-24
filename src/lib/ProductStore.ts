import { browser } from '$app/environment'
import { get, writable, type Writable } from 'svelte/store'
import { Product, type Category, type Type, CategoryValues } from './domain/Product'
import { supabase } from "$lib/supabase/supabaseClient"
import type { UploadProgress } from './utils/UploadProgress'
import type { Database } from './supabase/database.types'

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
		// -- Update product --
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
		// -- Get calendarEvent --
		const calendarEvents = get(store)
		return calendarEvents.find((e) => e.id === id)
	}

	async function updateProduct(product: Product, newName: string, newVisible: boolean, newPrice: number, newCombinedImages: (string | File)[], newCategories: Category[], newType: Type, newDescription: string) {
		// -- Update product --
		console.log(newName)
		const { data, error } = await supabase
			.from('products')
			.update({
				name: newName,
				visible: newVisible,
				price: newPrice,
				imageIds: [], // newImageIds,
				categories: newCategories,
				type: newType,
				description: newDescription,
			} as Database['public']['Tables']['products']['Update'])
			.eq('id', 9)
			.select()
		  console.log("Update result:", { data, error, affectedRows: data?.length })
		if (error)
			console.error(error)
		console.log("Updated product:", product.id)

		// -- Update store --
		product.name = newName
		product.visible = newVisible
		product.price = newPrice
		product.imageIds = []
		product.categories = newCategories
		product.type = newType
		product.description = newDescription
		update((products) => [...products])
	}

	// async function deleteProduct(calendarEvent: Product) {
	// 	// -- Remove calendarEvent --
	// 	const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
	// 	const { firebaseApp } = await import('$lib/firebase/Firebase')
	// 	const firestore = getFirestore(firebaseApp)

	// 	await deleteDoc(doc(firestore, Collections.CALENDAR_EVENTS, calendarEvent.id))

	// 	// -- Remove from store --
	// 	update((calendarEvents) => (calendarEvents.filter((e) => e.id !== calendarEvent.id)))
	// }

	return {
		subscribe,
		createProduct,
		getProductById,
		updateProduct,
		// deleteProduct,
	}
}

export const productStore = createProductStore()
