#!/usr/bin/env node

/**
 * Build script for cloud deployment platforms
 * This script handles dependency installation and building
 */

const { execSync } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

console.log('=== WHOIS Domain Lookup Build Script ===\n');

try {
  // Step 1: Install backend dependencies
  console.log('Step 1: Installing backend dependencies...');
  execSync('npm install', { cwd: backendDir, stdio: 'inherit' });

  // Step 2: Install frontend dependencies
  console.log('\nStep 2: Installing frontend dependencies...');
  execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

  // Step 3: Build frontend
  console.log('\nStep 3: Building frontend...');
  execSync('npx vite build', { cwd: frontendDir, stdio: 'inherit' });

  console.log('\n=== Build completed successfully! ===');
} catch (error) {
  console.error('\nBuild failed:', error.message);
  process.exit(1);
}
