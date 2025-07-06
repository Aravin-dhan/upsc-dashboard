// Production readiness testing utilities

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
  timestamp: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  warnings: number;
  duration: number;
}

class ProductionTester {
  private results: TestSuite[] = [];

  async runAllTests(): Promise<TestSuite[]> {
    console.log('🧪 Starting Production Readiness Tests...');
    
    const suites = [
      { name: 'Authentication System', testFn: this.testAuthentication },
      { name: 'API Endpoints', testFn: this.testAPIEndpoints },
      { name: 'Question Parsing System', testFn: this.testQuestionParsing },
      { name: 'Multi-Tenant System', testFn: this.testMultiTenant },
      { name: 'Error Handling', testFn: this.testErrorHandling },
      { name: 'Performance', testFn: this.testPerformance },
      { name: 'Security', testFn: this.testSecurity }
    ];

    for (const suite of suites) {
      const startTime = Date.now();
      const tests = await suite.testFn.call(this);
      const duration = Date.now() - startTime;
      
      const testSuite: TestSuite = {
        name: suite.name,
        tests,
        passed: tests.filter(t => t.status === 'pass').length,
        failed: tests.filter(t => t.status === 'fail').length,
        warnings: tests.filter(t => t.status === 'warning').length,
        duration
      };
      
      this.results.push(testSuite);
      console.log(`✅ ${suite.name}: ${testSuite.passed} passed, ${testSuite.failed} failed, ${testSuite.warnings} warnings`);
    }

    return this.results;
  }

