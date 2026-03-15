# Vercel Deployment Script
# Run this script to deploy to Vercel

Write-Host "🚀 Starting Vercel deployment..." -ForegroundColor Green

# Check if vercel is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if logged in
Write-Host "📋 Checking Vercel login status..." -ForegroundColor Yellow
vercel whoami

# Deploy to production
Write-Host "`n🚀 Deploying to production..." -ForegroundColor Green
vercel --prod

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "Check your Vercel dashboard for the deployment URL." -ForegroundColor Cyan

