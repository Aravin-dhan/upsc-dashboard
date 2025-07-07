#!/usr/bin/env node

/**
 * Authentication Test Script for UPSC Dashboard
 * Tests the authentication flow on both local and production environments
 */

const https = require('https');
const http = require('http');

// Configuration
const PRODUCTION_URL = 'https://upsc-dashboard-three.vercel.app';
const LOCAL_URL = 'http://localhost:3000';
const ADMIN_CREDENTIALS = {
  email: 'admin@upsc.local',
  password: 'admin123'
};

// Helper function to make HTTP requests
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test authentication flow
async function testAuth(baseUrl, environment) {
  console.log(`\n🧪 Testing Authentication on ${environment} (${baseUrl})`);
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Login
    console.log('1️⃣  Testing Login...');
    const loginResponse = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, ADMIN_CREDENTIALS);
    
    console.log(`   Status: ${loginResponse.status}`);
    if (loginResponse.status === 200) {
      console.log('   ✅ Login successful');
      console.log(`   User: ${loginResponse.body.user?.name} (${loginResponse.body.user?.email})`);
      console.log(`   Role: ${loginResponse.body.user?.role}`);
    } else {
      console.log('   ❌ Login failed');
      console.log(`   Error: ${loginResponse.body.error || 'Unknown error'}`);
      return false;
    }
    
    // Extract session token from Set-Cookie header
    const setCookieHeader = loginResponse.headers['set-cookie'];
    let sessionToken = null;
    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.find(cookie => cookie.includes('upsc-auth-token'));
      if (tokenMatch) {
        sessionToken = tokenMatch.split(';')[0];
      }
    }
    
    if (!sessionToken) {
      console.log('   ❌ No session token received');
      return false;
    }
    
    // Test 2: Session validation
    console.log('\n2️⃣  Testing Session Validation...');
    const sessionResponse = await makeRequest(`${baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Cookie': sessionToken
      }
    });
    
    console.log(`   Status: ${sessionResponse.status}`);
    if (sessionResponse.status === 200) {
      console.log('   ✅ Session validation successful');
      console.log(`   User: ${sessionResponse.body.user?.name}`);
    } else {
      console.log('   ❌ Session validation failed');
      console.log(`   Error: ${sessionResponse.body.error || 'Unknown error'}`);
      return false;
    }
    
    // Test 3: Admin endpoint access
    console.log('\n3️⃣  Testing Admin Access...');
    const adminResponse = await makeRequest(`${baseUrl}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Cookie': sessionToken
      }
    });
    
    console.log(`   Status: ${adminResponse.status}`);
    if (adminResponse.status === 200) {
      console.log('   ✅ Admin access successful');
      console.log(`   Users found: ${adminResponse.body.total || 0}`);
      console.log(`   Stats: ${JSON.stringify(adminResponse.body.stats || {})}`);
    } else {
      console.log('   ❌ Admin access failed');
      console.log(`   Error: ${adminResponse.body.error || 'Unknown error'}`);
      return false;
    }
    
    console.log(`\n🎉 All tests passed for ${environment}!`);
    return true;
    
  } catch (error) {
    console.log(`\n💥 Test failed for ${environment}:`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 UPSC Dashboard Authentication Test Suite');
  console.log('Testing admin login with credentials: admin@upsc.local / admin123');
  
  // Test production environment
  const productionSuccess = await testAuth(PRODUCTION_URL, 'Production');
  
  // Test local environment (if available)
  // const localSuccess = await testAuth(LOCAL_URL, 'Local');
  
  console.log('\n📊 Test Summary:');
  console.log('=' .repeat(40));
  console.log(`Production: ${productionSuccess ? '✅ PASS' : '❌ FAIL'}`);
  // console.log(`Local: ${localSuccess ? '✅ PASS' : '❌ FAIL'}`);
  
  if (productionSuccess) {
    console.log('\n🎯 Authentication is working correctly!');
    console.log('Admin can now login at: https://upsc-dashboard-three.vercel.app/login');
  } else {
    console.log('\n⚠️  Authentication issues detected. Check environment variables and deployment.');
  }
}

// Run the tests
main().catch(console.error);
