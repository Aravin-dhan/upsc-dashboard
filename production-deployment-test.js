#!/usr/bin/env node

/**
 * Production Deployment Test Script
 * Tests critical functionality of the UPSC Dashboard in production
 */

const https = require('https');
const url = require('url');

const BASE_URL = 'https://upsc-dashboard-three.vercel.app';

// Test configuration
const tests = [
  {
    name: 'Homepage Load',
    path: '/',
    expectedStatus: 200,
    checkContent: true,
    contentChecks: ['UPSC Dashboard', 'DOCTYPE html']
  },
  {
    name: 'Dashboard Page',
    path: '/dashboard',
    expectedStatus: 200,
    checkContent: true,
    contentChecks: ['dashboard', 'html']
  },
  {
    name: 'Login Page',
    path: '/login',
    expectedStatus: 200,
    checkContent: true,
    contentChecks: ['login', 'html']
  },
  {
    name: 'AI Conversations API',
    path: '/api/ai/conversations',
    expectedStatus: 401, // Should require auth
    checkContent: false
  },
  {
    name: 'Health Check API',
    path: '/api/health',
    expectedStatus: 200,
    checkContent: true,
    contentChecks: ['status']
  },
  {
    name: 'Static CSS Assets',
    path: '/_next/static/css',
    expectedStatus: [200, 404], // May not exist or may be redirected
    checkContent: false
  }
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(testPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${BASE_URL}${testPath}`;
    const parsedUrl = url.parse(fullUrl);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'User-Agent': 'UPSC-Dashboard-Test/1.0',
        'Accept': 'text/html,application/json,*/*'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          url: fullUrl
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTest(test) {
  try {
    log(`\n🧪 Testing: ${test.name}`, 'blue');
    log(`   URL: ${BASE_URL}${test.path}`, 'yellow');
    
    const response = await makeRequest(test.path);
    
    // Check status code
    const expectedStatuses = Array.isArray(test.expectedStatus) 
      ? test.expectedStatus 
      : [test.expectedStatus];
    
    const statusMatch = expectedStatuses.includes(response.statusCode);
    
    if (statusMatch) {
      log(`   ✅ Status: ${response.statusCode} (Expected)`, 'green');
    } else {
      log(`   ❌ Status: ${response.statusCode} (Expected: ${test.expectedStatus})`, 'red');
      return false;
    }
    
    // Check content if required
    if (test.checkContent && test.contentChecks) {
      let contentPassed = true;
      
      for (const check of test.contentChecks) {
        if (response.body.toLowerCase().includes(check.toLowerCase())) {
          log(`   ✅ Content: Found "${check}"`, 'green');
        } else {
          log(`   ❌ Content: Missing "${check}"`, 'red');
          contentPassed = false;
        }
      }
      
      if (!contentPassed) {
        return false;
      }
    }
    
    // Check for specific headers
    if (test.path.includes('css') && response.headers['content-type']) {
      if (response.headers['content-type'].includes('text/css')) {
        log(`   ✅ MIME Type: ${response.headers['content-type']}`, 'green');
      } else {
        log(`   ⚠️  MIME Type: ${response.headers['content-type']} (Expected: text/css)`, 'yellow');
      }
    }
    
    log(`   ✅ Test Passed`, 'green');
    return true;
    
  } catch (error) {
    log(`   ❌ Test Failed: ${error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log(`${colors.bold}🚀 UPSC Dashboard Production Deployment Test${colors.reset}`, 'blue');
  log(`${colors.bold}Testing deployment at: ${BASE_URL}${colors.reset}`, 'blue');
  log(`${colors.bold}Timestamp: ${new Date().toISOString()}${colors.reset}`, 'blue');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await runTest(test);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  log(`\n${colors.bold}📊 Test Results Summary:${colors.reset}`, 'blue');
  log(`   ✅ Passed: ${passed}`, passed > 0 ? 'green' : 'yellow');
  log(`   ❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`, 
      failed === 0 ? 'green' : failed < passed ? 'yellow' : 'red');
  
  if (failed === 0) {
    log(`\n🎉 All tests passed! Deployment is working correctly.`, 'green');
    process.exit(0);
  } else {
    log(`\n⚠️  Some tests failed. Please check the deployment.`, 'red');
    process.exit(1);
  }
}

// Additional deployment checks
async function checkDeploymentHealth() {
  log(`\n🔍 Additional Deployment Health Checks:`, 'blue');
  
  try {
    // Check if the site loads quickly
    const startTime = Date.now();
    await makeRequest('/');
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 3000) {
      log(`   ✅ Load Time: ${loadTime}ms (Good)`, 'green');
    } else if (loadTime < 5000) {
      log(`   ⚠️  Load Time: ${loadTime}ms (Acceptable)`, 'yellow');
    } else {
      log(`   ❌ Load Time: ${loadTime}ms (Slow)`, 'red');
    }
    
    // Check for common production issues
    const response = await makeRequest('/');
    
    if (!response.body.includes('localhost')) {
      log(`   ✅ No localhost references found`, 'green');
    } else {
      log(`   ⚠️  Found localhost references in production`, 'yellow');
    }
    
    if (response.body.includes('DOCTYPE html')) {
      log(`   ✅ Valid HTML document`, 'green');
    } else {
      log(`   ❌ Invalid HTML document`, 'red');
    }
    
  } catch (error) {
    log(`   ❌ Health check failed: ${error.message}`, 'red');
  }
}

// Run the tests
async function main() {
  await runAllTests();
  await checkDeploymentHealth();
}

main().catch(console.error);
