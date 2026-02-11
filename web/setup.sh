#!/bin/bash
# Hapetus Website - Quick Setup Script
# Run this before deploying to Cloudflare Pages

set -e

echo "🚀 Hapetus Website Setup"
echo "========================"
echo ""

# Check if we're in the web directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the web/ directory"
  exit 1
fi

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Check for .env.local
if [ ! -f ".env.local" ]; then
  echo ""
  echo "⚠️  No .env.local file found!"
  echo ""
  echo "Please create .env.local with your Firebase configuration:"
  echo ""
  echo "  cp .env.example .env.local"
  echo ""
  echo "Then edit .env.local and add your Firebase credentials from:"
  echo "  https://console.firebase.google.com/"
  echo ""
  read -p "Would you like me to create .env.local now? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cp .env.example .env.local
    echo "✅ Created .env.local - Please edit it with your Firebase credentials"
    echo ""
    echo "Opening .env.local in your default editor..."
    if command -v code &> /dev/null; then
      code .env.local
    elif command -v nano &> /dev/null; then
      nano .env.local
    else
      echo "Please edit .env.local manually"
    fi
    exit 0
  else
    echo "❌ Setup incomplete. Please create .env.local before continuing."
    exit 1
  fi
fi

# Step 3: Verify environment variables
echo "✅ Found .env.local"
echo ""

# Check for required variables
missing_vars=0
required_vars=(
  "NEXT_PUBLIC_FIREBASE_API_KEY"
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  "NEXT_PUBLIC_FIREBASE_APP_ID"
  "NEXT_PUBLIC_API_URL"
)

echo "🔍 Checking environment variables..."
source .env.local

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ] || [ "${!var}" == "your-"* ]; then
    echo "  ❌ $var is not set or contains placeholder value"
    missing_vars=$((missing_vars + 1))
  else
    echo "  ✅ $var"
  fi
done

if [ $missing_vars -gt 0 ]; then
  echo ""
  echo "❌ Please update .env.local with real Firebase credentials"
  echo ""
  echo "Get them from: https://console.firebase.google.com/"
  echo "Project Settings → General → Your apps → Web app"
  exit 1
fi

# Step 4: Test build
echo ""
echo "🏗️  Testing production build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build successful!"
  echo ""
  echo "📁 Static files generated in: out/"
  echo ""
  echo "Next steps:"
  echo "  1. Deploy to Cloudflare Pages (see DEPLOYMENT_GUIDE.md)"
  echo "  2. Or test locally: npm run start"
  echo ""
else
  echo ""
  echo "❌ Build failed. Please check the errors above."
  exit 1
fi
