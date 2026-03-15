#!/bin/bash
# Vercel Deployment Script
# Run this script to deploy to Vercel

echo "🚀 Starting Vercel deployment..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in
echo "📋 Checking Vercel login status..."
vercel whoami

# Deploy to production
echo ""
echo "🚀 Deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "Check your Vercel dashboard for the deployment URL."

