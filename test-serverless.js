// Test script for serverless functions
import sendEmailHandler from './api/send-email.js';
import healthHandler from './api/health.js';

// Mock response object
const createMockRes = () => {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.body = JSON.stringify(data);
      return this;
    },
    setHeader: function(key, value) {
      this.headers[key] = value;
      return this;
    },
    end: function() {
      return this;
    }
  };
  return res;
};

// Test health endpoint
const testHealth = async () => {
  console.log('🩺 Testing health endpoint...');
  const req = { method: 'GET' };
  const res = createMockRes();

  await healthHandler(req, res);

  const responseData = JSON.parse(res.body);
  if (responseData.status === 'OK') {
    console.log('✅ Health endpoint works correctly');
  } else {
    console.log('❌ Health endpoint failed');
  }
};

// Test send-email validation
const testSendEmailValidation = async () => {
  console.log('📧 Testing send-email validation...');

  // Test missing subject
  const req1 = {
    method: 'POST',
    body: { message: 'test' }
  };
  const res1 = createMockRes();

  await sendEmailHandler(req1, res1);

  const responseData1 = JSON.parse(res1.body);
  if (res1.statusCode === 400 && responseData1.error.includes('Subject')) {
    console.log('✅ Subject validation works');
  } else {
    console.log('❌ Subject validation failed');
  }

  // Test missing message
  const req2 = {
    method: 'POST',
    body: { subject: 'test' }
  };
  const res2 = createMockRes();

  await sendEmailHandler(req2, res2);

  const responseData2 = JSON.parse(res2.body);
  if (res2.statusCode === 400 && responseData2.error.includes('Message')) {
    console.log('✅ Message validation works');
  } else {
    console.log('❌ Message validation failed');
  }

  // Test OPTIONS request (CORS)
  const req3 = { method: 'OPTIONS' };
  const res3 = createMockRes();

  await sendEmailHandler(req3, res3);

  if (res3.statusCode === 200) {
    console.log('✅ CORS preflight works');
  } else {
    console.log('❌ CORS preflight failed');
  }
};

const runTests = async () => {
  console.log('🚀 Running serverless function tests...\n');

  await testHealth();
  console.log('');
  await testSendEmailValidation();

  console.log('\n✨ All basic tests completed!');
  console.log('Note: Email sending test requires valid SMTP credentials and will be tested on Vercel deployment.');
};

runTests().catch(console.error);