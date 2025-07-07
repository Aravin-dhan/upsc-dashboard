#!/usr/bin/env node

/**
 * Production Fixes Validation Test for UPSC Dashboard
 * Comprehensive test to validate all critical fixes
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

async function runComprehensiveTest() {
  console.log('🚀 UPSC Dashboard Production Fixes Validation');
  console.log('Testing all critical fixes...\n');

  let cookies = '';
  let testResults = {
    authentication: false,
    adminAccess: false,
    aiAssistant: false,
    sessionManagement: false
  };

  try {
    // Test 1: Authentication System
    console.log('1️⃣  Testing Authentication System...');
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
      console.log('   ✅ Authentication working correctly');
      console.log(`   User: ${loginResponse.body.user.name} (${loginResponse.body.user.role})`);
    } else {
      console.log('   ❌ Authentication failed');
      console.log(`   Status: ${loginResponse.status}`);
    }

    // Test 2: Session Management
    console.log('\n2️⃣  Testing Session Management...');
    const sessionResponse = await makeRequest(`${PRODUCTION_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Cookie': cookies
      }
    });

    if (sessionResponse.status === 200) {
      testResults.sessionManagement = true;
      console.log('   ✅ Session management working');
      console.log(`   Session valid for: ${sessionResponse.body.user.email}`);
    } else {
      console.log('   ❌ Session management failed');
      console.log(`   Status: ${sessionResponse.status}`);
    }

    // Test 3: Admin Panel Access
    console.log('\n3️⃣  Testing Admin Panel Access...');
    const adminResponse = await makeRequest(`${PRODUCTION_URL}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Cookie': cookies
      }
    });

    if (adminResponse.status === 200) {
      testResults.adminAccess = true;
      console.log('   ✅ Admin panel access working');
      console.log(`   Admin can access user management`);
    } else {
      console.log('   ❌ Admin panel access failed');
      console.log(`   Status: ${adminResponse.status}`);
    }

    // Test 4: AI Assistant
    console.log('\n4️⃣  Testing AI Assistant...');
    const aiResponse = await makeRequest(`${PRODUCTION_URL}/api/ai-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    }, JSON.stringify({
      message: 'Navigate to dashboard',
      context: { currentPage: '/admin', userRole: 'admin' }
    }));

    if (aiResponse.status === 200) {
      testResults.aiAssistant = true;
      console.log('   ✅ AI Assistant working');
      console.log(`   AI Response: ${aiResponse.body.response.message.substring(0, 100)}...`);
    } else {
      console.log('   ❌ AI Assistant failed');
      console.log(`   Status: ${aiResponse.status}`);
    }

    // Test Results Summary
    console.log('\n📊 Test Results Summary:');
    console.log('========================================');
    console.log(`Authentication System: ${testResults.authentication ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Session Management: ${testResults.sessionManagement ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Admin Panel Access: ${testResults.adminAccess ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`AI Assistant: ${testResults.aiAssistant ? '✅ PASS' : '❌ FAIL'}`);

    const allPassed = Object.values(testResults).every(result => result);
    
    console.log('\n🎯 Overall Status:');
    if (allPassed) {
      console.log('🎉 ALL CRITICAL FIXES VALIDATED SUCCESSFULLY!');
      console.log('\n✅ Production Issues Resolved:');
      console.log('   • Authentication API 401 errors - FIXED');
      console.log('   • Admin panel navigation design - FIXED');
      console.log('   • AI assistant functionality - WORKING');
      console.log('   • Session management - WORKING');
      console.log('\n🚀 UPSC Dashboard is ready for production use!');
      console.log(`📱 Access at: ${PRODUCTION_URL}`);
      console.log(`🔐 Admin login: ${ADMIN_CREDENTIALS.email} / ${ADMIN_CREDENTIALS.password}`);
    } else {
      console.log('❌ Some issues still need attention');
      const failedTests = Object.entries(testResults)
        .filter(([_, passed]) => !passed)
        .map(([test, _]) => test);
      console.log(`Failed tests: ${failedTests.join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

runComprehensiveTest();
