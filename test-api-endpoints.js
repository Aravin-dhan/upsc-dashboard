#!/usr/bin/env node

/**
 * API ENDPOINTS VERIFICATION TEST
 * Tests all new synchronization API endpoints
 */

const https = require('https');

async function testAPIEndpoints() {
  console.log('🔌 API Endpoints Verification Test');
  console.log('Target: https://upsc-dashboard-three.vercel.app');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');

  const endpoints = [
    '/api/health',
    '/api/calendar/today',
    '/api/performance/overview',
    '/api/syllabus/progress',
    '/api/revision/engine',
    '/api/current-affairs',
    '/api/knowledge-base',
    '/api/wellness',
    '/api/ai-insights'
  ];

  let workingEndpoints = 0;
  let totalEndpoints = endpoints.length;

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await fetch(`https://upsc-dashboard-three.vercel.app${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        const hasData = data && (data.success || data.status === 'healthy');
        
        if (hasData) {
          console.log(`   ✅ ${endpoint}: Working (${response.status})`);
          workingEndpoints++;
        } else {
          console.log(`   ⚠️  ${endpoint}: Response OK but no data (${response.status})`);
        }
      } else {
        console.log(`   ❌ ${endpoint}: Failed (${response.status})`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint}: Error - ${error.message}`);
    }
  }

  console.log('');
  console.log('📊 RESULTS:');
  console.log(`Working endpoints: ${workingEndpoints}/${totalEndpoints}`);
  console.log(`Success rate: ${Math.round((workingEndpoints / totalEndpoints) * 100)}%`);
  
  if (workingEndpoints === totalEndpoints) {
    console.log('🎉 All API endpoints are working perfectly!');
  } else if (workingEndpoints >= totalEndpoints * 0.8) {
    console.log('✅ Most API endpoints are working');
  } else {
    console.log('❌ Many API endpoints need attention');
  }

  return workingEndpoints >= totalEndpoints * 0.8;
}

// Helper function for fetch (Node.js compatibility)
async function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const response = {
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          text: () => Promise.resolve(data),
          json: () => Promise.resolve(JSON.parse(data))
        };
        resolve(response);
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Run the test
testAPIEndpoints()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
