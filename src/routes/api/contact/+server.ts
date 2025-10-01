import { ContactMessage } from '$lib/domain/ContactMessage'
import transporter from "$lib/emailSetup.server"
import { BadRequestError } from '$lib/utils/Errors.js'
import { json } from '@sveltejs/kit'

export async function POST({ request }) {
	try {
		const message = ContactMessage.fromJSON(await request.json())
		const response1 = await transporter.sendMail(message.toAdminEmail())
		console.log("Email sent to admin:", response1)
		const response2 = await transporter.sendMail(message.toCustomerEmail())
		console.log("Email sent to customer successfully:", response2)

		return json({ success: true, message: "Email sent successfully" })
	} catch (error) {
		console.error("Failed to send email:", error)

		if (error instanceof BadRequestError)
			return json({ success: false, detailedError: error.message }, { status: 400 })
		if (error instanceof Error)
			return json({ success: false, detailedError: error.message }, { status: 500 })
		return json({ success: false, error: { message: "Failed to send email" } }, { status: 500 })
	}
}
