# Authentication System Documentation

## Overview

The marketplace now includes a complete authentication system with the following features:

### Features Implemented

✅ **User Registration**
- Email verification required
- Password hashing with bcryptjs
- Duplicate username/email prevention
- Verification code sent to email (6-digit code)

✅ **Email Verification**
- 6-digit verification code sent to email
- Verification link generation
- 24-hour expiration timer
- Manual code entry option

✅ **User Login**
- Username and password authentication
- Email verification requirement before login
- JWT token generation (7-day expiration)
- Secure password comparison with bcrypt

✅ **Forgot Password**
- Email-based password reset
- 6-digit reset code sent to email
- 1-hour expiration timer
- Brute-force protection (5 attempt limit)

✅ **Password Reset**
- Secure password update with code verification
- Code validation and expiration checks
- Password hashing before storage

## Frontend Components

### RegistrationForm.tsx
**Location**: `components/RegistrationForm.tsx`

The registration modal provides:
- Username input field
- Email input field  
- Password input field with validation (minimum 6 characters)
- Password confirmation field
- Email format validation
- Real-time error messages
- Success message with verification notification
- Modal overlay with smooth animations

**Usage**:
```tsx
<RegistrationForm onClose={() => setShowRegister(false)} />
```

### LoginForm.tsx
**Location**: `components/LoginForm.tsx`

The login modal provides:
- Username input field
- Password input field
- "Forgot Password?" link to initiate reset
- Forgot password form with email input
- Password reset form with:
  - Email field
  - Reset code input
  - New password field
  - Password confirmation field
- Token storage on successful login
- Page reload after successful authentication

**Usage**:
```tsx
<LoginForm onClose={() => setShowLogin(false)} />
```

### EmailVerification.tsx
**Location**: `components/EmailVerification.tsx`

Email verification page that:
- Automatically verifies email from URL parameters
- Displays loading state during verification
- Shows success message with countdown redirect
- Shows error message with link back to home
- Can be accessed via email verification link

**URL Format**:
```
http://localhost:3000/?code=123456&email=user@example.com
```

## Backend Routes

### Base URL
```
http://localhost:5000/api/auth
```

### POST /register
**Purpose**: Register a new user account

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "userId": "1707084933000"
}
```

**Error Responses**:
- `400`: Missing fields, username exists, or email already registered
- `500`: Server error

### POST /verify-email
**Purpose**: Verify email with code from email

**Request Body**:
```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error Responses**:
- `400`: Invalid code, expired code, or missing parameters
- `404`: User not found

### POST /login
**Purpose**: Authenticate user and get JWT token

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1707084933000",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Responses**:
- `401`: Invalid credentials
- `403`: Email not verified
- `500`: Server error

