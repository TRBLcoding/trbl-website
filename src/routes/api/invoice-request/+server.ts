import { InvoiceMessage } from "$lib/domain/InvoiceRequest"
import transporter from "$lib/emailSetup.server"
import { BadRequestError } from "$lib/utils/Errors"
import { json } from '@sveltejs/kit'

export type InvoiceRequestResponseJSON = {
	message: string
}

export async function POST({ request }) {
	try {
		const invoiceMessage = InvoiceMessage.fromJSON(await request.json())
		console.log(invoiceMessage)
		const response1 = await transporter.sendMail(await invoiceMessage.toAdminEmail())
		console.log("Email sent to admin:", response1)
		const response2 = await transporter.sendMail(await invoiceMessage.toCustomerEmail())
		console.log("Email sent to customer:", response2)

		return json({ message: "Email sent successfully" } satisfies InvoiceRequestResponseJSON)
	} catch (error) {
		console.error("Failed to send email:", error)

		if (error instanceof BadRequestError)
			return json({ message: error.message } satisfies InvoiceRequestResponseJSON, { status: 400 })
		if (error instanceof Error)
			return json({ message: error.message } satisfies InvoiceRequestResponseJSON, { status: 500 })
		return json({ message: "Failed to send email" } satisfies InvoiceRequestResponseJSON, { status: 500 })
	}
}
