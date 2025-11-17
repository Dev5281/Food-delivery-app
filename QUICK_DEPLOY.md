# Quick Deploy to Vercel - 5 Minutes

## Fastest Method (Using Vercel Dashboard)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect settings from `vercel.json`
5. **Add Environment Variables** (IMPORTANT!):
   - `MONGODB_URI` = `mongodb+srv://Admin:Devbullet500@cluster0.v48a9.mongodb.net/gofoodmern?retryWrites=true&w=majority`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `tellmethatyoulovewhatudoingrightnow` (or your custom secret)
6. Click **"Deploy"**

### Step 3: Wait for Deployment
- Build takes 2-5 minutes
- Watch the logs for any errors

### Step 4: Test Your App
- Visit the URL Vercel provides
- Test login/signup
- Test food items loading

## Using Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add MONGODB_URI
vercel env add NODE_ENV
vercel env add JWT_SECRET

# Deploy to production
vercel --prod
```

## Common Issues & Quick Fixes

### Build Fails
- Check that `frontend/package.json` has build script
- Ensure all dependencies are in package.json

### API Returns 404
- Check `vercel.json` rewrites are correct
- Verify `api/index.js` exists

### CORS Errors
- Already configured to allow Vercel domains
- Check browser console for specific error

### MongoDB Connection Fails
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check environment variable is set correctly

## After Deployment

Your app will be live at: `https://your-project-name.vercel.app`

Update CORS in `backend/index.js` if you add a custom domain!

