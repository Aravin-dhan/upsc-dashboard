#!/usr/bin/env node

/**
 * AI Assistant Test Script for UPSC Dashboard
 * Tests the AI assistant functionality across all dashboard pages
 */

const https = require('https');

// Configuration
const PRODUCTION_URL = 'https://upsc-dashboard-three.vercel.app';
const ADMIN_CREDENTIALS = {
  email: 'admin@upsc.local',
  password: 'admin123'
};

// Helper function to make HTTP requests
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

// Test AI assistant endpoints
async function testAIAssistant() {
  console.log('🤖 UPSC Dashboard AI Assistant Test Suite');
  console.log('Testing AI assistant functionality...\n');

  try {
    // Step 1: Login to get session
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
    console.log('   ✅ Login successful');

    // Step 2: Test AI assistant endpoint
    console.log('\n2️⃣  Testing AI Assistant API...');
    const aiResponse = await makeRequest(`${PRODUCTION_URL}/api/ai-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    }, JSON.stringify({
      message: 'Hello, can you help me navigate to the dashboard?',
      context: {
        currentPage: '/dashboard',
        userRole: 'admin'
      }
    }));

    console.log(`   Status: ${aiResponse.status}`);
    if (aiResponse.status === 200) {
      console.log('   ✅ AI Assistant API working');
      console.log(`   Response: ${JSON.stringify(aiResponse.body, null, 2)}`);
    } else {
      console.log('   ❌ AI Assistant API failed');
      console.log(`   Error: ${JSON.stringify(aiResponse.body, null, 2)}`);
    }

    // Step 3: Test AI usage tracking
    console.log('\n3️⃣  Testing AI Usage Tracking...');
    const usageResponse = await makeRequest(`${PRODUCTION_URL}/api/ai-assistant/usage`, {
      method: 'GET',
      headers: {
        'Cookie': cookies
      }
    });

    console.log(`   Status: ${usageResponse.status}`);
    if (usageResponse.status === 200) {
      console.log('   ✅ AI Usage tracking working');
      console.log(`   Usage data: ${JSON.stringify(usageResponse.body, null, 2)}`);
    } else {
      console.log('   ❌ AI Usage tracking failed');
    }

    // Step 4: Test chat endpoint
    console.log('\n4️⃣  Testing Chat Endpoint...');
    const chatResponse = await makeRequest(`${PRODUCTION_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    }, JSON.stringify({
      message: 'What is the UPSC syllabus for General Studies?',
      context: 'upsc_preparation'
    }));

    console.log(`   Status: ${chatResponse.status}`);
    if (chatResponse.status === 200) {
      console.log('   ✅ Chat endpoint working');
    } else {
      console.log('   ❌ Chat endpoint failed');
      console.log(`   Error: ${JSON.stringify(chatResponse.body, null, 2)}`);
    }

    // Step 5: Test answer analysis
    console.log('\n5️⃣  Testing Answer Analysis...');
    const analysisResponse = await makeRequest(`${PRODUCTION_URL}/api/ai/analyze-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    }, JSON.stringify({
      question: 'What is the significance of the Indian Constitution?',
      answer: 'The Indian Constitution is the supreme law of India. It was adopted on 26th November 1949.',
      subject: 'Polity'
    }));

    console.log(`   Status: ${analysisResponse.status}`);
    if (analysisResponse.status === 200) {
      console.log('   ✅ Answer analysis working');
    } else {
      console.log('   ❌ Answer analysis failed');
    }

    console.log('\n🎉 AI Assistant test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAIAssistant();
