import { ContactMessage } from '$lib/domain/ContactMessage'
import transporter from "$lib/emailSetup.server"
import { BadRequestError } from '$lib/utils/Errors.js'
import { json } from '@sveltejs/kit'

export type ContactResponseJSON = {
	message: string
}

export async function POST({ request }) {
	try {
		const contactMessage = ContactMessage.fromJSON(await request.json())
		const response1 = await transporter.sendMail(contactMessage.toAdminEmail())
		console.log("Email sent to admin:", response1)
		const response2 = await transporter.sendMail(contactMessage.toCustomerEmail())
		console.log("Email sent to customer:", response2)

		return json({ message: "Email sent successfully" } satisfies ContactResponseJSON)
	} catch (error) {
		console.error("Failed to send email:", error)

		if (error instanceof BadRequestError)
			return json({ message: error.message } satisfies ContactResponseJSON, { status: 400 })
		if (error instanceof Error)
			return json({ message: error.message } satisfies ContactResponseJSON, { status: 500 })
		return json({ message: "Failed to send email" } satisfies ContactResponseJSON, { status: 500 })
	}
}
