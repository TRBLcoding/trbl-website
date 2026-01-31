import { env } from "$env/dynamic/private"
import { getAdminContactFormTemplate, getCustomerContactFormTemplate } from "$lib/templates/contactFormTemplate"
import { BadRequestError } from "$lib/utils/Errors"
import type { Options } from "nodemailer/lib/mailer"

const CONTACT_REQUEST_REQUIRED_FIELDS: readonly (keyof ContactRequestJSON)[] = ['firstName', 'lastName', 'emailAddress', 'subject', 'message']
export type ContactRequestJSON = {
	firstName: string
	lastName: string
	emailAddress: string
	subject: string
	message: string
}

/**
 * Domain class representing a contact message sent from a contact form.
 */
export class ContactMessage {
	constructor(
		public firstName: string,
		public lastName: string,
		public emailAddress: string,
		public subject: string,
		public message: string
	) { }

	static fromJSON(json: ContactRequestJSON) {
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
			from: env.GOOGLE_INTERMEDIARY_EMAIL,
			to: env.GOOGLE_ADMIN_EMAIL,
			subject: `TRBL Contactformulier: ${this.subject}`,
			replyTo: this.emailAddress,
			text: this.message,
			html: getAdminContactFormTemplate(this),
		}
		return email
	}

	toCustomerEmail() {
		const email: Options = {
			from: env.GOOGLE_INTERMEDIARY_EMAIL,
			to: this.emailAddress,
			subject: `No Reply TRBL Contactformulier: ${this.subject}`,
			replyTo: "",
			text: this.message,
			html: getCustomerContactFormTemplate(this),
		}
		return email
	}
}