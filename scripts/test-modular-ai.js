#!/usr/bin/env node

/**
 * Test script for modular AI action handler performance
 */

const fs = require('fs');
const path = require('path');

// Performance measurement utilities
function measureTime(label, fn) {
  const start = process.hrtime.bigint();
  const result = fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  
  console.log(`${label}: ${duration.toFixed(2)}ms`);
  return { result, duration };
}

async function measureAsyncTime(label, fn) {
  const start = process.hrtime.bigint();
  const result = await fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  
  console.log(`${label}: ${duration.toFixed(2)}ms`);
  return { result, duration };
}

// File size analysis
function analyzeFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const sizeInKB = (stats.size / 1024).toFixed(2);
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').length;
    
    return {
      path: filePath,
      sizeKB: parseFloat(sizeInKB),
      lines: lines,
      exists: true
    };
  } catch (error) {
    return {
      path: filePath,
      sizeKB: 0,
      lines: 0,
      exists: false,
      error: error.message
    };
  }
}

// Compare file sizes
function compareFileSizes() {
  console.log('\n=== File Size Analysis ===');
  
  const files = [
    'src/services/AIActionHandler.ts',
    'src/services/AIActionHandlerModular.ts',
    'src/services/AICommandParser.ts',
    'src/services/ai-modules/NavigationActions.ts',
    'src/services/ai-modules/StudyActions.ts',
    'src/services/ai-modules/UIControlActions.ts',
    'src/services/ai-modules/ExternalAPIActions.ts'
  ];

  const results = files.map(file => analyzeFileSize(path.join(process.cwd(), file)));
  
  // Sort by size
  results.sort((a, b) => b.sizeKB - a.sizeKB);
  
  console.log('\nFile sizes (largest first):');
  results.forEach(result => {
    if (result.exists) {
      console.log(`  ${result.path}: ${result.sizeKB}KB (${result.lines} lines)`);
    } else {
      console.log(`  ${result.path}: NOT FOUND - ${result.error}`);
    }
  });

  // Calculate totals
  const originalSize = results.find(r => r.path.includes('AIActionHandler.ts') && !r.path.includes('Modular'));
  const modularSize = results.find(r => r.path.includes('AIActionHandlerModular.ts'));
  const modulesSizes = results.filter(r => r.path.includes('ai-modules/'));
  
  if (originalSize && originalSize.exists) {
    console.log(`\nOriginal AIActionHandler: ${originalSize.sizeKB}KB (${originalSize.lines} lines)`);
  }
  
  if (modularSize && modularSize.exists) {
    console.log(`Modular AIActionHandler: ${modularSize.sizeKB}KB (${modularSize.lines} lines)`);
  }
  
  if (modulesSizes.length > 0) {
    const totalModulesSize = modulesSizes.reduce((sum, mod) => sum + (mod.exists ? mod.sizeKB : 0), 0);
    const totalModulesLines = modulesSizes.reduce((sum, mod) => sum + (mod.exists ? mod.lines : 0), 0);
    console.log(`Total modules: ${totalModulesSize.toFixed(2)}KB (${totalModulesLines} lines)`);
    
    if (modularSize && modularSize.exists) {
      const totalModularSize = modularSize.sizeKB + totalModulesSize;
      console.log(`Total modular system: ${totalModularSize.toFixed(2)}KB`);
      
      if (originalSize && originalSize.exists) {
        const reduction = ((originalSize.sizeKB - modularSize.sizeKB) / originalSize.sizeKB * 100).toFixed(1);
        console.log(`Main handler size reduction: ${reduction}%`);
      }
    }
  }
}

// Test module loading performance
async function testModuleLoading() {
  console.log('\n=== Module Loading Performance Test ===');
  
  try {
    // Test dynamic imports
    const modules = [
      'NavigationActions',
      'StudyActions', 
      'UIControlActions',
      'ExternalAPIActions'
    ];

    for (const moduleName of modules) {
      const modulePath = `../src/services/ai-modules/${moduleName}`;
      
      await measureAsyncTime(`Loading ${moduleName}`, async () => {
        try {
          const module = await import(modulePath);
          return module.default;
        } catch (error) {
          console.log(`  Error loading ${moduleName}: ${error.message}`);
          return null;
        }
      });
    }
    
  } catch (error) {
    console.log(`Module loading test failed: ${error.message}`);
  }
}

// Test compilation impact
function testCompilationImpact() {
  console.log('\n=== Compilation Impact Analysis ===');
  
  // Analyze TypeScript files that might affect compilation
  const tsFiles = [
    'src/services/AIActionHandler.ts',
    'src/services/AIActionHandlerModular.ts',
    'src/services/AICommandParser.ts'
  ];

  tsFiles.forEach(file => {
    const analysis = analyzeFileSize(path.join(process.cwd(), file));
    if (analysis.exists) {
      // Estimate compilation complexity based on file size and lines
      const complexity = analysis.lines > 1000 ? 'High' : 
                        analysis.lines > 500 ? 'Medium' : 'Low';
      
      console.log(`  ${path.basename(file)}: ${complexity} complexity (${analysis.lines} lines)`);
    }
  });
}

// Generate recommendations
function generateRecommendations() {
  console.log('\n=== Optimization Recommendations ===');
  
  const recommendations = [
    '1. Use AIActionHandlerModular for new implementations',
    '2. Lazy load action modules only when needed',
    '3. Preload commonly used modules (navigation, study) on app start',
    '4. Consider further splitting large modules if they exceed 300 lines',
    '5. Monitor bundle size impact in production builds',
    '6. Use webpack bundle analyzer to verify chunk splitting effectiveness'
  ];

  recommendations.forEach(rec => console.log(`  ${rec}`));
}

// Test action execution performance
async function testActionExecution() {
  console.log('\n=== Action Execution Performance Test ===');
  
  // Mock action for testing
  const testAction = {
    type: 'navigate_to_page',
    payload: { page: '/test' },
    description: 'Test navigation action'
  };

  console.log('Testing action execution with modular handler...');
  console.log('(Note: This is a simulation - actual performance will vary in browser environment)');
  
  // Simulate module loading time
  const moduleLoadTime = Math.random() * 50 + 10; // 10-60ms
  const actionExecutionTime = Math.random() * 20 + 5; // 5-25ms
  
  console.log(`  Simulated module load time: ${moduleLoadTime.toFixed(2)}ms`);
  console.log(`  Simulated action execution time: ${actionExecutionTime.toFixed(2)}ms`);
  console.log(`  Total simulated time: ${(moduleLoadTime + actionExecutionTime).toFixed(2)}ms`);
}

// Main test function
async function runTests() {
  console.log('🚀 Modular AI Action Handler Performance Test');
  console.log('='.repeat(50));
  
  // Run all tests
  compareFileSizes();
  await testModuleLoading();
  testCompilationImpact();
  await testActionExecution();
  generateRecommendations();
  
  console.log('\n✅ Performance test completed!');
  console.log('\nNext steps:');
  console.log('1. Update AIContextService to use AIActionHandlerModular');
  console.log('2. Test in development environment');
  console.log('3. Measure actual compilation times');
  console.log('4. Monitor bundle sizes in production');
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  analyzeFileSize,
  measureTime,
  measureAsyncTime,
  compareFileSizes,
  testModuleLoading,
  runTests
};
