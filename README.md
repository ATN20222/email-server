# ADO Email Service

A simple Node.js email service for sending emails using SMTP.

## Features

- Send emails via SMTP (Gmail, Outlook, etc.)
- RESTful API with Express
- CORS enabled
- Security headers with Helmet
- HTML email templates
- Environment-based configuration

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Copy `env-example.txt` to `.env` and fill in your details:

   ```bash
   cp env-example.txt .env
   ```

   Edit `.env` with your SMTP settings:

   ```env
   # For Gmail SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # For Outlook/Hotmail
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@outlook.com
   SMTP_PASS=your-password

   # Email settings
   FROM_EMAIL=info@ado-egy.com
   TO_EMAIL=info@ado-egy.com

   # Server
   PORT=3001
   NODE_ENV=development
   ```

3. **Start the service:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

## API Usage

### Send Email

**Endpoint:** `POST /api/send-email`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "subject": "New Contact Form Submission",
  "message": "Hello, this is a test message",
  "from": "sender@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "fields": [
    {"label": "Name", "value": "John Doe"},
    {"label": "Email", "value": "sender@example.com"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "1234567890@example.com"
}
```

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-14T12:00:00.000Z",
  "service": "ADO Email Service"
}
```

## SMTP Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Use your Gmail address as `SMTP_USER`
4. Use the App Password as `SMTP_PASS`

### Outlook/Hotmail Setup

1. Use your Outlook/Hotmail email as `SMTP_USER`
2. Use your account password as `SMTP_PASS`
3. Make sure SMTP access is enabled in your account settings

## Integration Example

```javascript
// Send email from your frontend
const sendEmail = async (data) => {
  const response = await fetch('http://localhost:3001/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: 'Contact Form Submission',
      message: data.message,
      from: data.email,
      name: data.name,
      phone: data.phone,
    }),
  });

  const result = await response.json();
  return result;
};
```

## Deployment

This service can be deployed to any Node.js hosting platform:

- Heroku
- DigitalOcean App Platform
- Railway
- AWS EC2
- Google Cloud Run
- Azure App Service

Make sure to set the environment variables in your deployment platform.

## License

ISC