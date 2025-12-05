const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env.local');

console.log('Checking .env.local at:', envPath);

if (fs.existsSync(envPath)) {
  console.log('File exists.');
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  
  if (envConfig.DATABASE_URL) {
    console.log('DATABASE_URL is present.');
    console.log('Value starts with:', envConfig.DATABASE_URL.substring(0, 15) + '...');
  } else {
    console.log('DATABASE_URL is MISSING in .env.local');
    console.log('Keys found:', Object.keys(envConfig));
  }
} else {
  console.log('File does NOT exist.');
}

