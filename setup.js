// Setup script to help configure the email service
import { readFileSync, writeFileSync, renameSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Setting up ADO Email Service...\n');

// Check if .env exists, if not create from env.txt
const envPath = join(__dirname, '.env');
const envTxtPath = join(__dirname, 'env.txt');

try {
  // Try to read .env first
  readFileSync(envPath);
  console.log('✅ .env file already exists');
} catch {
  // If .env doesn't exist, copy from env.txt
  try {
    const envContent = readFileSync(envTxtPath, 'utf8');
    writeFileSync(envPath, envContent);
    console.log('✅ Created .env file from env.txt');
  } catch {
    console.log('❌ Could not create .env file. Please create it manually.');
  }
}

console.log('\n📝 Next steps:');
console.log('1. Edit the .env file with your SMTP settings');
console.log('2. Run: npm start');
console.log('3. Test with: npm run test-email');
console.log('\n📧 Service will run on http://localhost:3001');