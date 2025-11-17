# Deploying to Vercel - Step by Step Guide

This guide will help you deploy your Food Delivery App to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Vercel CLI installed (optional, but recommended)
3. Your MongoDB connection string ready
4. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

## Step 2: Prepare Your Project

### 2.1 Install Dependencies

Make sure all dependencies are installed:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2.2 Build Frontend (Test Locally)

```bash
cd frontend
npm run build
cd ..
```

This should create a `frontend/build` folder. If it works locally, it will work on Vercel.

## Step 3: Set Up Environment Variables

You need to set these environment variables in Vercel:

1. **MongoDB Connection String**: Your MongoDB Atlas connection URI
2. **JWT Secret**: The secret key for JWT tokens (currently: `tellmethatyoulovewhatudoingrightnow`)
3. **NODE_ENV**: Set to `production`

### Option A: Using Vercel Dashboard

1. Go to your project on Vercel
2. Click on **Settings** → **Environment Variables**
3. Add the following variables:

```
MONGODB_URI=mongodb+srv://Admin:Devbullet500@cluster0.v48a9.mongodb.net/gofoodmern?retryWrites=true&w=majority
JWT_SECRET=tellmethatyoulovewhatudoingrightnow
NODE_ENV=production
```

### Option B: Using Vercel CLI

```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect the settings from `vercel.json`
5. Click **Deploy**

### Option B: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# For production deployment
vercel --prod
```

## Step 5: Update MongoDB Connection (if needed)

If your MongoDB connection string is different, update it in:
- `backend/db.js` (or use environment variable)
- Vercel environment variables

## Step 6: Update CORS (if needed)

After deployment, Vercel will give you a URL like: `https://your-app-name.vercel.app`

If you need to restrict CORS to specific domains, update `backend/index.js`:

```javascript
const allowedOrigins = [
  'https://your-app-name.vercel.app',
  'https://your-custom-domain.com'
];
```

## Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Test the following:
   - Homepage loads
   - Food items display
   - User signup
   - User login
   - Add to cart
   - Place order

## Troubleshooting

### Issue: Build Fails

**Solution**: Check the build logs in Vercel dashboard. Common issues:
- Missing dependencies in `package.json`
- Build command failing
- Environment variables not set

### Issue: API Routes Return 404

**Solution**: 
- Check that `api/index.js` exists
- Verify `vercel.json` rewrites are correct
- Check function logs in Vercel dashboard

### Issue: CORS Errors

**Solution**:
- Update CORS in `backend/index.js` to include your Vercel domain
- Check that `origin: true` is set for development

### Issue: MongoDB Connection Fails

**Solution**:
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check environment variables are set correctly
- Verify connection string is correct

### Issue: Frontend Can't Find API

**Solution**:
- Ensure API calls use relative paths (`/api/...`) not absolute URLs
- Check that `vercel.json` rewrites are configured correctly

## Project Structure for Vercel

```
Food-delivery-app/
├── api/
│   └── index.js          # Vercel serverless function wrapper
├── backend/
│   ├── index.js          # Express app (exports app for Vercel)
│   ├── db.js
│   ├── models/
│   └── Routes/
├── frontend/
│   ├── build/            # Built React app (generated)
│   ├── src/
│   └── package.json
├── vercel.json           # Vercel configuration
├── .vercelignore         # Files to ignore
└── package.json
```

## Important Notes

1. **Serverless Functions**: Vercel runs your backend as serverless functions, not a traditional server
2. **Cold Starts**: First request might be slower due to cold starts
3. **Function Timeout**: Default timeout is 10 seconds (can be increased in Pro plan)
4. **Environment Variables**: Must be set in Vercel dashboard, not in `.env` files
5. **Build Output**: Frontend build must be in `frontend/build` directory

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update CORS in `backend/index.js` to include your custom domain

## Need Help?

- Check Vercel logs in the dashboard
- Review function logs for API errors
- Test API endpoints directly using the Vercel URL
- Check MongoDB Atlas logs for connection issues

