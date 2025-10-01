import { GOOGLE_ADMIN_EMAIL, GOOGLE_INTERMEDIARY_EMAIL } from "$env/static/private"
import { getAdminContactFormTemplate } from "$lib/templates/contactFormTemplate"
import { BadRequestError } from "$lib/utils/Errors"
import type { Options } from "nodemailer/lib/mailer"

export type ContactRequest = {
	firstName: string
	lastName: string
	emailAdress: string
	subject: string
	message: string
}

export class ContactMessage {
	constructor(
		public firstName: string,
		public lastName: string,
		public emailAdress: string,
		public subject: string,
		public message: string
	) { }

	static fromJSON(json: any): ContactMessage {
		const requiredFields = ['firstName', 'lastName', 'emailAdress', 'subject', 'message']
		const missingFields = requiredFields.filter(field => !json[field])

		if (missingFields.length > 0) {
			throw new BadRequestError(`Missing required fields: ${missingFields.join(', ')}`)
		}

		return new ContactMessage(
			json.firstName,
			json.lastName,
			json.emailAdress,
			json.subject,
			json.message
		)
	}

	toAdminEmail() {
		const email: Options = {
			from: GOOGLE_INTERMEDIARY_EMAIL,
			to: GOOGLE_ADMIN_EMAIL,
			subject: `TRBL Contactformulier: ${this.subject}`,
			replyTo: this.emailAdress,
			text: this.message,
			html: getAdminContactFormTemplate(this),
		}
		return email
	}
}