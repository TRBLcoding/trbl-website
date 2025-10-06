import { InvoiceMessage } from "$lib/domain/InvoiceRequest"
import transporter from "$lib/emailSetup.server"
import { BadRequestError } from "$lib/utils/Errors"
import { json } from '@sveltejs/kit'

export async function POST({ request }) {
	try {
		const invoiceMessage = InvoiceMessage.fromJSON(await request.json())
		console.log(invoiceMessage)
		// const response1 = await transporter.sendMail(invoiceMessage.toAdminEmail())
		// console.log("Email sent to admin:", response1)
		// const response2 = await transporter.sendMail(invoiceMessage.toCustomerEmail())
		// console.log("Email sent to customer:", response2)
	
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