  private async testAuthentication(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test login endpoint
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@upsc.local',
          password: 'admin123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        tests.push({
          name: 'Admin Login',
          status: data.success ? 'pass' : 'fail',
          message: data.success ? 'Admin login successful' : 'Admin login failed',
          details: data,
          timestamp: new Date().toISOString()
        });
      } else {
        tests.push({
          name: 'Admin Login',
          status: 'fail',
          message: `Login endpoint returned ${response.status}`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      tests.push({
        name: 'Admin Login',
        status: 'fail',
        message: `Login test failed: ${error}`,
        timestamp: new Date().toISOString()
      });
    }

    // Test auth middleware
    try {
      const response = await fetch('/api/auth/me');
      tests.push({
        name: 'Auth Middleware',
        status: response.status === 401 ? 'pass' : 'warning',
        message: response.status === 401 ? 'Properly rejects unauthenticated requests' : 'Auth middleware may not be working correctly',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      tests.push({
        name: 'Auth Middleware',
        status: 'fail',
        message: `Auth middleware test failed: ${error}`,
        timestamp: new Date().toISOString()
      });
    }

    return tests;
  }

  private async testAPIEndpoints(): Promise<TestResult[]> {
    const tests: TestResult[] = [];
    
    const endpoints = [
      { path: '/api/questions/search', method: 'GET' },
      { path: '/api/tenants', method: 'GET' },
      { path: '/api/admin/stats', method: 'GET' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.path, { method: endpoint.method });
        tests.push({
          name: `${endpoint.method} ${endpoint.path}`,
          status: response.status < 500 ? 'pass' : 'fail',
          message: `Returned ${response.status}`,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          name: `${endpoint.method} ${endpoint.path}`,
          status: 'fail',
          message: `Request failed: ${error}`,
          timestamp: new Date().toISOString()
        });
      }
    }

    return tests;
  }

  private async testQuestionParsing(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    try {
      const response = await fetch('/api/questions/search?query=test&limit=5');
      if (response.ok) {
        const data = await response.json();
        tests.push({
          name: 'Question Search',
          status: Array.isArray(data.questions) ? 'pass' : 'fail',
          message: `Found ${data.questions?.length || 0} questions`,
          details: data,
          timestamp: new Date().toISOString()
        });
      } else {
        tests.push({
          name: 'Question Search',
          status: 'fail',
          message: `Search endpoint returned ${response.status}`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      tests.push({
        name: 'Question Search',
        status: 'fail',
        message: `Question search failed: ${error}`,
        timestamp: new Date().toISOString()
      });
    }

    return tests;
  }

  private async testMultiTenant(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test tenant isolation
    try {
      const response = await fetch('/api/tenants');
      tests.push({
        name: 'Tenant API',
        status: response.status < 500 ? 'pass' : 'fail',
        message: `Tenant endpoint returned ${response.status}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      tests.push({
        name: 'Tenant API',
        status: 'fail',
        message: `Tenant test failed: ${error}`,
        timestamp: new Date().toISOString()
      });
    }

    return tests;
  }

  private async testErrorHandling(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 404 handling
    try {
      const response = await fetch('/api/nonexistent-endpoint');
      tests.push({
        name: '404 Handling',
        status: response.status === 404 ? 'pass' : 'warning',
        message: `Non-existent endpoint returned ${response.status}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      tests.push({
        name: '404 Handling',
        status: 'fail',
        message: `404 test failed: ${error}`,
        timestamp: new Date().toISOString()
      });
    }

    // Check for error boundaries
    const hasErrorBoundary = document.querySelector('[data-error-boundary]') !== null;
    tests.push({
      name: 'Error Boundaries',
      status: hasErrorBoundary ? 'pass' : 'warning',
      message: hasErrorBoundary ? 'Error boundaries detected' : 'No error boundaries found in DOM',
      timestamp: new Date().toISOString()
    });

    return tests;
  }

  private async testPerformance(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test page load performance
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      tests.push({
        name: 'Page Load Time',
        status: loadTime < 3000 ? 'pass' : loadTime < 5000 ? 'warning' : 'fail',
        message: `Page loaded in ${loadTime}ms`,
        details: { loadTime, target: '< 3000ms' },
        timestamp: new Date().toISOString()
      });

      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      tests.push({
        name: 'DOM Content Loaded',
        status: domContentLoaded < 2000 ? 'pass' : domContentLoaded < 3000 ? 'warning' : 'fail',
        message: `DOM ready in ${domContentLoaded}ms`,
        details: { domContentLoaded, target: '< 2000ms' },
        timestamp: new Date().toISOString()
      });
    }

    return tests;
  }

  private async testSecurity(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Check for HTTPS in production
    const isHTTPS = window.location.protocol === 'https:';
    const isLocalhost = window.location.hostname === 'localhost';
    
    tests.push({
      name: 'HTTPS Protocol',
      status: isHTTPS || isLocalhost ? 'pass' : 'fail',
      message: isHTTPS ? 'Using HTTPS' : isLocalhost ? 'Localhost (HTTPS not required)' : 'Not using HTTPS',
      timestamp: new Date().toISOString()
    });

    // Check for secure headers (would need to be tested server-side)
    tests.push({
      name: 'Security Headers',
      status: 'warning',
      message: 'Security headers should be verified server-side',
      timestamp: new Date().toISOString()
    });

    return tests;
  }

  getResults(): TestSuite[] {
    return this.results;
  }

  generateReport(): string {
    let report = '# Production Readiness Test Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;

    let totalPassed = 0;
    let totalFailed = 0;
    let totalWarnings = 0;

    for (const suite of this.results) {
      totalPassed += suite.passed;
      totalFailed += suite.failed;
      totalWarnings += suite.warnings;

      report += `## ${suite.name}\n`;
      report += `- ✅ Passed: ${suite.passed}\n`;
      report += `- ❌ Failed: ${suite.failed}\n`;
      report += `- ⚠️ Warnings: ${suite.warnings}\n`;
      report += `- ⏱️ Duration: ${suite.duration}ms\n\n`;

      for (const test of suite.tests) {
        const icon = test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : '⚠️';
        report += `${icon} **${test.name}**: ${test.message}\n`;
      }
      report += '\n';
    }

    report += `## Summary\n`;
    report += `- Total Tests: ${totalPassed + totalFailed + totalWarnings}\n`;
    report += `- ✅ Passed: ${totalPassed}\n`;
    report += `- ❌ Failed: ${totalFailed}\n`;
    report += `- ⚠️ Warnings: ${totalWarnings}\n`;
    report += `- Success Rate: ${((totalPassed / (totalPassed + totalFailed + totalWarnings)) * 100).toFixed(1)}%\n`;

    return report;
  }
}

export const productionTester = new ProductionTester();
export default ProductionTester;
