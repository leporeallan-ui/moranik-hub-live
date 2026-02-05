#!/bin/bash
# Production build script for Railway deployment

echo "🔨 Building frontend..."
npm run build

echo "📦 Copying frontend build to backend/public..."
mkdir -p backend/public
cp -r dist/* backend/public/

echo "✅ Build complete!"
echo "Frontend files: $(find backend/public -type f | wc -l) files"
