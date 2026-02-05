# 🚀 Go Live - Quick Start (10 minutes)

## Your Deployment Stack

✅ **Hosting**: Railway.app (free tier, then $5/month)  
✅ **Database**: MongoDB Atlas (free 512MB)  
✅ **Email**: Gmail SMTP (already configured)  
✅ **Domain**: Railway default subdomain (free custom domain available)

---

## ⚡ Quick Start - 3 Easy Steps

### Step 1️⃣: Set Up MongoDB (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with GitHub (recommended)
3. Click "Build a Database" → Choose **M0 FREE**
4. Select AWS region near you
5. Wait 2-3 minutes for cluster creation
6. Go to "Security" → "Database Access" → "Add New Database User"
   - Username: `moranik_user`
   - Password: `YourStrongPassword123!` (save this!)
   - Privileges: Atlas Admin
7. Go to "Network Access" → "Add IP Address" → Allow from anywhere (0.0.0.0/0)
8. Click "Clusters" → "Connect" → Copy connection string
9. Replace `<username>` with `moranik_user` and `<password>` with your password

**Save your connection string!** You'll need it in next step.

---

### Step 2️⃣: Push Code to GitHub (2 minutes)

1. Create new repo at https://github.com/new
   - Name: `moranik-hub-prod`
   - Public repo
2. Push your code:

```powershell
cd c:\Users\Admin\Music\hub

git init
git add .
git commit -m "Initial production deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/moranik-hub-prod.git
git push -u origin main
```

✅ Your code is now on GitHub!

---

### Step 3️⃣: Deploy on Railway (3 minutes)

1. Go to https://railway.app
2. Click "Start New Project"
3. Sign in with GitHub
4. Click "Deploy from GitHub"
5. Select `moranik-hub-prod` repository
6. Click "Deploy"

**While Railway builds, add environment variables:**

1. Click your service → "Variables"
2. Add these (replace with your actual values):

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://moranik_user:YourPassword@cluster0.mongodb.net/moranik-hub?retryWrites=true&w=majority
JWT_SECRET=ChangeMe_SuperSecretKey_12345!
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=https://moranik-hub-prod.railway.app
```

3. Click "Save and Redeploy"

**Wait 2-3 minutes for deployment...**

✅ **Done! Your site is live!** 🎉

Check the deployment logs to confirm "Server running" message.

---

## 🌐 Access Your Live Site

Once deployment succeeds:

**URL**: https://moranik-hub-prod.railway.app

Try these:
- Register a new account
- Verify email
- Login
- Access admin (default: admin / admin@123)

---

## 🔐 Security - Change These NOW!

### 1. Change Default Admin Password
Use the admin change password endpoint:

```bash
curl -X POST https://moranik-hub-prod.railway.app/api/auth/admin-change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"currentPassword":"admin@123","newPassword":"YourNewPassword123!"}'
```

### 2. Change JWT_SECRET
Go to Railway → Variables → Change JWT_SECRET to random key:

```powershell
$key = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
Write-Host $key
```

### 3. Gmail App Password
If you haven't set it up:
- Go to https://myaccount.google.com/security
- Enable 2-Factor Authentication
- Create App Password for Gmail
- Use that as EMAIL_PASSWORD in Railway

---

## ✅ Testing Checklist

- [ ] Site loads at your Railway URL
- [ ] Can register new account
- [ ] Email verification works
- [ ] Can login with credentials
- [ ] Admin login works (admin/admin@123)
- [ ] Management portal accessible
- [ ] Can logout

---

## 📊 You're Live!

| Component | Location | Status |
|-----------|----------|--------|
| Frontend | Served by backend | ✅ Live |
| Backend API | Port 5000 | ✅ Live |
| Database | MongoDB Atlas | ✅ Free tier |
| Email | Gmail SMTP | ✅ Free 500/day |
| Domain | Railway subdomain | ✅ Free |
| **Total Cost** | | **$0 forever!** |

---

## 🔄 Making Updates

Whenever you make code changes:

```powershell
git add .
git commit -m "Your changes"
git push origin main
```

Railway auto-redeploys! Check deployment logs to confirm.

---

## 📚 Full Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete step-by-step guide
- [MONGODB_SETUP.md](MONGODB_SETUP.md) - MongoDB Atlas detailed setup
- [ADMIN_PROTECTION_GUIDE.md](ADMIN_PROTECTION_GUIDE.md) - Admin system details

---

## 🆘 Quick Troubleshooting

**"Build Failed"**  
→ Check Railway logs, scroll down to see error

**"Database Connection Error"**  
→ Verify MONGODB_URI in Railway Variables is correct

**"Frontend Not Loading"**  
→ Make sure you pushed code to GitHub with the build files

**"Email Not Working"**  
→ Check EMAIL_USER and EMAIL_PASSWORD are correct Gmail credentials

**"Admin Login Fails"**  
→ Try default credentials: admin / admin@123

---

## 🎉 You're Done!

Your website is now **LIVE** on the internet!

**Next Steps:**
1. Test all features
2. Share your URL with others
3. Monitor Railway logs for errors
4. Upgrade plan when you exceed free limits

---

**Need help?** Railway docs: https://docs.railway.app
