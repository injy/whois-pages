#!/usr/bin/env node

/**
 * Simple build script - uses root-level vite to build frontend
 */

const { execSync } = require('child_process');
const path = require('path');

const rootDir = __dirname;

console.log('=== Building WHOIS Domain Lookup ===\n');

try {
  // Use root-level vite to build frontend
  const viteBin = path.join(rootDir, 'node_modules', '.bin', 'vite');
  console.log('Using vite from:', viteBin);
  
  execSync(`node ${viteBin} build --config frontend/vite.config.js`, { 
    cwd: rootDir, 
    stdio: 'inherit' 
  });

  console.log('\n=== Build completed successfully! ===');
} catch (error) {
  console.error('\n!!! BUILD FAILED !!!');
  console.error('Error:', error.message);
  process.exit(1);
}
