import { browser } from '$app/environment'
import { get, writable, type Writable } from 'svelte/store'
import { Product } from './domain/Product'
import { supabase } from "$lib/supabase/supabaseClient"
import type { UploadProgress } from './utils/UploadProgress'

function createProductStore() {
	const store = writable<Product[]>(undefined, set => {
		async function init() {
			if (!browser) return

			const response = await supabase.from("products").select()
			if (response.error) {
				console.error("Error loading products:", response.error)
			} else {
				let products = response.data || []
				set(products)
			}
		}
		init()
	})
	const { subscribe, update } = store

	async function createProduct(newProduct: Product, images: File[], progressStore: Writable<UploadProgress[]>) {
		// -- Update product --
		// const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		// const { firebaseApp } = await import('$lib/firebase/Firebase')
		// const firestore = getFirestore(firebaseApp)

		// const newDocRef = doc(
		// 	collection(firestore, Collections.CALENDAR_EVENTS)
		// ).withConverter(calendarEventConverter)
		// newProduct.id = newDocRef.id
		// await setDoc(newDocRef, newProduct)

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

	// function getProductById(id: string) {
	// 	// -- Get calendarEvent --
	// 	const calendarEvents = get(store)
	// 	return calendarEvents.find((e) => e.id === id)
	// }

	// async function updateProduct(newTitle: string, newInfo: string, newDate: Dayjs, newDuration: string, newLocation: string, endDate: Dayjs | undefined, calendarEvent: Product) {
	// 	// -- Update calendarEvent --
	// 	const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
	// 	const { firebaseApp } = await import('$lib/firebase/Firebase')
	// 	const firestore = getFirestore(firebaseApp)

	// 	const calendarEventRef = doc(firestore, Collections.CALENDAR_EVENTS, calendarEvent.id)
	// 	await updateDoc(calendarEventRef, {
	// 		title: newTitle,
	// 		info: newInfo,
	// 		date: newDate.toDate(),
	// 		duration: newDuration,
	// 		location: newLocation,
	// 		endDate: endDate ? endDate.toDate() : null
	// 	})

	// 	// -- Update store --
	// 	calendarEvent.title = newTitle
	// 	calendarEvent.info = newInfo
	// 	calendarEvent.date = newDate
	// 	calendarEvent.duration = newDuration
	// 	calendarEvent.location = newLocation
	// 	update((calendarEvents) => [...calendarEvents])
	// }

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
		// getProductById,
		// updateProduct,
		// deleteProduct,
	}
}

export const productStore = createProductStore()
