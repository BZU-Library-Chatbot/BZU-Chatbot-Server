import nodemailer from "nodemailer";

// The async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to, subject, html, attachments) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.EMAIL, // Generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // Generated ethereal password
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: `Chatbot" <${process.env.EMAIL}>`, // Sender address
    to, // List of receivers
    subject, // Subject line
    html, // Html body
    attachments,
  });
}
