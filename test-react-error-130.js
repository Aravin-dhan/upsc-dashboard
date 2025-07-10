#!/usr/bin/env node

/**
 * Advanced React Error #130 Detection Test
 * Tests for the specific React minified error that was causing dashboard failures
 */

const puppeteer = require('puppeteer');

async function testReactError130() {
  console.log('🔍 Testing React Error #130 Resolution');
  console.log('Target: https://upsc-dashboard-three.vercel.app/dashboard');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');

  let browser;
  try {
    // Launch browser with console logging
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Collect console messages
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push({
        type: msg.type(),
        text: text,
        timestamp: new Date().toISOString()
      });
      
      // Check for React Error #130 specifically
      if (text.includes('Minified React error #130') || 
          text.includes('Element type is invalid') ||
          text.includes('expected a string (for built-in components) or a class/function')) {
        errors.push({
          type: 'REACT_ERROR_130',
          message: text,
          timestamp: new Date().toISOString()
        });
      }
      
      // Check for other React errors
      if (text.includes('React') && (text.includes('error') || text.includes('Error'))) {
        errors.push({
          type: 'REACT_ERROR',
          message: text,
          timestamp: new Date().toISOString()
        });
      }
    });

    page.on('pageerror', error => {
      errors.push({
        type: 'PAGE_ERROR',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Navigate to dashboard
    console.log('🚀 Loading dashboard page...');
    await page.goto('https://upsc-dashboard-three.vercel.app/dashboard', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for React to fully load and render
    console.log('⏳ Waiting for React components to load...');
    await page.waitForTimeout(5000);

    // Check if dashboard content is present
    const dashboardContent = await page.evaluate(() => {
      return {
        hasTitle: document.title.includes('UPSC Dashboard'),
        hasMainContent: document.querySelector('[class*="dashboard"]') !== null,
        hasWidgets: document.querySelectorAll('[class*="widget"], [class*="card"]').length > 0,
        bodyText: document.body.innerText.substring(0, 200)
      };
    });

    // Check for component loading logs
    const componentLogs = consoleMessages.filter(msg => 
      msg.text.includes('Successfully loaded') || 
      msg.text.includes('Failed to load') ||
      msg.text.includes('Creating widget')
    );

    // Generate report
    console.log('📊 TEST RESULTS:');
    console.log('================');
    
    if (errors.length === 0) {
      console.log('✅ NO REACT ERRORS DETECTED');
      console.log('✅ React Error #130 has been successfully resolved!');
    } else {
      console.log('❌ ERRORS DETECTED:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. [${error.type}] ${error.message}`);
      });
    }

    console.log('');
    console.log('📋 Dashboard Content Check:');
    console.log(`   Title: ${dashboardContent.hasTitle ? '✅' : '❌'} ${dashboardContent.hasTitle ? 'Found' : 'Missing'}`);
    console.log(`   Main Content: ${dashboardContent.hasMainContent ? '✅' : '❌'} ${dashboardContent.hasMainContent ? 'Found' : 'Missing'}`);
    console.log(`   Widgets: ${dashboardContent.hasWidgets ? '✅' : '❌'} ${dashboardContent.hasWidgets ? 'Found' : 'Missing'}`);

    console.log('');
    console.log('🔧 Component Loading Status:');
    if (componentLogs.length > 0) {
      componentLogs.forEach(log => {
        const status = log.text.includes('Successfully') ? '✅' : '❌';
        console.log(`   ${status} ${log.text}`);
      });
    } else {
      console.log('   ℹ️  No component loading logs detected (may be in production mode)');
    }

    console.log('');
    console.log('📈 Summary:');
    console.log(`   Total Console Messages: ${consoleMessages.length}`);
    console.log(`   React Errors: ${errors.filter(e => e.type.includes('REACT')).length}`);
    console.log(`   Page Errors: ${errors.filter(e => e.type === 'PAGE_ERROR').length}`);
    console.log(`   Component Logs: ${componentLogs.length}`);

    // Final verdict
    const isSuccess = errors.length === 0 && dashboardContent.hasMainContent;
    console.log('');
    console.log('🎯 FINAL VERDICT:');
    if (isSuccess) {
      console.log('🎉 SUCCESS: React Error #130 has been resolved!');
      console.log('   ✅ Dashboard loads without React errors');
      console.log('   ✅ Components render successfully');
      console.log('   ✅ No undefined component issues detected');
    } else {
      console.log('❌ ISSUES DETECTED: Further investigation needed');
      if (!dashboardContent.hasMainContent) {
        console.log('   ❌ Dashboard content not loading properly');
      }
      if (errors.length > 0) {
        console.log(`   ❌ ${errors.length} error(s) detected`);
      }
    }

    return isSuccess;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testReactError130()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
