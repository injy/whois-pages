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

// Copy necessary config files to dist
console.log('Copying configuration files...');
const filesToCopy = ['package.json', '.env'];
for (const file of filesToCopy) {
  const srcPath = path.resolve(rootDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.resolve(distDir, file));
    console.log(`Copied ${file}`);
  }
}

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
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
