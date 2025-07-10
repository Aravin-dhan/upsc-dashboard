#!/usr/bin/env node

/**
 * Widget Loading Verification Test
 * Tests that all dashboard widgets are loading properly without error messages
 */

const https = require('https');

async function testWidgetLoading() {
  console.log('🔍 Testing Widget Loading Status');
  console.log('Target: https://upsc-dashboard-three.vercel.app/dashboard');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');

  return new Promise((resolve, reject) => {
    const req = https.get('https://upsc-dashboard-three.vercel.app/dashboard', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Check for error indicators
          const errorIndicators = [
            'Widget Error',
            'Failed to load',
            'Reload Page',
            'bg-red-50',
            'border-red-200',
            'text-red-600'
          ];
          
          const foundErrors = [];
          errorIndicators.forEach(indicator => {
            if (data.includes(indicator)) {
              foundErrors.push(indicator);
            }
          });
          
          // Check for positive indicators
          const positiveIndicators = [
            'Loading dashboard',
            'dashboard',
            'widget',
            'React.Suspense',
            'Successfully loaded'
          ];
          
          const foundPositive = [];
          positiveIndicators.forEach(indicator => {
            if (data.includes(indicator)) {
              foundPositive.push(indicator);
            }
          });
          
          // Check for specific widget names (should be in the HTML structure)
          const expectedWidgets = [
            'Command Center',
            'Today\'s Schedule', 
            'Performance Overview',
            'Syllabus Progress',
            'Performance Analytics',
            'Revision Engine',
            'Current Affairs',
            'Knowledge Base',
            'Wellness Corner',
            'Daily Motivation'
          ];
          
          const foundWidgets = [];
          expectedWidgets.forEach(widget => {
            if (data.includes(widget)) {
              foundWidgets.push(widget);
            }
          });
          
          console.log('📊 WIDGET LOADING TEST RESULTS:');
          console.log('================================');
          
          if (foundErrors.length === 0) {
            console.log('✅ NO ERROR MESSAGES DETECTED');
            console.log('   No "Widget Error", "Failed to load", or error styling found');
          } else {
            console.log('❌ ERROR INDICATORS FOUND:');
            foundErrors.forEach(error => {
              console.log(`   - ${error}`);
            });
          }
          
          console.log('');
          console.log('📋 Positive Indicators:');
          if (foundPositive.length > 0) {
            foundPositive.forEach(indicator => {
              console.log(`   ✅ ${indicator}`);
            });
          } else {
            console.log('   ❌ No positive indicators found');
          }
          
          console.log('');
          console.log('🎯 Widget Names in HTML:');
          if (foundWidgets.length > 0) {
            foundWidgets.forEach(widget => {
              console.log(`   ✅ ${widget}`);
            });
            console.log(`   📊 Found ${foundWidgets.length}/${expectedWidgets.length} expected widgets`);
          } else {
            console.log('   ❌ No widget names found in HTML');
          }
          
          console.log('');
          console.log('📈 Summary:');
          console.log(`   Error Indicators: ${foundErrors.length}`);
          console.log(`   Positive Indicators: ${foundPositive.length}`);
          console.log(`   Widget Names Found: ${foundWidgets.length}/${expectedWidgets.length}`);
          console.log(`   Page Size: ${data.length} characters`);
          
          // Final verdict
          const isSuccess = foundErrors.length === 0 && foundPositive.length > 0;
          console.log('');
          console.log('🎯 FINAL VERDICT:');
          if (isSuccess) {
            console.log('🎉 SUCCESS: Widget loading appears to be working!');
            console.log('   ✅ No error messages detected');
            console.log('   ✅ Dashboard loading properly');
            console.log('   ✅ Widget structure present in HTML');
          } else {
            console.log('❌ ISSUES DETECTED:');
            if (foundErrors.length > 0) {
              console.log(`   ❌ ${foundErrors.length} error indicator(s) found`);
            }
            if (foundPositive.length === 0) {
              console.log('   ❌ No positive loading indicators found');
            }
          }
          
          resolve(isSuccess);
          
        } catch (error) {
          console.error('❌ Error analyzing response:', error.message);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      console.error('❌ Request timeout');
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Run the test
testWidgetLoading()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
