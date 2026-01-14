import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Generate HTML email template
const generateEmailHTML = (data) => {
  const primary = '#0413b8';
  const secondary = '#b6232d';
  const accent = '#38bdf8';
  const textColor = '#0f172a';
  const muted = '#64748b';

  return `
  <div dir="ltr" lang="en" style="margin:0;padding:0;background:#F7F8FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:${textColor};">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#F7F8FA;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#ffffff;border-radius:16px;box-shadow:0 10px 24px rgba(16,24,40,0.08);overflow:hidden;border:1px solid rgba(40,44,73,0.06);">
            <tr>
              <td style="padding:0">
                <div style="height:6px;background: ${primary};"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px 24px">
                <div style="text-align:center;margin-bottom:16px;">
                  <h1 style="margin:0;color:${primary};font-size:24px;font-weight:700;">A.D.O CONSULT</h1>
                  <p style="margin:4px 0 0 0;color:${muted};font-size:14px;">Engineering Excellence & MEP Solutions</p>
                </div>
                <h2 style="margin:0 0 8px 0;color:${secondary};font-size:22px;">${data.subject}</h2>
                <p style="margin:0;color:${muted};font-size:14px;">A new message has been received.</p>
              </td>
            </tr>
            ${data.fields ? `
            <tr>
              <td style="padding:0 24px 8px 24px">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 8px;">
                  ${data.fields.map(field => `
                  <tr>
                    <td style="background:#F0F4FF;border:1px solid rgba(4,19,184,0.25);border-radius:12px;padding:12px 14px;">
                      <strong style="color:${secondary};">${field.label}:</strong> ${field.value}
                    </td>
                  </tr>
                  `).join('')}
                </table>
              </td>
            </tr>
            ` : ''}
            ${data.message ? `
            <tr>
              <td style="padding:8px 24px 16px 24px">
                <div style="background:#ffffff;border:1px solid rgba(40,44,73,0.08);border-radius:12px;padding:16px;">
                  <div style="color:${secondary};font-weight:700;margin-bottom:8px;">Message</div>
                  <div style="color:${textColor};white-space:pre-wrap;line-height:1.8;">${data.message}</div>
                </div>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding:0 24px 24px 24px">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <a href="mailto:${data.replyTo || data.from}" style="display:inline-block;background:${primary};color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700;">Reply to Sender</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px 20px 24px;background:#FAFAFB;border-top:1px solid rgba(16,24,40,0.06);">
                <p style="margin:0;font-size:12px;color:${muted};">Sent by A.D.O CONSULT Email Service | Building 7881, Street 9, Mokattam, Cairo, Egypt</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
};

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      to,
      subject,
      message,
      from,
      name,
      phone,
      fields,
      html
    } = req.body;

    // Basic validation
    if (!subject) {
      return res.status(400).json({
        success: false,
        error: 'Subject is required'
      });
    }

    if (!message && !html) {
      return res.status(400).json({
        success: false,
        error: 'Message or HTML content is required'
      });
    }

    // Prepare email data
    const emailData = {
      from: `"ADO Consult" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      subject,
      html: html || generateEmailHTML({
        subject,
        message,
        from,
        fields: fields || [
          name && { label: 'Name', value: name },
          from && { label: 'Email', value: from },
          phone && { label: 'Phone', value: phone }
        ].filter(Boolean)
      }),
      replyTo: from,
    };

    // Send email
    const transporter = createTransporter();
    const result = await transporter.sendMail(emailData);

    console.log('Email sent successfully:', result.messageId);

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
