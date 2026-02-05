# Production Deployment Guide - Railway.app

**Total Time**: 15-20 minutes  
**Cost**: Free tier to start ($5/month for production)

---

## 📋 Prerequisites

✅ GitHub account (free)  
✅ MongoDB Atlas account (free)  
✅ Gmail account (for email)  

---

## Step 1: Prepare Your Code (5 minutes)

### 1.1 Update Backend Configuration

Edit `backend/server.js` to use MongoDB:

```javascript
import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();
```

### 1.2 Install MongoDB Driver

```bash
cd backend
npm install mongoose
```

### 1.3 Create Production Build Files

Frontend:
```bash
cd c:\Users\Admin\Music\hub
npm run build
```

Backend - Create `backend/Procfile`:
```
web: node server.js
```

---

## Step 2: MongoDB Atlas Setup (3 minutes)

Follow instructions in [MONGODB_SETUP.md](MONGODB_SETUP.md)

⚠️ **Save your MongoDB connection string!** You'll need it for Railway.

Example:
```
mongodb+srv://moranik_user:YourPassword@cluster0.mongodb.net/moranik-hub?retryWrites=true&w=majority
```

---

## Step 3: Set Up GitHub Repository (3 minutes)

### 3.1 Create GitHub Repo

1. Go to https://github.com/new
2. Repository name: `moranik-hub-production`
3. Description: "Moranik Entertainment Hub - Production"
4. **Public** (Railway free tier works with public repos)
5. Click "Create repository"

### 3.2 Push Code to GitHub

```powershell
cd c:\Users\Admin\Music\hub

# Initialize git (if not already)
git init
git add .
git commit -m "Initial production deployment"

# Add remote
git remote add origin https://github.com/YOUR-USERNAME/moranik-hub-production.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy Backend to Railway (5 minutes)

### 4.1 Sign Up for Railway

1. Go to https://railway.app
2. Click "Start New Project"
3. Sign in with GitHub (recommended)
4. Authorize Railway access to your repositories

### 4.2 Deploy Backend

1. Click "Deploy from GitHub"
2. Select `moranik-hub-production` repository
3. Choose `backend` folder as root directory
4. Click "Deploy"

Railway will auto-detect it's a Node.js app and start building!

### 4.3 Configure Environment Variables

On Railway Dashboard:

1. Click your backend service
2. Go to "Variables"
3. Add these variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://moranik_user:YourPassword@cluster0.mongodb.net/moranik-hub?retryWrites=true&w=majority
JWT_SECRET=GenerateStrongSecretKey_ChangeThis123!
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=https://moranik-hub-frontend.railway.app
```

4. Click "Save and Redeploy"

### 4.4 Get Backend URL

- Deployment will take 2-3 minutes
- Once done, you'll see: `https://moranik-hub-backend.railway.app`
- Save this URL! You'll need it for frontend.

---

## Step 5: Deploy Frontend to Railway (5 minutes)

### 5.1 Create Vite Build Configuration

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://moranik-hub-backend.railway.app',
        changeOrigin: true
      }
    }
  }
})
```

### 5.2 Create Build Output Directory

Frontend needs to serve built files. Create `backend/public` folder and build frontend there:

```powershell
# Build frontend
npm run build

# Copy built files to backend/public
xcopy dist\* backend\public\ /E /I /Y
```

### 5.3 Update Backend to Serve Frontend

Add to `backend/server.js`:

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

### 5.4 Deploy on Railway

Since you're serving frontend from backend, it deploys together!

1. Push changes to GitHub:
```powershell
git add .
git commit -m "Add frontend build and static serving"
git push
```

2. Railway will auto-redeploy (watch the logs)
3. Your site will be at: `https://moranik-hub-backend.railway.app`

---

## Step 6: Add Custom Domain (Optional)

### 6.1 In Railway Dashboard

1. Click your service
2. Go to "Settings" → "Domains"
3. Click "Generate Domain" OR "Add Custom Domain"
4. Copy the domain: `moranik-hub-backend.railway.app`

### 6.2 Add Custom Domain (if you have one)

