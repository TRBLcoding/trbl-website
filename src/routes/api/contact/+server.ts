import { json } from '@sveltejs/kit'
import { GOOGLE_EMAIL } from "$env/static/private"
import transporter from "$lib/emailSetup.server"
import type { Options } from "nodemailer/lib/mailer"

export type ContactRequest = {
	firstName: string
	lastName: string
	emailAdress: string
	subject: string
	message: string
}
export async function POST({ request }) {
	try {
		const data: ContactRequest = await request.json()
		const { emailAdress, subject, message } = data

		if (!emailAdress || !subject || !message) {
			return json({ success: false, detailedError: "Missing required fields" }, { status: 400 })
		}

		const html = `<h2>Hi!</h2><pre>${message}</pre>`

		const email: Options = {
			from: GOOGLE_EMAIL,
			to: emailAdress,
			subject: subject,
			text: message,
			html: html,
		}

		await new Promise((resolve, reject) => {
			transporter.sendMail(email, (err, info) => {
				if (err) {
					console.error(err)
					reject(err)
				} else {
					resolve(info)
				}
			})
		})

		return json({ success: true, message: "Email sent successfully" })
	} catch (error) {
		console.error(error)
		return json({ success: false, error: { message: "Failed to send email" } }, { status: 500 })
	}
}

// import { GOOGLE_EMAIL } from "$env/static/private"
// import transporter from "$lib/emailSetup.server"
// import type { Options } from "nodemailer/lib/mailer"

// export const actions = {
//     sendEmail: async ({ request }) => {
//         try {
//             const formData = await request.formData()
//             const email = formData.get("to")?.toString()
//             const subject = formData.get("subject")?.toString()
//             const body = formData.get("body")?.toString()
//             console.log(body)
//             let html = `<h2>Hi!</h2><pre>${body}</pre>`

//             const message: Options = {
//                 from: GOOGLE_EMAIL,
//                 to: email,
//                 subject: subject,
//                 text: body,
//                 html: html,
//             }

//             const sendEmail = async (message: Options) => {
//                 await new Promise((resolve, reject) => {
//                     transporter.sendMail(message, (err, info) => {
//                         if (err) {
//                             console.error(err)
//                             reject(err)
//                         } else {
//                             resolve(info)
//                         }
//                     })
//                 })
//             }

//             await sendEmail(message)

//             return {
//                 success: "Email is sent",
//             }
//         } catch (error) {
//             console.error(error)
//         }
//     }
// }