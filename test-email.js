// Test script to send a sample email
import fetch from 'node-fetch';

const testEmail = async () => {
  const testData = {
    subject: 'Test Email from ADO Email Service',
    message: 'This is a test email to verify the email service is working correctly.\n\nIf you received this email, the service is configured properly!',
    from: 'test@example.com',
    name: 'Test User',
    phone: '+1234567890'
  };

  try {
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send test email:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing email service:', error.message);
  }
};

// Run the test
testEmail();