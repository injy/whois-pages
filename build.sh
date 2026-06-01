#!/bin/bash
# Build script for cloud deployment platforms

set -e

echo "Installing dependencies..."
cd backend && npm install
cd ../frontend && npm install

echo "Building frontend..."
npm run build

echo "Build completed successfully!"
