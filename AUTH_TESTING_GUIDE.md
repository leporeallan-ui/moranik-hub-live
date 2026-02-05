# Quick Authentication Testing Guide

## Starting the System

### 1. Start Backend Server
```bash
cd backend
node server.js
```
Expected output:
```
Server running on http://localhost:5000
Frontend accessible at http://localhost:3000
```

### 2. Start Frontend Server (in another terminal)
```bash
npm run dev
```
Expected output:
```
VITE v6.4.1  ready in XXX ms
➜  Local:   http://localhost:3000/
```

### 3. Open Browser
Navigate to: `http://localhost:3000`

---

## Test Case 1: User Registration

### Steps:
1. Click the **"Register"** button in the top-right navigation
2. Fill in the form:
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **"Register"** button

### Expected Results:
✅ Modal shows "Registration successful! Check your email to verify your account."
✅ In backend terminal, you'll see email output:
```
📧 Email would be sent to: test@example.com
Subject: Verify Your Email - Marketplace
```

### What to Note:
- The verification code is logged in the backend terminal (6 digits)
- Example code: `123456`

---

## Test Case 2: Email Verification

### Steps:
1. Look at the backend terminal for the verification code
2. Copy the code (shown in the email log)
3. Try to login immediately (before verifying)
4. Enter username and password you just registered
5. Click **"Login"**

### Expected Result:
❌ Error: "Please verify your email before logging in"

### Now Verify Email:
1. Click **"Register"** again to close login modal
2. Open a new browser tab
3. Navigate to: `http://localhost:3000/?code=<CODE_FROM_EMAIL>&email=test@example.com`
   - Replace `<CODE_FROM_EMAIL>` with the code from the backend terminal
   - Example: `http://localhost:3000/?code=123456&email=test@example.com`

### Expected Result:
✅ Page shows "Verification Successful!"
✅ Automatically redirects to home page after 3 seconds

---

## Test Case 3: Login After Verification

### Steps:
1. Click **"Login"** button
2. Enter credentials:
   - Username: `testuser123`
   - Password: `password123`
3. Click **"Login"**

### Expected Result:
✅ Message: "Login successful!"
✅ Modal closes and page reloads
✅ Token is stored in browser's localStorage

---

## Test Case 4: Forgot Password

### Steps:
1. Click **"Login"** button
2. Click **"Forgot Password?"** link at bottom
3. Forgot Password form appears
4. Enter email: `test@example.com`
5. Click **"Send Reset Code"**

### Expected Result:
✅ Success message: "Reset code sent to your email! Check your inbox."
✅ In backend terminal, you see:
```
📧 Email would be sent to: test@example.com
Subject: Password Reset Code - Marketplace
```

### Note:
- The reset code is logged in backend (6 digits)
- Reset codes expire in 1 hour
- Only 5 incorrect attempts allowed

---

## Test Case 5: Password Reset

### Steps:
1. From the Forgot Password form, enter:
   - Email: `test@example.com`
   - Reset Code: `<CODE_FROM_EMAIL>` (from the email in backend terminal)
   - New Password: `newpassword456`
   - Confirm Password: `newpassword456`
2. Click **"Reset Password"**

### Expected Result:
✅ Success message: "Password reset successful! You can now login."
✅ Form returns to login form
✅ Email and reset code fields are cleared

### Test New Password:
1. Enter username: `testuser123`
2. Enter new password: `newpassword456`
3. Click **"Login"**

### Expected Result:
✅ Login successful with new password
✅ Token stored in localStorage

---

## Test Case 6: Error Handling

### Test: Wrong Password
1. Click **"Login"**
2. Enter `testuser123` and `wrongpassword`
3. Click **"Login"**

**Expected**: ❌ "Invalid credentials" error

### Test: Invalid Code
1. Click **"Login"** → **"Forgot Password?"**
2. Enter email: `test@example.com`
3. Click **"Send Reset Code"**
4. Enter wrong code: `000000`
5. Click **"Reset Password"**

**Expected**: ❌ "Invalid reset code" error

### Test: Expired Code
1. Wait for code to expire (manually edit the token JSON or use backend)
2. Try to reset password with expired code

**Expected**: ❌ "Reset code expired" error

### Test: Duplicate Username
1. Click **"Register"**
2. Try to register with username: `testuser123` (already exists)
3. Enter different email: `test2@example.com`
4. Complete registration

**Expected**: ❌ "Username already exists" error

---

## Checking Browser Storage

### View Stored Token:
1. Open browser DevTools: **F12**
2. Go to **Application** tab
3. Click **Local Storage** → **http://localhost:3000**
4. Look for key: `token` (contains the JWT)

### JWT Token Format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3MDcwODQ5MzMwMDAiLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzA3MDg0OTMzLCJleHAiOjE3MDc2ODk3MzN9.ABC123...
```

---

## Backend Console Logs

### Expected Emails Logged:

**Registration Email**:
```
📧 Email would be sent to: test@example.com
Subject: Verify Your Email - Marketplace
HTML: <h2>Welcome to Marketplace!</h2>
Please verify your email address to activate your account.
Your verification code is: 123456
```

**Password Reset Email**:
```
📧 Email would be sent to: test@example.com
Subject: Password Reset Code - Marketplace
HTML: <h2>Password Reset Request</h2>
We received a request to reset your password.
Your password reset code is: 654321
```

---

## Database Files

### Check Registered Users:
**File**: `backend/data/users.json`

```json
[
  {
    "id": "1707084933000",
    "username": "testuser123",
    "email": "test@example.com",
    "password": "$2a$10$...", // bcrypt hashed
    "verified": true,
    "verificationCode": null,
    "verificationExpiresAt": null,
    "createdAt": "2026-02-04T17:02:13.000Z"
  }
]
```

### Check Reset Tokens:
**File**: `backend/data/tokens.json`

```json
{
  "test@example.com": {
    "code": "654321",
    "expiresAt": 1707088633000,
    "attempts": 0
  }
}
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Email would be sent to" in console | This is NORMAL in development mode. Emails are logged to console. |
| Can't find verification code | Check the backend terminal output - it's logged when registration succeeds. |
| "Please verify your email" | You need to verify with the code first using the URL. |
| Token not in localStorage | Check DevTools → Application → Local Storage. Token appears only after successful login. |
| Backend not responding | Make sure backend server is running: `node server.js` in backend directory. |
| Port 5000 already in use | Kill the process: `lsof -ti:5000 \| xargs kill -9` (Linux/Mac) or use Task Manager (Windows). |

---

## Production Notes

In production with real email setup:
1. Emails will actually be sent via SMTP
2. Email addresses must be valid
3. Remove or disable console logging
4. Set `NODE_ENV=production` in `.env`
5. Configure real email provider credentials in `.env`:
   ```
   EMAIL_USER=noreply@yourmarketplace.com
   EMAIL_PASSWORD=your-smtp-password
   JWT_SECRET=your-very-secure-secret
   ```

---

## API Testing with curl

### Register User:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Verify Email:
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Get Profile (requires token):
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

### Forgot Password:
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Reset Password:
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456","newPassword":"newpass456"}'
```
