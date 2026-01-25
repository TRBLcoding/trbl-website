import { GOOGLE_ADMIN_EMAIL, GOOGLE_INTERMEDIARY_EMAIL } from "$env/static/private"
import { getAdminInvoiceRequestTemplate, getCustomerInvoiceRequestTemplate } from "$lib/templates/invoiceRequestTempate"
import { BadRequestError } from "$lib/utils/Errors"
import type { Options } from "nodemailer/lib/mailer"

export type DeliveryMethod = "pick-up" | "delivery"
export type PaymentMethod = "bank-transfer" | "cash"

const INVOICE_REQUEST_REQUIRED_FIELDS: readonly (keyof InvoiceRequest)[] = ['firstName', 'lastName', 'emailAddress', 'phoneNumber', 'companyName', 'streetAndNumber', 'postalCode', 'place', 'country', 'selectedProducts', 'eventType', 'rentPeriod', 'paymentMethod', 'deliveryMethod']
export type InvoiceRequest = {
	firstName: string
	lastName: string
	emailAddress: string
	phoneNumber: string
	companyName: string
	BTWNumber: string | null
	streetAndNumber: string
	postalCode: string
	place: string
	country: string

	selectedProducts: { id: number, amount: number }[]
	eventType: string
	rentPeriod: string
	couponCode: string | null
	paymentMethod: PaymentMethod

	deliveryMethod: DeliveryMethod
	deliveryDetails?: DeliveryDetails
}
export type DeliveryDetails = {
	deliveryFirstName: string
	deliveryLastName: string
	deliveryStreetAndNumber: string
	deliveryPostalCode: string
	deliveryPlace: string
	deliveryCountry: string
}

/**
 * Domain class representing an invoice message sent from the invoice request form.
 */
export class InvoiceMessage {
	constructor(
		public firstName: string,
		public lastName: string,
		public emailAddress: string,
		public phoneNumber: string,
		public companyName: string,
		public BTWNumber: string | null,
		public streetAndNumber: string,
		public postalCode: string,
		public place: string,
		public country: string,
		public selectedProducts: { id: number, amount: number }[],
		public eventType: string,
		public rentPeriod: string,
		public couponCode: string | null,
		public paymentMethod: PaymentMethod,
		public deliveryMethod: DeliveryMethod,
		public deliveryDetails?: DeliveryDetails,
	) { }

	static fromJSON(json: InvoiceRequest) {
		const missingFields = INVOICE_REQUEST_REQUIRED_FIELDS.filter(field => !json[field])
		if (missingFields.length > 0)
			throw new BadRequestError(`Missing required fields: ${missingFields.join(', ')}`)

		return new InvoiceMessage(
			json.firstName,
			json.lastName,
			json.emailAddress,
			json.phoneNumber,
			json.companyName,
			json.BTWNumber,
			json.streetAndNumber,
			json.postalCode,
			json.place,
			json.country,
			json.selectedProducts,
			json.eventType,
			json.rentPeriod,
			json.couponCode,
			json.paymentMethod,
			json.deliveryMethod,
			json.deliveryDetails,
		)
	}

	async toAdminEmail() {
		const email: Options = {
			from: GOOGLE_INTERMEDIARY_EMAIL,
			to: GOOGLE_ADMIN_EMAIL,
			subject: `TRBL Bestelling: aanvraag tot offerte`,
			replyTo: this.emailAddress,
			html: await getAdminInvoiceRequestTemplate(this),
		}
		return email
	}
	async toCustomerEmail() {
		const email: Options = {
			from: GOOGLE_INTERMEDIARY_EMAIL,
			to: this.emailAddress,
			subject: `No Reply TRBL Bestelling: aanvraag tot offerte`,
			replyTo: "",
			html: await getCustomerInvoiceRequestTemplate(this),
		}
		return email
	}
}