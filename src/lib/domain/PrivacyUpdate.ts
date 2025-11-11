import { GOOGLE_ADMIN_EMAIL, GOOGLE_INTERMEDIARY_EMAIL } from "$env/static/private"
import { getPrivacyPolicyUpdateTemplace } from "$lib/templates/privacyPolicyUpdateTemplate"
import { BadRequestError } from "$lib/utils/Errors"
import type { Options } from "nodemailer/lib/mailer"

const CONTACT_REQUEST_REQUIRED_FIELDS: readonly (keyof PrivacyUpdateJSON)[] = ['notableChanges']
export type PrivacyUpdateJSON = {
	notableChanges: string
}

export class PrivacyUpdate {
	constructor(
		public notableChanges: string,
	) { }

	static fromJSON(json: PrivacyUpdateJSON) {
		const missingFields = CONTACT_REQUEST_REQUIRED_FIELDS.filter(field => !json[field])
		if (missingFields.length > 0)
			throw new BadRequestError(`Missing required fields: ${missingFields.join(', ')}`)

		return new PrivacyUpdate(
			json.notableChanges,
		)
	}

	toEmail(emailAddress: string, firstName: string, lastName: string) {
		const email: Options = {
			from: GOOGLE_INTERMEDIARY_EMAIL,
			to: emailAddress,
			subject: `TRBL Privacy Update`,
			replyTo: "NOREPLY",
			html: getPrivacyPolicyUpdateTemplace(this, firstName, lastName),
		}
		return email
	}
}