#!/bin/bash
echo "🚀 Building PrivAudit for Vercel deployment..."

# Install dependencies for all packages
echo "📦 Installing dependencies..."
npm install

# Build packages in correct order
echo "🔧 Building core package..."
cd packages/core && npm run build && cd ../..

echo "🔧 Building proofs package..."
cd packages/proofs && npm run build && cd ../..

echo "🔧 Building AI package..."
cd packages/ai && npm run build && cd ../..

echo "🌐 Building web application..."
cd apps/web && npm run build && cd ../..

echo "✅ Build completed successfully!"
