import nodemailer from "nodemailer";
import { config } from "../config.js";

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass
  }
});

export async function sendBookingConfirmation(booking) {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    return;
  }

  await transporter.sendMail({
    from: config.mailFrom,
    to: booking.email,
    subject: "Victor's Events - Booking Received",
    html: `
      <h2>Thank you for booking with Victor's Events</h2>
      <p>Hello ${booking.name},</p>
      <p>We received your booking request for <strong>${booking.date}</strong>.</p>
      <p>Our team will contact you shortly to confirm details and payment.</p>
      <p>Regards,<br/>Victor's Events Team</p>
    `
  });
}
