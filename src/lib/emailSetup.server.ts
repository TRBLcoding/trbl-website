import { GOOGLE_APP_PASSWORD, GOOGLE_INTERMEDIARY_EMAIL } from "$env/static/private"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: GOOGLE_INTERMEDIARY_EMAIL,
    pass: GOOGLE_APP_PASSWORD,
  },
})

transporter.verify((error) => {
  if (error) {
    console.error(error)
  } else {
    console.log("Server is ready to take our messages")
  }
})

export default transporter