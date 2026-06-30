const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const frontendSrcDir = path.resolve(rootDir, 'frontend');
const backendSrcDir = path.resolve(rootDir, 'backend');
const distBackendDir = path.resolve(distDir, 'api');

console.log('Starting build process...');

// Clean dist directory
if (fs.existsSync(distDir)) {
  console.log('Cleaning dist directory...');
  fs.rmSync(distDir, { recursive: true, force: true });
}

// Build frontend
console.log('Building frontend...');
try {
  execSync('npx vite build', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('Frontend build completed.');
} catch (error) {
  console.error('Frontend build failed:', error.message);
  process.exit(1);
}

// Copy backend files to dist/api
console.log('Copying backend files...');
copyDirectory(backendSrcDir, distBackendDir);
console.log('Backend files copied.');

// Copy package.json to dist (for production dependency install)
console.log('Copying package.json...');
const pkgSrcPath = path.resolve(rootDir, 'package.json');
fs.copyFileSync(pkgSrcPath, path.resolve(distDir, 'package.json'));
console.log('Copied package.json');

console.log('Build completed successfully!');
console.log(`Output directory: ${distDir}`);

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and other unnecessary directories
      if (entry.name === 'node_modules' || entry.name === '.git') {
        continue;
      }
      copyDirectory(srcPath, destPath);
    } else {
      // Skip .env (env vars should come from deployment platform)
      if (entry.name === '.env') {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
