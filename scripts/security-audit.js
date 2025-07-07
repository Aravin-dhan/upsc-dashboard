#!/usr/bin/env node

/**
 * Security Audit Script for UPSC Dashboard
 * Checks API endpoints for proper authentication, authorization, and security measures
 */

const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '../src/app/api');
const SECURITY_PATTERNS = {
  authentication: [
    'getSession',
    'requireAuth',
    'verifyToken',
    'checkAuth'
  ],
  authorization: [
    'hasPermission',
    'checkRole',
    'canAccess',
    'isAdmin'
  ],
  validation: [
    'validateInput',
    'sanitize',
    'validate',
    'schema'
  ],
  rateLimit: [
    'rateLimit',
    'checkRateLimit',
    'throttle'
  ],
  errorHandling: [
    'try',
    'catch',
    'handleError',
    'NextResponse.json'
  ]
};

const PUBLIC_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/news/',
  '/api/debug/auth' // Debug endpoint - should be removed in production
];

function findFiles(dir, extension = '.ts') {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extension));
    } else if (file.endsWith(extension)) {
      results.push(filePath);
    }
  }
  
  return results;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(path.join(__dirname, '../src'), filePath);
  const apiPath = '/' + relativePath.replace(/\\/g, '/').replace('/app/', '').replace('/route.ts', '');
  
  const analysis = {
    path: apiPath,
    file: relativePath,
    hasAuthentication: false,
    hasAuthorization: false,
    hasValidation: false,
    hasRateLimit: false,
    hasErrorHandling: false,
    httpMethods: [],
    securityIssues: [],
    recommendations: []
  };

  // Check for HTTP methods
  const methodMatches = content.match(/export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)/g);
  if (methodMatches) {
    analysis.httpMethods = methodMatches.map(match => match.match(/(GET|POST|PUT|DELETE|PATCH)/)[1]);
  }

  // Check security patterns
  for (const [category, patterns] of Object.entries(SECURITY_PATTERNS)) {
    for (const pattern of patterns) {
      if (content.includes(pattern)) {
        analysis[`has${category.charAt(0).toUpperCase() + category.slice(1)}`] = true;
        break;
      }
    }
  }

  // Check if endpoint should be public
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(publicPath => 
    apiPath.startsWith(publicPath) || apiPath.includes('/news/')
  );

  // Security issue detection
  if (!isPublicEndpoint && !analysis.hasAuthentication) {
    analysis.securityIssues.push('Missing authentication');
    analysis.recommendations.push('Add getSession() or requireAuth() check');
  }

  if (analysis.httpMethods.includes('POST') && !analysis.hasValidation) {
    analysis.securityIssues.push('Missing input validation');
    analysis.recommendations.push('Add input validation and sanitization');
  }

  if (!analysis.hasErrorHandling) {
    analysis.securityIssues.push('Missing error handling');
    analysis.recommendations.push('Add try-catch blocks and proper error responses');
  }

  if (apiPath.includes('/admin/') && !analysis.hasAuthorization) {
    analysis.securityIssues.push('Admin endpoint missing authorization');
    analysis.recommendations.push('Add role-based permission checks');
  }

  if (content.includes('console.log') && !content.includes('process.env.NODE_ENV')) {
    analysis.securityIssues.push('Potential information disclosure in logs');
    analysis.recommendations.push('Remove console.log or wrap in development check');
  }

  // Check for hardcoded secrets
  const secretPatterns = [
    /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
    /secret\s*[:=]\s*['"][^'"]+['"]/i,
    /password\s*[:=]\s*['"][^'"]+['"]/i,
    /token\s*[:=]\s*['"][^'"]+['"]/i
  ];

  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      analysis.securityIssues.push('Potential hardcoded secret');
      analysis.recommendations.push('Move secrets to environment variables');
      break;
    }
  }

  return analysis;
}

