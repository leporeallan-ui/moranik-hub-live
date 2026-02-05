# Quick Railway.app Backend Deployment

## Step 1: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select: `leporeallan-ui/moranik-hub-live`
4. Set Root Directory: `backend`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://moranik_user:Keevan@2022@cluster0.e4apn2u.mongodb.net/moranik-hub?retryWrites=true&w=majority
   JWT_SECRET=moranik-hub-production-secret-key-2024-change-this-in-production
   FRONTEND_URL=https://moranik-hub-live.vercel.app
   ```

## Step 2: Update Frontend API URLs

Once deployed, Railway will give you a URL like:
`https://your-app-name.up.railway.app`

Then I'll update all frontend API calls to use this URL instead of localhost.

## Step 3: Final Result

- Frontend: Vercel (fast CDN)
- Backend: Railway (always-on server)
- Full functionality restored!
