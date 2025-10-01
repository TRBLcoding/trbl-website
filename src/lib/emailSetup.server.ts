import nodemailer from "nodemailer";
import { GOOGLE_INTERMEDIARY_EMAIL, GOOGLE_APP_PASSWORD } from "$env/static/private";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: GOOGLE_INTERMEDIARY_EMAIL,
    pass: GOOGLE_APP_PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;