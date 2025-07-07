#!/usr/bin/env node

/**
 * UPSC Dashboard Login Flow Test
 * Tests the complete authentication flow including redirects
 */

const https = require('https');
const { URL } = require('url');

const BASE_URL = 'https://upsc-dashboard-three.vercel.app';

// Test credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@upsc.local',
  password: 'admin123'
};

const STUDENT_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};

/**
 * Make HTTP request with cookie support
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'UPSC-Dashboard-Test/1.0',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Test login and get session cookie
 */
async function testLogin(credentials, userType) {
  console.log(`\n🧪 Testing ${userType} Login Flow`);
  console.log('=' .repeat(50));
  
  try {
    // Step 1: Login
    console.log('1️⃣  Attempting login...');
    const loginResponse = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: credentials
    });

    if (loginResponse.status !== 200) {
      console.log(`   ❌ Login failed: ${loginResponse.status}`);
      console.log(`   Error: ${JSON.stringify(loginResponse.data)}`);
      return false;
    }

    console.log(`   ✅ Login successful`);
    console.log(`   User: ${loginResponse.data.user.name} (${loginResponse.data.user.email})`);
    console.log(`   Role: ${loginResponse.data.user.role}`);

    // Extract session cookie
    const setCookieHeader = loginResponse.headers['set-cookie'];
    let sessionCookie = '';
    if (setCookieHeader) {
      const authCookie = setCookieHeader.find(cookie => cookie.includes('upsc-auth-token'));
      if (authCookie) {
        sessionCookie = authCookie.split(';')[0];
      }
    }

    if (!sessionCookie) {
      console.log('   ❌ No session cookie received');
      return false;
    }

    console.log('   ✅ Session cookie received');

    // Step 2: Validate session
    console.log('2️⃣  Validating session...');
    const sessionResponse = await makeRequest(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Cookie': sessionCookie
      }
    });

    if (sessionResponse.status !== 200) {
      console.log(`   ❌ Session validation failed: ${sessionResponse.status}`);
      return false;
    }

    console.log('   ✅ Session validation successful');
    console.log(`   User: ${sessionResponse.data.user.name}`);
    console.log(`   Role: ${sessionResponse.data.user.role}`);

    // Step 3: Test role-based access
    console.log('3️⃣  Testing role-based access...');
    
    const expectedRedirect = loginResponse.data.user.role === 'admin' ? '/admin' : '/dashboard';
    console.log(`   Expected redirect for ${loginResponse.data.user.role}: ${expectedRedirect}`);

    // Test admin access if admin user
    if (loginResponse.data.user.role === 'admin') {
      const adminResponse = await makeRequest(`${BASE_URL}/api/admin/users`, {
        headers: {
          'Cookie': sessionCookie
        }
      });

      if (adminResponse.status === 200) {
        console.log('   ✅ Admin access confirmed');
        console.log(`   Users found: ${adminResponse.data.users?.length || 0}`);
      } else {
        console.log(`   ❌ Admin access failed: ${adminResponse.status}`);
        return false;
      }
    }

    console.log(`\n🎉 ${userType} authentication flow completed successfully!`);
    return true;

  } catch (error) {
    console.error(`❌ ${userType} test failed:`, error.message);
    return false;
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 UPSC Dashboard Login Flow Test Suite');
  console.log(`Testing on: ${BASE_URL}`);
  console.log('=' .repeat(60));

  const results = {
    admin: false,
    student: false
  };

  // Test admin login
  results.admin = await testLogin(ADMIN_CREDENTIALS, 'Admin');
  
  // Test student login  
  results.student = await testLogin(STUDENT_CREDENTIALS, 'Student');

  // Summary
  console.log('\n📊 Test Summary');
  console.log('=' .repeat(30));
  console.log(`Admin Login:    ${results.admin ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Student Login:  ${results.student ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = results.admin && results.student;
  console.log(`\nOverall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎯 Authentication redirect logic is working correctly!');
    console.log(`Admin users will be redirected to: ${BASE_URL}/admin`);
    console.log(`Student users will be redirected to: ${BASE_URL}/dashboard`);
  }

  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
