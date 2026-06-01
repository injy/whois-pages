#!/usr/bin/env node

/**
 * Build script for cloud deployment platforms
 * Installs all dependencies from root and builds frontend
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

console.log('=== WHOIS Domain Lookup Build Script ===\n');

try {
  // Step 1: Install root dependencies (includes vite, vue, etc.)
  console.log('Step 1: Installing root dependencies...');
  execSync('npm install', { cwd: rootDir, stdio: 'inherit' });

  // Step 2: Install backend dependencies
  console.log('\nStep 2: Installing backend dependencies...');
  execSync('npm install', { cwd: backendDir, stdio: 'inherit' });

  // Step 3: Install frontend dependencies
  console.log('\nStep 3: Installing frontend dependencies...');
  execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

  // Step 4: Build frontend using root-level vite
  console.log('\nStep 4: Building frontend...');
  
  // Try multiple ways to run vite
  const vitePaths = [
    path.join(rootDir, 'node_modules', '.bin', 'vite'),
    path.join(frontendDir, 'node_modules', '.bin', 'vite')
  ];
  
  let viteCmd = null;
  for (const vp of vitePaths) {
    if (fs.existsSync(vp)) {
      viteCmd = vp;
      console.log(`Found vite at: ${vp}`);
      break;
    }
  }
  
  if (!viteCmd) {
    // Fallback: use npx from root
    viteCmd = 'npx vite';
    console.log('Using npx vite as fallback');
  }
  
  execSync(`${viteCmd} build`, { cwd: frontendDir, stdio: 'inherit' });

  console.log('\n=== Build completed successfully! ===');
} catch (error) {
  console.error('\nBuild failed:', error.message);
  process.exit(1);
}