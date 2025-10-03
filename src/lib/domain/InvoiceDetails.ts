import type { Database } from "$lib/supabase/database.types"

export class InvoiceDetails {
	constructor(
		public id: number,
		public authId: string,
		public fistName: string,
		public lastName: string,
		public emailAddress: string,
		public phoneNumber: string,
		public companyName: string,
		public BTWNumber: string | null,
		public streetAndNumber: string,
		public postalCode: string,
		public place: string,
		public country: string,
	) { }

	toJSON() {
		return {
			auth_id: this.authId,
			first_name: this.fistName,
			last_name: this.lastName,
			email_address: this.emailAddress,
			phone_number: this.phoneNumber,
			company_name: this.companyName,
			btw_number: this.BTWNumber,
			street_and_number: this.streetAndNumber,
			postal_code: this.postalCode,
			place: this.place,
			country: this.country,
		} as Database['public']['Tables']['invoice_details']['Insert']
	}

	static fromJSON(json: any) {
		return new InvoiceDetails(
			json.id,
			json.auth_id,
			json.first_name,
			json.last_name,
			json.email_adress,
			json.phone_number,
			json.company_name,
			json.btw_number,
			json.street_and_number,
			json.postal_code,
			json.place,
			json.country,
		)
	}
}