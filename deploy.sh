#!/bin/bash

# Deployment script for Mini EdTech Platform

echo "🚀 Starting deployment process..."

# Check if we're on the master branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  Warning: You're not on the master branch. Current branch: $CURRENT_BRANCH"
    echo "Do you want to continue? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build the applications
echo "🔨 Building applications..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🎉 Ready for deployment to Render!"
    echo ""
    echo "Next steps:"
    echo "1. Push this branch to your GitHub repository"
    echo "2. Connect your GitHub repo to Render"
    echo "3. Deploy using the render.yaml configuration"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi