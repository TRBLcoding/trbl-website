import { GOOGLE_ADMIN_EMAIL, GOOGLE_INTERMEDIARY_EMAIL } from "$env/static/private"
import { getAdminContactFormTemplate, getCustomerContactFormTemplate } from "$lib/templates/contactFormTemplate"
import { BadRequestError } from "$lib/utils/Errors"
import type { Options } from "nodemailer/lib/mailer"

const CONTACT_REQUEST_REQUIRED_FIELDS: readonly (keyof ContactRequest)[] = ['firstName', 'lastName', 'emailAddress', 'subject', 'message']
export type ContactRequest = {
	firstName: string
	lastName: string
	emailAddress: string
	subject: string
	message: string
}

export class ContactMessage {
	constructor(
		public firstName: string,
		public lastName: string,
		public emailAddress: string,
		public subject: string,
		public message: string
	) { }

	static fromJSON(json: ContactRequest) {
		const missingFields = CONTACT_REQUEST_REQUIRED_FIELDS.filter(field => !json[field])
		if (missingFields.length > 0)
			throw new BadRequestError(`Missing required fields: ${missingFields.join(', ')}`)

		return new ContactMessage(
			json.firstName,
			json.lastName,
			json.emailAddress,
			json.subject,
			json.message
		)
	}

	toAdminEmail() {
		const email: Options = {
			from: GOOGLE_INTERMEDIARY_EMAIL,
			to: GOOGLE_ADMIN_EMAIL,
			subject: `TRBL Contactformulier: ${this.subject}`,
			replyTo: this.emailAddress,
			text: this.message,
			html: getAdminContactFormTemplate(this),
		}
		return email
	}

	toCustomerEmail() {
		const email: Options = {
			from: GOOGLE_INTERMEDIARY_EMAIL,
			to: this.emailAddress,
			subject: `No Reply TRBL Contactformulier: ${this.subject}`,
			replyTo: "",
			text: this.message,
			html: getCustomerContactFormTemplate(this),
		}
		return email
	}
}