1. Buy domain from GoDaddy, Namecheap, etc.
2. Go to domain DNS settings
3. Add CNAME record:
   - Name: `www`
   - Value: `moranik-hub-backend.railway.app`
4. Wait 24 hours for DNS to propagate

---

## Step 7: Test Live Deployment (2 minutes)

1. Go to `https://moranik-hub-backend.railway.app`
2. Try to register a new account
3. Verify email works (check spam folder)
4. Test login
5. Test admin login (admin / admin@123)
6. Test Management portal

---

## ✅ Checklist

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas account created and connection string saved
- [ ] Backend deployed to Railway with environment variables set
- [ ] Frontend built and integrated with backend
- [ ] Frontend deployed (served by backend)
- [ ] Site accessible at https://moranik-hub-backend.railway.app
- [ ] Admin login works
- [ ] Email verification works
- [ ] Custom domain added (if applicable)

---

## 🔒 Production Security Checklist

### Before Going Live

- [ ] Change default admin password (admin/admin@123)
- [ ] Change JWT_SECRET to strong random key
- [ ] Set EMAIL_USER and EMAIL_PASSWORD
- [ ] Set FRONTEND_URL to your actual domain
- [ ] Test all auth flows
- [ ] Enable HTTPS (Railway does this by default ✅)
- [ ] Backup MongoDB credentials
- [ ] Set up monitoring alerts

### Generate Secure Keys

```powershell
# Generate JWT_SECRET
$key = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
Write-Host "JWT_SECRET=$key"

# Generate admin password
$pass = -join ((65..90) + (97..122) + (48..57) + (33..47) | Get-Random -Count 16 | % {[char]$_})
Write-Host "Strong Password=$pass"
```

---

## 🆘 Troubleshooting

### Build Failed
- Check Railway logs for errors
- Verify `package.json` scripts are correct
- Make sure all dependencies are installed

### MongoDB Connection Error
- Verify connection string in Railway variables
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
- Test connection locally first

### Frontend Not Loading
- Check if `public/index.html` exists after build
- Verify frontend build succeeded
- Check Railway logs for 404 errors

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASSWORD
- Enable "Less secure app access" in Gmail OR use app-specific password
- Check Gmail forwarding rules don't block it

### Admin Login Not Working
- Default is admin / admin@123
- Check admin.json exists in backend
- Verify bcryptjs is installed

---

## 📊 Monitoring & Updates

### View Live Logs
Railway Dashboard → Your Service → Logs

### Update Your Code
```powershell
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Railway auto-redeploys automatically!
```

### Database Backups
MongoDB Atlas free tier includes daily backups. Access them in:
Dashboard → Clusters → Backup

---

## 💰 Cost Breakdown

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Railway (Backend) | Free | $0 | 5GB/month, then $5/month |
| Railway (Frontend) | Included | $0 | Served by backend |
| MongoDB Atlas | Free (512MB) | $0 | Free forever if under limits |
| Gmail SMTP | Free | $0 | Limited: 500 emails/day |
| Domain | Optional | $10-15/year | Not needed initially |
| **Total First Month** | | **$0** | Everything free! |
| **Total After Free Tier** | | **~$5/month** | Only if exceeding limits |

---

## 🎉 You're Live!

Your website is now running on the internet 24/7!

**Your Live URL**: https://moranik-hub-backend.railway.app

Share it with anyone and they can:
- Register new accounts
- Verify emails
- Login
- Access content
- Use admin portal (with credentials)

---

## 📞 Next Steps

1. **Change Admin Password**: Use the password change endpoint
2. **Set Up Email Domain**: Use custom email instead of Gmail for better deliverability
3. **Add Google Analytics**: Track user behavior
4. **Enable HTTPS**: Already done by Railway ✅
5. **Scale Database**: Upgrade MongoDB when you hit 512MB limit
6. **Add More Admins**: Modify code to support multiple admin accounts
7. **Set Up Monitoring**: Railway provides free basic monitoring

---

## 🚀 Success!

Your production deployment is complete and live!

Need help? Railway has excellent docs at https://docs.railway.app
