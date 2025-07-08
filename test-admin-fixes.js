#!/usr/bin/env node

/**
 * Test script for Admin Panel Fixes
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

async function testAdminFixes() {
  console.log('🔧 Testing Admin Panel Fixes');
  console.log('============================\n');

  let cookies = '';
  let testResults = {
    authentication: false,
    chatAPI: false,
    adminContentStats: false,
    adminAnalytics: false,
    adminSettings: false
  };

  try {
    // Step 1: Login
    console.log('1️⃣  Logging in as admin...');
    const loginData = JSON.stringify(ADMIN_CREDENTIALS);
    const loginResponse = await makeRequest(`${PRODUCTION_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    }, loginData);

    if (loginResponse.status === 200) {
      cookies = loginResponse.cookies.join('; ');
      testResults.authentication = true;
      console.log('   ✅ Admin login successful\n');
    } else {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    // Step 2: Test Chat API with simple message
    console.log('2️⃣  Testing fixed Chat API...');
    const chatResponse = await makeRequest(`${PRODUCTION_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    }, JSON.stringify({
      message: 'What is UPSC?',
      context: 'upsc_preparation'
    }));

    console.log(`   Status: ${chatResponse.status}`);
    if (chatResponse.status === 200) {
      testResults.chatAPI = true;
      console.log('   ✅ Chat API working correctly');
      console.log(`   Response preview: ${chatResponse.body.response?.substring(0, 100)}...`);
    } else {
      console.log('   ❌ Chat API still failing');
      console.log(`   Error: ${JSON.stringify(chatResponse.body, null, 2)}`);
    }

    // Step 3: Test Admin Content Stats API
    console.log('\n3️⃣  Testing Admin Content Stats API...');
    const contentStatsResponse = await makeRequest(`${PRODUCTION_URL}/api/admin/content/stats`, {
      method: 'GET',
      headers: {
        'Cookie': cookies
      }
    });

    console.log(`   Status: ${contentStatsResponse.status}`);
    if (contentStatsResponse.status === 200) {
      testResults.adminContentStats = true;
      console.log('   ✅ Admin Content Stats API working');
      console.log(`   Stats: ${JSON.stringify(contentStatsResponse.body.stats, null, 2)}`);
    } else {
      console.log('   ❌ Admin Content Stats API failed');
      console.log(`   Error: ${JSON.stringify(contentStatsResponse.body, null, 2)}`);
    }

    // Step 4: Test Admin Analytics API
    console.log('\n4️⃣  Testing Admin Analytics API...');
    const analyticsResponse = await makeRequest(`${PRODUCTION_URL}/api/admin/analytics`, {
      method: 'GET',
      headers: {
        'Cookie': cookies
      }
    });

    console.log(`   Status: ${analyticsResponse.status}`);
    if (analyticsResponse.status === 200) {
      testResults.adminAnalytics = true;
      console.log('   ✅ Admin Analytics API working');
      console.log(`   Users: ${analyticsResponse.body.analytics.users.total}`);
      console.log(`   Revenue: ₹${analyticsResponse.body.analytics.revenue.total}`);
    } else {
      console.log('   ❌ Admin Analytics API failed');
      console.log(`   Error: ${JSON.stringify(analyticsResponse.body, null, 2)}`);
    }

    // Step 5: Test Admin Settings API
    console.log('\n5️⃣  Testing Admin Settings API...');
    const settingsResponse = await makeRequest(`${PRODUCTION_URL}/api/admin/settings`, {
      method: 'GET',
      headers: {
        'Cookie': cookies
      }
    });

    console.log(`   Status: ${settingsResponse.status}`);
    if (settingsResponse.status === 200) {
      testResults.adminSettings = true;
      console.log('   ✅ Admin Settings API working');
      console.log(`   Site Name: ${settingsResponse.body.settings.siteName}`);
    } else {
      console.log('   ❌ Admin Settings API failed');
      console.log(`   Error: ${JSON.stringify(settingsResponse.body, null, 2)}`);
    }

    // Test Results Summary
    console.log('\n📊 Admin Fixes Test Results:');
    console.log('=====================================');
    console.log(`Authentication: ${testResults.authentication ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Chat API: ${testResults.chatAPI ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Admin Content Stats: ${testResults.adminContentStats ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Admin Analytics: ${testResults.adminAnalytics ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Admin Settings: ${testResults.adminSettings ? '✅ PASS' : '❌ FAIL'}`);

    const allPassed = Object.values(testResults).every(result => result);
    
    console.log('\n🎯 Overall Status:');
    if (allPassed) {
      console.log('🎉 ALL ADMIN FIXES WORKING CORRECTLY!');
      console.log('\n✅ Fixed Issues:');
      console.log('   • Chat API 500 error - FIXED');
      console.log('   • Admin Content Stats 401 error - FIXED');
      console.log('   • Admin Analytics 401 error - FIXED');
      console.log('   • Missing admin pages - CREATED');
      console.log('   • Admin API authentication - FIXED');
    } else {
      console.log('❌ Some issues still need attention');
      const failedTests = Object.entries(testResults)
        .filter(([_, passed]) => !passed)
        .map(([test, _]) => test);
      console.log(`Failed tests: ${failedTests.join(', ')}`);
    }

    console.log('\n📱 Admin Panel Access:');
    console.log(`🔗 Settings: ${PRODUCTION_URL}/admin/settings`);
    console.log(`🔗 Subscriptions: ${PRODUCTION_URL}/admin/subscriptions`);
    console.log(`🔗 Security: ${PRODUCTION_URL}/admin/security`);

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

testAdminFixes();
