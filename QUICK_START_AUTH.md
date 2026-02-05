# Authentication System - Quick Start Guide

## 🚀 System Status

✅ **Backend**: Running on `http://localhost:5000`  
✅ **Frontend**: Running on `http://localhost:3000`  
✅ **Database**: JSON files in `backend/data/`  

---

## 📋 What's Implemented

### Core Features
- ✅ **User Registration** - New accounts with email verification
- ✅ **Email Verification** - 6-digit code sent to email (logged in console)
- ✅ **User Login** - Secure authentication with JWT tokens
- ✅ **Password Reset** - Email-based password recovery
- ✅ **Security** - bcrypt hashing, JWT tokens, code expiration

### UI Components
- **Register Button** - Opens registration modal (top-right navigation)
- **Login Button** - Opens login modal (top-right navigation)
- **Forgot Password Link** - In login modal for password recovery

---

## 🎯 Quick Test (5 Minutes)

### Step 1: Register (1 min)
```
1. Click "Register" button
2. Fill in:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
3. Click Register
```

### Step 2: Check Email Code (1 min)
```
1. Look at BACKEND TERMINAL
2. Find: "Your verification code is: XXXXXX"
3. Copy that 6-digit code
```

### Step 3: Verify Email (1 min)
```
1. Open new tab: http://localhost:3000/?code=XXXXXX&email=test@example.com
2. (Replace XXXXXX with code from step 2)
3. See "Verification Successful!"
```

### Step 4: Login (1 min)
```
1. Click "Login" button
2. Enter:
   - Username: testuser
   - Password: password123
3. Click Login
4. See success message!
```

### Step 5: Check Token (1 min)
```
1. Open DevTools: F12
2. Go to: Application → Local Storage
3. See token stored (you're authenticated!)
```

---

## 📧 Email Codes in Development

In **development mode**, all emails are **logged to the backend terminal** (not sent). You'll see:

```
📧 Email would be sent to: test@example.com
Subject: Verify Your Email - Marketplace
HTML: <h2>Welcome to Marketplace!</h2>...
Your verification code is: 123456
```

**The 6-digit code is what you need!**

---

## 🔐 Testing Password Reset

### Step 1: Request Reset
```
1. Click Login → Forgot Password?
2. Enter email: test@example.com
3. Click "Send Reset Code"
4. Check BACKEND TERMINAL for code
```

### Step 2: Reset Password
```
1. Enter code from backend terminal
2. Enter new password: newpassword456
3. Click "Reset Password"
4. See success message
```

### Step 3: Login with New Password
```
1. Username: testuser
2. Password: newpassword456
3. Click Login
4. Success! (authenticated with new password)
```

---

## 📂 Key Files

### Frontend
| File | Purpose |
|------|---------|
| `components/RegistrationForm.tsx` | Registration modal |
| `components/LoginForm.tsx` | Login & password reset modal |
| `components/EmailVerification.tsx` | Email verification page |
| `components/Layout.tsx` | Navigation with auth buttons |

### Backend
| File | Purpose |
|------|---------|
| `backend/routes/auth.js` | Authentication API endpoints |
| `backend/services/emailService.js` | Email sending service |
| `backend/data/users.json` | User database |
| `backend/data/tokens.json` | Reset codes storage |

### Documentation
| File | Purpose |
|------|---------|
| `AUTH_SYSTEM_DOCS.md` | Complete API documentation |
| `AUTH_TESTING_GUIDE.md` | Detailed testing guide |
| `AUTHENTICATION_COMPLETE.md` | Full implementation overview |

---

## 🔌 API Endpoints

### Register
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Verify Email
```bash
POST http://localhost:5000/api/auth/verify-email
Content-Type: application/json

{
  "email": "test@example.com",
  "code": "123456"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### Forgot Password
```bash
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### Reset Password
```bash
POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "email": "test@example.com",
  "code": "123456",
  "newPassword": "newpassword456"
}
```

### Get Profile (requires token)
```bash
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <TOKEN_FROM_LOGIN>
```

---

## 💾 Database Formats

### User Object (users.json)
```json
{
  "id": "1707084933000",
  "username": "testuser",
  "email": "test@example.com",
  "password": "$2a$10$...", // bcrypt hashed
  "verified": true,
  "verificationCode": null,
  "verificationExpiresAt": null,
  "createdAt": "2026-02-04T17:02:13.000Z"
}
```

### Token Object (tokens.json)
```json
{
  "test@example.com": {
    "code": "123456",
    "expiresAt": 1707088633000,
    "attempts": 0
  }
}
```

---

## ⚙️ Configuration

### Environment File (Optional)
Create `backend/.env`:
```
# Email (for production)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT
JWT_SECRET=your-secret-key

# Mode
NODE_ENV=development
```

**Note**: Currently uses development mode with console logging.

---

## 🔒 Security Details

| Feature | Implementation |
|---------|-----------------|
| Password Hashing | bcryptjs (10 salt rounds) |
| Authentication | JWT tokens (7-day expiration) |
| Email Verification | Required before login |
| Verification Code | 6-digit code, 24-hour expiration |
| Reset Code | 6-digit code, 1-hour expiration |
| Brute Force | 5-attempt limit on reset |
| CORS | Enabled for localhost:3000 |

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| No email showing | Check BACKEND terminal (emails logged there in dev) |
| "Email already registered" | Delete `backend/data/users.json` to reset database |
| "Email not verified" | Complete verification with code from backend terminal |
| "Invalid credentials" | Check username and password are correct |
| Port 5000 in use | Kill process: `netstat -ano \| find ":5000"` (Windows) |
| Token not in localStorage | Check DevTools → Application → Local Storage |

---

## 📊 Current State

### Terminals Running
- **Terminal 1**: Backend server (`node server.js`) - Port 5000
- **Terminal 2**: Frontend dev server (`npm run dev`) - Port 3000

### Browser Tabs Open
- http://localhost:3000 - Main marketplace
- Browser DevTools (F12) - For debugging

### Available Actions
- Click "Register" to create new account
- Click "Login" to authenticate
- Click "Forgot Password?" to reset
- View verification codes in backend terminal
- Check tokens in browser localStorage

---

## 📚 Full Documentation

For more details, see:
- **[AUTH_SYSTEM_DOCS.md](AUTH_SYSTEM_DOCS.md)** - Complete API reference
- **[AUTH_TESTING_GUIDE.md](AUTH_TESTING_GUIDE.md)** - Step-by-step testing

---

## ✅ Implementation Checklist

- ✅ Registration form with validation
- ✅ Email verification system
- ✅ Login with JWT tokens
- ✅ Password reset workflow
- ✅ Backend API endpoints
- ✅ Database storage (JSON)
- ✅ Security best practices
- ✅ Email service (development/production ready)
- ✅ Error handling
- ✅ Frontend styling
- ✅ Documentation
- ✅ Both servers running

---

## 🎉 You're Ready!

The authentication system is **fully functional** and ready to use. 

**Next steps**:
1. Test registration/login using the quick test above
2. Review full documentation if needed
3. Customize styling or add features as needed
4. Deploy to production when ready

**Questions?** Check the documentation files or review the source code in:
- `components/` - Frontend components
- `backend/routes/auth.js` - Backend implementation
- `backend/services/emailService.js` - Email service
