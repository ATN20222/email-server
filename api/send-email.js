import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { subject, message, from, fields, html } = req.body;

  if (!subject) return res.status(400).json({ error: 'Subject is required' });
  if (!message && !html) return res.status(400).json({ error: 'Message or HTML required' });

  try {
    const transporter = createTransporter();
    const emailData = {
      from: from || 'noreply@ado-egy.com',
      to: process.env.TO_EMAIL,
      subject,
      html: html || `<p>${message}</p>`,
    };

    const info = await transporter.sendMail(emailData);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
