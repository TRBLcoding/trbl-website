import { browser } from '$app/environment'
import { InvoiceDetails } from '$lib/domain/InvoiceDetails'
import { supabase } from "$lib/supabase/supabaseClient"
import { createPostgrestErrorFromObject } from '$lib/utils/SupabaseUtils'
import { writable, type Writable } from 'svelte/store'
import { type UploadProgress } from '../utils/UploadProgress'

function createInvoiceDetailsStore() {
	const store = writable<InvoiceDetails[]>(undefined)
	const { subscribe, update } = store

	async function init() {
		if (!browser) return

		const { error, data } = await supabase.from("invoice_details").select()
		if (error) {
			if (error?.message === "TypeError: Failed to fetch")
				throw createPostgrestErrorFromObject(error)
			throw error
		} else {
			let products = (data || []).map(InvoiceDetails.fromJSON)
			update(() => products)
		}
	}
	const initPromise: Promise<void> = init()

	async function createInvoiceDetails(newInvoideDetails: InvoiceDetails) {
		// -- Create product --
		const { data, error } = await supabase
			.from('invoice_details')
			.insert(newInvoideDetails.toJSON())
			.select('id')
		if (error)
			throw createPostgrestErrorFromObject(error)
		newInvoideDetails.id = data[0].id
		console.log("Created new invoice details with ID " + newInvoideDetails.id)
		// -- Update store --
		update((products) => {
			return [...(products || []), newInvoideDetails]
		})
	}

	async function getInvoiceDetailsById(id: number) {
		// // -- Get product --
		// await initPromise
		// const products = get(store)
		// return products?.find((e) => e.id === id)
	}

	async function updateInvoiceDetails(product: InvoiceDetails, newName: string, newVisible: boolean, newPrice: number, newCombinedImages: (string | File)[], newDescription: string, newMaxOrderAmount: null | number, progressStore: Writable<UploadProgress[]>) {
		// // -- Update product --
		// const { data, error } = await supabase
		// 	.from('products')
		// 	.update({
		// 		name: newName,
		// 		visible: newVisible,
		// 		price: newPrice,
		// 		imageIds: uploadedImageIds,
		// 		categories: newCategories,
		// 		type: newType,
		// 		description: newDescription,
		// 		maxOrderAmount: newMaxOrderAmount
		// 	} as Database['public']['Tables']['products']['Update'])
		// 	.eq('id', product.id)
		// 	.select('id')

		// if (error) {
		// 	console.error(error)
		// 	if (error.message === "TypeError: Failed to fetch")
		// 		throw new Error(`Network error while updating products: ${error?.message}`)
		// 	throw new Error(`Error updating product: ${error?.message}`)
		// }
		// else if (!data || data.length === 0) {
		// 	throw new Error(`No products updated. Possible causes: unverrified account, insufficient permissions, incorrect RLS policies, ...`)
		// }
		// else if (data.length > 1) {
		// 	throw new Error(`Multiple (${data.length}) products updated. This should not happen because product ID is unique`)
		// }


		// // -- Update store --
		// product.name = newName
		// product.visible = newVisible
		// product.price = newPrice
		// product.imageIds = uploadedImageIds
		// product.categories = newCategories
		// product.type = newType
		// product.description = newDescription
		// product.maxOrderAmount = newMaxOrderAmount
		// update((products) => [...products])
	}

	async function deleteInvoiceDetails(invoiceDetails: InvoiceDetails) {
		// -- Remove product --
		const { error, count } = await supabase
			.from('invoice_details')
			.delete({ count: 'exact' })
			.eq('id', invoiceDetails.id)
		if (error) {
			throw error
		} else if (!count || count === 0) {
			throw new Error(`No invoices details deleted. Possible causes: unverrified account, insufficient permissions, incorrect RLS policies, ...`)
		} else if (count > 1) {
			throw new Error(`Multiple (${count}) invoice details deleted. This should not happen because ID is unique`)
		}

		// -- Remove from store --
		update((invoiceDetailArray) => (invoiceDetailArray.filter((e) => e.id !== invoiceDetails.id)))
	}

	return {
		subscribe,
		createInvoiceDetails,
		getInvoiceDetailsById,
		updateInvoiceDetails,
		deleteInvoiceDetails,
		initPromise
	}
}

export const invoiceDetailsStore = createInvoiceDetailsStore()