### POST /forgot-password
**Purpose**: Request password reset code

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Reset code sent to your email"
}
```

**Notes**: Always returns 200 for security (doesn't reveal if email exists)

### POST /reset-password
**Purpose**: Reset password with verification code

**Request Body**:
```json
{
  "email": "john@example.com",
  "code": "123456",
  "newPassword": "newSecurePassword456"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses**:
- `400`: Invalid code, expired code, or missing parameters
- `404`: User not found

### GET /profile
**Purpose**: Get authenticated user profile

**Headers Required**:
```
Authorization: Bearer <token>
```

**Success Response (200)**:
```json
{
  "id": "1707084933000",
  "username": "john_doe",
  "email": "john@example.com",
  "verified": true,
  "createdAt": "2026-02-04T17:02:13.000Z"
}
```

**Error Responses**:
- `401`: No token or invalid token

## Data Storage

### Users Database
**File**: `backend/data/users.json`

User object structure:
```json
{
  "id": "1707084933000",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$10$...", // bcrypt hashed
  "verified": true,
  "verificationCode": null,
  "verificationExpiresAt": null,
  "createdAt": "2026-02-04T17:02:13.000Z"
}
```

### Reset Tokens Database
**File**: `backend/data/tokens.json`

Reset token structure:
```json
{
  "john@example.com": {
    "code": "123456",
    "expiresAt": 1707088633000,
    "attempts": 0
  }
}
```

## Email Service

### Configuration
**File**: `backend/services/emailService.js`

**Current Mode**: Development (Mock emails logged to console)

In development mode, emails are logged to the console instead of being sent. This allows testing without actual email credentials.

**Console Output Example**:
```
📧 Email would be sent to: john@example.com
Subject: Verify Your Email - Marketplace
HTML: <h2>Welcome to Marketplace!</h2>...
```

### Production Setup

For production, configure nodemailer with Gmail or other SMTP provider:

1. Create `.env` file in backend directory:
```
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
JWT_SECRET=your-secret-key
```

2. For Gmail:
   - Enable 2-factor authentication
   - Generate app-specific password
   - Use app password in EMAIL_PASSWORD

## User Flow Diagram

### Registration Flow
```
1. User clicks "Register" button
   ↓
2. Registration modal opens
   ↓
3. User fills form (username, email, password)
   ↓
4. POST /api/auth/register
   ↓
5. Backend creates user with hashed password
   ↓
6. Verification email sent with code
   ↓
7. User checks email and clicks link
   ↓
8. Email verification code validates
   ↓
9. User can now login
```

### Login Flow
```
1. User clicks "Login" button
   ↓
2. Login modal opens
   ↓
3. User enters username and password
   ↓
4. POST /api/auth/login
   ↓
5. Backend verifies credentials and email
   ↓
6. JWT token generated (7 days valid)
   ↓
7. Token stored in localStorage
   ↓
8. Page reloads (authenticated)
```

### Password Reset Flow
```
1. User clicks "Forgot Password?" in login
   ↓
2. Forgot password form displays
   ↓
3. User enters email
   ↓
4. POST /api/auth/forgot-password
   ↓
5. Reset code (6 digits) sent to email
   ↓
6. User enters code from email
   ↓
7. New password fields appear
   ↓
8. User sets new password
   ↓
9. POST /api/auth/reset-password
   ↓
10. Password updated in database
    ↓
11. User can login with new password
```

## Security Features

✅ **Password Hashing**: bcryptjs with salt rounds of 10
✅ **JWT Tokens**: 7-day expiration for login sessions
✅ **Email Verification**: Required before login access
✅ **Code Expiration**: 
   - Registration: 24 hours
   - Password reset: 1 hour
✅ **Brute Force Protection**: 5 attempt limit on password reset
✅ **Email Anonymity**: Forgot password doesn't reveal if email exists
✅ **Secure Comparison**: bcrypt compare for password verification

## Testing Checklist

### Registration
- [ ] Register with valid credentials
- [ ] Check email console for verification code
- [ ] Verify email with code
- [ ] Try duplicate username (should fail)
- [ ] Try duplicate email (should fail)
- [ ] Try short password < 6 chars (should fail)

### Login
- [ ] Login with unverified email (should fail)
- [ ] Login with correct credentials (should succeed)
- [ ] Login with wrong password (should fail)
- [ ] Check localStorage for token

### Password Reset
- [ ] Click "Forgot Password?" in login
- [ ] Enter email address
- [ ] Check email console for reset code
- [ ] Enter reset code
- [ ] Set new password
- [ ] Login with new password

## File Structure

```
backend/
├── routes/
│   ├── uploads.js (existing)
│   └── auth.js (NEW)
├── services/
│   └── emailService.js (NEW)
├── data/
│   ├── products.json (existing)
│   ├── users.json (NEW)
│   └── tokens.json (NEW)
├── server.js (updated)
├── package.json (updated)
└── node_modules/

components/
├── RegistrationForm.tsx (NEW)
├── RegistrationForm.css (NEW)
├── LoginForm.tsx (NEW)
├── LoginForm.css (NEW)
├── EmailVerification.tsx (NEW)
├── EmailVerification.css (NEW)
├── Layout.tsx (updated)
└── ...existing components
```

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Email Configuration (for production)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT Configuration
JWT_SECRET=your-secure-secret-key

# Node Environment
NODE_ENV=development
```

## Troubleshooting

### Emails not showing in development
**Solution**: Check the backend console terminal - emails are logged there in development mode.

### "Email already registered" error on valid email
**Solution**: Check `backend/data/users.json` - the email might already exist. Delete the users.json file to reset the database.

### JWT token issues
**Solution**: Clear localStorage and login again. Token expires after 7 days.

### "Email not verified" on login
**Solution**: Complete the email verification process first by clicking the link in the verification email (or using the code from the console).

## Next Steps for Production

1. Set up real email service (Gmail, SendGrid, etc.)
2. Add HTTPS/SSL certificate
3. Configure proper JWT secret in environment variables
4. Set up MongoDB or PostgreSQL instead of JSON files
5. Add rate limiting middleware
6. Add CSRF protection
7. Implement email confirmation resend feature
8. Add user profile management page
9. Implement refresh token mechanism
10. Add role-based access control (Admin, Seller, Buyer)
