import type { Database } from "$lib/supabase/database.types"

export class InvoiceDetails {
	constructor(
		public id: number,
		public authId: string,
		public fistName: string,
		public lastName: string,
		public companyName: string|null,
	){}

	toJSON() {
		return {
			auth_id: this.authId,
			first_name: this.fistName,
			last_name: this.lastName,
			company_name: this.companyName,
		} as Database['public']['Tables']['invoice_details']['Insert']
	}

	static fromJSON(json: any) {
		return new InvoiceDetails(
			json.id,
			json.user_id,
			json.first_name,
			json.last_name,
			json.company_name,
		)
	}
}