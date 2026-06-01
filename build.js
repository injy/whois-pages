#!/usr/bin/env node

/**
 * Build script for cloud deployment platforms
 * Forces installation and build in correct order
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

console.log('=== WHOIS Domain Lookup Build Script ===\n');
console.log('Working directory:', rootDir);

try {
  // Step 1: Install ALL dependencies explicitly
  console.log('\n=== Step 1: Installing ALL dependencies ===');

  // Root deps
  console.log('\n[1/3] Root dependencies...');
  if (fs.existsSync(path.join(rootDir, 'package.json'))) {
    execSync('npm install --prefer-offline', { cwd: rootDir, stdio: 'inherit' });
  }

  // Backend deps
  console.log('\n[2/3] Backend dependencies...');
  if (fs.existsSync(path.join(backendDir, 'package.json'))) {
    execSync('npm install --prefer-offline', { cwd: backendDir, stdio: 'inherit' });
  }

  // Frontend deps - THE CRITICAL ONE
  console.log('\n[3/3] Frontend dependencies...');
  if (fs.existsSync(path.join(frontendDir, 'package.json'))) {
    // Force clean install
    const frontendNodeModules = path.join(frontendDir, 'node_modules');
    if (fs.existsSync(frontendNodeModules)) {
      console.log('Removing existing node_modules...');
      fs.rmSync(frontendNodeModules, { recursive: true, force: true });
    }
    execSync('npm install --no-cache', { cwd: frontendDir, stdio: 'inherit' });
  }

  // Verify vite is installed
  console.log('\n=== Verifying vite installation ===');
  const viteBin = path.join(frontendDir, 'node_modules', '.bin', 'vite');
  const vitePkg = path.join(frontendDir, 'node_modules', 'vite');

  console.log('Vite binary exists:', fs.existsSync(viteBin));
  console.log('Vite package exists:', fs.existsSync(vitePkg));

  if (!fs.existsSync(vitePkg)) {
    throw new Error('Vite was not installed correctly in frontend directory!');
  }

  // Step 2: Build frontend
  console.log('\n=== Step 2: Building frontend ===');
  execSync(`node ${viteBin} build`, { cwd: frontendDir, stdio: 'inherit' });

  console.log('\n=== Build completed successfully! ===');
} catch (error) {
  console.error('\n!!! BUILD FAILED !!!');
  console.error('Error:', error.message);
  if (error.stdout) console.error('stdout:', error.stdout.toString());
  if (error.stderr) console.error('stderr:', error.stderr.toString());
  process.exit(1);
}
