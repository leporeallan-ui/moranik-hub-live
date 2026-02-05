# Deploy Backend to Production

## Option 1: Railway.app (Recommended)

### Steps:
1. **Go to railway.app**
2. **Login** with GitHub
3. **Click "Deploy from GitHub repo"**
4. **Select repository:** `leporeallan-ui/moranik-hub-live`
5. **Set Root Directory:** `backend`
6. **Add Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://moranik_user:Keevan@2022@cluster0.e4apn2u.mongodb.net/moranik-hub?retryWrites=true&w=majority
   JWT_SECRET=moranik-hub-production-secret-key-2024-change-this-in-production
   FRONTEND_URL=https://moranik-hub-live.vercel.app
   PORT=5000
   ```
7. **Click "Deploy"**

### Result:
- Backend runs at: `https://your-app-name.up.railway.app`
- Always-on server
- MongoDB connected
- Production ready

## Option 2: Vercel Functions

### Update vercel.json:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "backend/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## Option 3: Heroku

### Install Heroku CLI:
```bash
npm install -g heroku
```

### Deploy:
```bash
cd backend
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://moranik_user:Keevan@2022@cluster0.e4apn2u.mongodb.net/moranik-hub?retryWrites=true&w=majority
heroku config:set JWT_SECRET=moranik-hub-production-secret-key-2024-change-this-in-production
heroku config:set FRONTEND_URL=https://moranik-hub-live.vercel.app
git subtree push --prefix backend heroku main
```

## Option 4: DigitalOcean

### Create Droplet:
- Ubuntu server
- Install Node.js
- Install PM2
- Deploy with Git

## Option 5: AWS EC2

### Setup:
- Create EC2 instance
- Install Node.js
- Deploy with Git

## Recommended: Railway

**Why Railway is best:**
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ Built for Node.js
- ✅ MongoDB friendly
- ✅ Environment variables support
- ✅ HTTPS included

## After Deployment:

1. **Update frontend API URLs** to production backend URL
2. **Test all functionality**
3. **Monitor logs** for any issues