function generateReport(analyses) {
  const report = {
    timestamp: new Date().toISOString(),
    totalEndpoints: analyses.length,
    secureEndpoints: analyses.filter(a => a.securityIssues.length === 0).length,
    vulnerableEndpoints: analyses.filter(a => a.securityIssues.length > 0).length,
    summary: {
      withAuthentication: analyses.filter(a => a.hasAuthentication).length,
      withAuthorization: analyses.filter(a => a.hasAuthorization).length,
      withValidation: analyses.filter(a => a.hasValidation).length,
      withRateLimit: analyses.filter(a => a.hasRateLimit).length,
      withErrorHandling: analyses.filter(a => a.hasErrorHandling).length
    },
    vulnerabilities: analyses.filter(a => a.securityIssues.length > 0),
    recommendations: []
  };

  // Generate overall recommendations
  if (report.summary.withAuthentication < report.totalEndpoints * 0.8) {
    report.recommendations.push('Implement authentication on more endpoints');
  }
  
  if (report.summary.withRateLimit < report.totalEndpoints * 0.3) {
    report.recommendations.push('Add rate limiting to prevent abuse');
  }
  
  if (report.summary.withValidation < report.totalEndpoints * 0.7) {
    report.recommendations.push('Improve input validation across endpoints');
  }

  return report;
}

function main() {
  console.log('🔒 Starting Security Audit for UPSC Dashboard API...\n');

  const apiFiles = findFiles(API_DIR);
  const analyses = apiFiles.map(analyzeFile);
  const report = generateReport(analyses);

  console.log(`📊 Security Audit Report - ${report.timestamp}`);
  console.log('='.repeat(60));
  console.log(`Total Endpoints: ${report.totalEndpoints}`);
  console.log(`Secure Endpoints: ${report.secureEndpoints} (${Math.round(report.secureEndpoints/report.totalEndpoints*100)}%)`);
  console.log(`Vulnerable Endpoints: ${report.vulnerableEndpoints} (${Math.round(report.vulnerableEndpoints/report.totalEndpoints*100)}%)`);
  console.log('');

  console.log('📈 Security Feature Coverage:');
  console.log(`Authentication: ${report.summary.withAuthentication}/${report.totalEndpoints} (${Math.round(report.summary.withAuthentication/report.totalEndpoints*100)}%)`);
  console.log(`Authorization: ${report.summary.withAuthorization}/${report.totalEndpoints} (${Math.round(report.summary.withAuthorization/report.totalEndpoints*100)}%)`);
  console.log(`Input Validation: ${report.summary.withValidation}/${report.totalEndpoints} (${Math.round(report.summary.withValidation/report.totalEndpoints*100)}%)`);
  console.log(`Rate Limiting: ${report.summary.withRateLimit}/${report.totalEndpoints} (${Math.round(report.summary.withRateLimit/report.totalEndpoints*100)}%)`);
  console.log(`Error Handling: ${report.summary.withErrorHandling}/${report.totalEndpoints} (${Math.round(report.summary.withErrorHandling/report.totalEndpoints*100)}%)`);
  console.log('');

  if (report.vulnerabilities.length > 0) {
    console.log('🚨 Security Issues Found:');
    console.log('-'.repeat(40));
    
    report.vulnerabilities.forEach(vuln => {
      console.log(`\n📍 ${vuln.path}`);
      console.log(`   File: ${vuln.file}`);
      console.log(`   Methods: ${vuln.httpMethods.join(', ')}`);
      console.log(`   Issues: ${vuln.securityIssues.join(', ')}`);
      if (vuln.recommendations.length > 0) {
        console.log(`   Recommendations:`);
        vuln.recommendations.forEach(rec => console.log(`     • ${rec}`));
      }
    });
  }

  if (report.recommendations.length > 0) {
    console.log('\n💡 Overall Recommendations:');
    report.recommendations.forEach(rec => console.log(`• ${rec}`));
  }

  console.log('\n✅ Security audit completed!');
  
  // Save detailed report
  const reportPath = path.join(__dirname, '../security-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Detailed report saved to: ${reportPath}`);

  // Exit with error code if vulnerabilities found
  process.exit(report.vulnerableEndpoints > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { analyzeFile, generateReport };
