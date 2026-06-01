#!/usr/bin/env node

/**
 * Build script - ensures fresh install then builds frontend
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;

console.log('=== Building WHOIS Domain Lookup ===\n');

try {
  // Force clean install
  const nodeModules = path.join(rootDir, 'node_modules');
  const packageLock = path.join(rootDir, 'package-lock.json');
  
  if (fs.existsSync(nodeModules)) {
    console.log('Removing existing node_modules...');
    fs.rmSync(nodeModules, { recursive: true, force: true });
  }
  if (fs.existsSync(packageLock)) {
    console.log('Removing package-lock.json...');
    fs.unlinkSync(packageLock);
  }
  
  console.log('Installing dependencies...');
  execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
  
  // Verify vite is installed
  const viteBin = path.join(rootDir, 'node_modules', '.bin', 'vite');
  console.log('\nVite binary exists:', fs.existsSync(viteBin));
  
  if (!fs.existsSync(viteBin)) {
    throw new Error('Vite binary not found after npm install!');
  }
  
  console.log('Building frontend...\n');
  execSync(`${viteBin} build --config frontend/vite.config.js`, { 
    cwd: rootDir, 
    stdio: 'inherit' 
  });

  console.log('\n=== Build completed successfully! ===');
} catch (error) {
  console.error('\n!!! BUILD FAILED !!!');
  console.error('Error:', error.message);
  process.exit(1);
}
