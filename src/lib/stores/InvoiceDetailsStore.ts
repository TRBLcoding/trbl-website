import { browser } from '$app/environment'
import { InvoiceDetails } from '$lib/domain/InvoiceDetails'
import type { Database } from '$lib/supabase/database.types'
import { supabase } from "$lib/supabase/supabaseClient"
import { createPostgrestErrorFromObject, handleSupabaseDeleteError, handleSupabaseUpdateError } from '$lib/utils/SupabaseUtils'
import { get, writable } from 'svelte/store'

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
			const products = (data || []).map(InvoiceDetails.fromJSON)
			update(() => products)
		}
	}
	const initPromise: Promise<void> = init()

	async function createInvoiceDetails(newInvoideDetails: InvoiceDetails) {
		// -- Create invoiceDetails --
		const { data, error } = await supabase
			.from('invoice_details')
			.insert(newInvoideDetails.toJSON())
			.select('id')
		if (error)
			throw createPostgrestErrorFromObject(error)

		// Replace temporary ID with Databse created ID
		newInvoideDetails.id = data[0].id

		// -- Update store --
		update((products) => {
			return [...(products || []), newInvoideDetails]
		})
	}

	async function getInvoiceDetailsById(id: number) {
		// -- Get invoiceDetails --
		await initPromise
		const invoiceDetails = get(store)
		return invoiceDetails?.find((e) => e.id === id)
	}

	async function updateInvoiceDetails(invoiceDetails: InvoiceDetails, newFirstName: string, newLastName: string, newEmailAddress: string, newPhoneNumber: string, newCompanyName: string, newBTWNumber: string | null, newStreetAndNumber: string, newPostalCode: string, newPlace: string, newCountry: string,) {
		// -- Update invoiceDetails -- 
		const { data, error } = await supabase
			.from('invoice_details')
			.update({
				first_name: newFirstName,
				last_name: newLastName,
				email_address: newEmailAddress,
				phone_number: newPhoneNumber,
				company_name: newCompanyName,
				btw_number: newBTWNumber,
				street_and_number: newStreetAndNumber,
				postal_code: newPostalCode,
				place: newPlace,
				country: newCountry
			} as Database['public']['Tables']['invoice_details']['Update'])
			.eq('id', invoiceDetails.id)
			.select('id')

		handleSupabaseUpdateError(error, data, "invoice details")

		// -- Update store --
		invoiceDetails.firstName = newFirstName
		invoiceDetails.lastName = newLastName
		invoiceDetails.emailAddress = newEmailAddress
		invoiceDetails.phoneNumber = newPhoneNumber
		invoiceDetails.companyName = newCompanyName
		invoiceDetails.BTWNumber = newBTWNumber
		invoiceDetails.streetAndNumber = newStreetAndNumber
		invoiceDetails.postalCode = newPostalCode
		invoiceDetails.place = newPlace
		invoiceDetails.country = newCountry
		update((products) => [...products])
	}

	async function deleteInvoiceDetails(invoiceDetails: InvoiceDetails) {
		// -- Remove product --
		const { error, count } = await supabase
			.from('invoice_details')
			.delete({ count: 'exact' })
			.eq('id', invoiceDetails.id)
		handleSupabaseDeleteError(error, count, "invoice details")

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
