#!/usr/bin/env node

/**
 * Test script for the fixed Chat API
 */

const https = require('https');

const PRODUCTION_URL = 'https://upsc-dashboard-three.vercel.app';
const ADMIN_CREDENTIALS = {
  email: 'admin@upsc.local',
  password: 'admin123'
};

function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonBody,
            cookies: res.headers['set-cookie'] || []
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body,
            cookies: res.headers['set-cookie'] || []
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testChatAPI() {
  console.log('🧪 Testing Fixed Chat API');
  console.log('========================\n');

  try {
    // Step 1: Login
    console.log('1️⃣  Logging in...');
    const loginData = JSON.stringify(ADMIN_CREDENTIALS);
    const loginResponse = await makeRequest(`${PRODUCTION_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    }, loginData);

    if (loginResponse.status !== 200) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const cookies = loginResponse.cookies.join('; ');
    console.log('   ✅ Login successful\n');

    // Step 2: Test chat API with simple message format
    console.log('2️⃣  Testing Chat API with simple message format...');
    const simpleMessageResponse = await makeRequest(`${PRODUCTION_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    }, JSON.stringify({
      message: 'What is the UPSC syllabus for General Studies?',
      context: 'upsc_preparation'
    }));

    console.log(`   Status: ${simpleMessageResponse.status}`);
    if (simpleMessageResponse.status === 200) {
      console.log('   ✅ Simple message format working');
      console.log(`   Response preview: ${simpleMessageResponse.body.response?.substring(0, 100)}...`);
    } else {
      console.log('   ❌ Simple message format failed');
      console.log(`   Error: ${JSON.stringify(simpleMessageResponse.body, null, 2)}`);
    }

    // Step 3: Test chat API with history format
    console.log('\n3️⃣  Testing Chat API with history format...');
    const historyResponse = await makeRequest(`${PRODUCTION_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    }, JSON.stringify({
      history: [
        { role: 'user', content: 'Hello, I need help with UPSC preparation' },
        { role: 'assistant', content: 'I\'d be happy to help you with UPSC preparation!' },
        { role: 'user', content: 'What are the important topics in Indian History?' }
      ],
      context: 'upsc_preparation'
    }));

    console.log(`   Status: ${historyResponse.status}`);
    if (historyResponse.status === 200) {
      console.log('   ✅ History format working');
      console.log(`   Response preview: ${historyResponse.body.response?.substring(0, 100)}...`);
    } else {
      console.log('   ❌ History format failed');
      console.log(`   Error: ${JSON.stringify(historyResponse.body, null, 2)}`);
    }

    // Step 4: Test error handling with empty message
    console.log('\n4️⃣  Testing error handling with empty message...');
    const errorResponse = await makeRequest(`${PRODUCTION_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    }, JSON.stringify({
      message: '',
      context: 'upsc_preparation'
    }));

    console.log(`   Status: ${errorResponse.status}`);
    if (errorResponse.status === 400) {
      console.log('   ✅ Error handling working correctly');
      console.log(`   Error message: ${errorResponse.body.error}`);
    } else {
      console.log('   ❌ Error handling not working as expected');
    }

    console.log('\n🎉 Chat API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testChatAPI();
