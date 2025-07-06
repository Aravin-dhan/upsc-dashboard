#!/usr/bin/env node

/**
 * Dependency Optimization Script
 * Analyzes and optimizes package.json dependencies for better build performance
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Heavy dependencies that can be optimized
const HEAVY_DEPS = {
  'playwright': 'Used for testing - consider moving to devDependencies',
  'puppeteer': 'Used for testing - consider moving to devDependencies',
  '@playwright/test': 'Testing framework - should be in devDependencies',
  'framer-motion': 'Animation library - consider lazy loading',
  'react-markdown': 'Markdown renderer - consider dynamic import',
  'remark-gfm': 'Markdown plugin - consider dynamic import',
  'lucide-react': 'Icon library - optimize with tree shaking',
  'recharts': 'Chart library - consider lazy loading',
  'date-fns': 'Date utility - consider lighter alternatives',
  'lodash': 'Utility library - use specific imports',
};

// Dependencies that should be in devDependencies
const DEV_ONLY_DEPS = [
  'playwright',
  'puppeteer',
  '@playwright/test',
  '@types/node',
  '@types/react',
  '@types/react-dom',
  'eslint',
  'typescript',
  'tailwindcss',
  'postcss',
  'autoprefixer',
];

// Analyze current dependencies
function analyzeDependencies() {
  console.log('🔍 Analyzing dependencies...\n');

  const { dependencies = {}, devDependencies = {} } = packageJson;
  const allDeps = { ...dependencies, ...devDependencies };

  // Check for heavy dependencies
  console.log('📦 Heavy Dependencies Found:');
  Object.keys(HEAVY_DEPS).forEach(dep => {
    if (allDeps[dep]) {
      console.log(`  ⚠️  ${dep}: ${HEAVY_DEPS[dep]}`);
    }
  });

  // Check for misplaced dependencies
  console.log('\n🔧 Dependency Placement Issues:');
  DEV_ONLY_DEPS.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`  ❌ ${dep} should be in devDependencies`);
    }
  });

  // Check for unused dependencies (basic check)
  console.log('\n🧹 Potentially Unused Dependencies:');
  const srcPath = path.join(__dirname, '../src');
  const srcFiles = getAllFiles(srcPath, ['.ts', '.tsx', '.js', '.jsx']);
  const srcContent = srcFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');

  Object.keys(dependencies).forEach(dep => {
    // Skip Next.js and React core deps
    if (['next', 'react', 'react-dom'].includes(dep)) return;
    
    // Check if dependency is imported anywhere
    const importPatterns = [
      new RegExp(`import.*from ['"]${dep}['"]`, 'g'),
      new RegExp(`import.*['"]${dep}['"]`, 'g'),
      new RegExp(`require\\(['"]${dep}['"]\\)`, 'g'),
    ];

    const isUsed = importPatterns.some(pattern => pattern.test(srcContent));
    if (!isUsed) {
      console.log(`  🤔 ${dep} - no imports found`);
    }
  });

  console.log('\n📊 Dependency Statistics:');
  console.log(`  Total dependencies: ${Object.keys(dependencies).length}`);
  console.log(`  Total devDependencies: ${Object.keys(devDependencies).length}`);
  console.log(`  Total packages: ${Object.keys(allDeps).length}`);
}

// Get all files recursively
function getAllFiles(dirPath, extensions) {
  const files = [];
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dirPath);
  return files;
}

// Generate optimization recommendations
function generateRecommendations() {
  console.log('\n💡 Optimization Recommendations:\n');

  console.log('1. 🚀 Bundle Optimization:');
  console.log('   - Move testing dependencies to devDependencies');
  console.log('   - Use dynamic imports for heavy components');
  console.log('   - Implement tree shaking for icon libraries');
  console.log('   - Consider lighter alternatives for utility libraries\n');

  console.log('2. 📦 Code Splitting:');
  console.log('   - Lazy load chart components (recharts)');
  console.log('   - Dynamic import for markdown rendering');
  console.log('   - Split AI services into separate chunks');
  console.log('   - Use React.lazy for heavy dashboard components\n');

  console.log('3. 🔧 Import Optimization:');
  console.log('   - Use specific imports: import { format } from "date-fns/format"');
  console.log('   - Tree shake lucide-react: import { Icon } from "lucide-react"');
  console.log('   - Avoid default imports for large libraries\n');

  console.log('4. ⚡ Performance Improvements:');
  console.log('   - Enable webpack bundle splitting');
  console.log('   - Use Next.js dynamic imports');
  console.log('   - Implement service worker for caching');
  console.log('   - Optimize image loading with next/image\n');
}

// Generate optimized package.json
function generateOptimizedPackageJson() {
  console.log('📝 Generating optimized package.json...\n');

  const optimized = { ...packageJson };
  
  // Move dev-only dependencies
  DEV_ONLY_DEPS.forEach(dep => {
    if (optimized.dependencies && optimized.dependencies[dep]) {
      if (!optimized.devDependencies) optimized.devDependencies = {};
      optimized.devDependencies[dep] = optimized.dependencies[dep];
      delete optimized.dependencies[dep];
      console.log(`✅ Moved ${dep} to devDependencies`);
    }
  });

  // Add optimization scripts
  if (!optimized.scripts) optimized.scripts = {};
  optimized.scripts['analyze-bundle'] = 'ANALYZE=true npm run build';
  optimized.scripts['deps-check'] = 'node scripts/optimize-deps.js';
  optimized.scripts['build-stats'] = 'npm run build && npx webpack-bundle-analyzer .next/static/chunks/*.js';

  // Write optimized package.json
  const optimizedPath = path.join(__dirname, '../package.optimized.json');
  fs.writeFileSync(optimizedPath, JSON.stringify(optimized, null, 2));
  console.log(`\n💾 Optimized package.json saved to: ${optimizedPath}`);
  console.log('Review the changes and replace package.json if satisfied.');
}

// Main execution
function main() {
  console.log('🚀 UPSC Dashboard Dependency Optimizer\n');
  console.log('=' .repeat(50));
  
  try {
    analyzeDependencies();
    generateRecommendations();
    generateOptimizedPackageJson();
    
    console.log('\n✨ Optimization analysis complete!');
    console.log('Run "npm install" after updating package.json');
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeDependencies,
  generateRecommendations,
  generateOptimizedPackageJson,
};
