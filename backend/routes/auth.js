import express from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { sendEmail, generateToken } from '../services/emailService.js';
import { userService } from '../services/databaseService.js';
import settingsService from '../services/settingsService.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TOKENS_FILE = path.join(DATA_DIR, 'tokens.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

// Default admin credentials (CHANGE THESE IN PRODUCTION)
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin@123', // Default password - CHANGE THIS!
};

// Default test user credentials
const DEFAULT_USER = {
  username: 'testuser',
  email: 'test@moranik.com',
  password: 'test123',
  fullName: 'Test User'
};

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(TOKENS_FILE)) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify({}));
}

// Initialize admin credentials file if it doesn't exist
if (!fs.existsSync(ADMIN_FILE)) {
  const hashedPassword = bcrypt.hashSync(DEFAULT_ADMIN.password, 10);
  const adminData = {
    username: DEFAULT_ADMIN.username,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2));
  console.log('✅ Admin account created with default credentials');
  console.log('   Username:', DEFAULT_ADMIN.username);
  console.log('   Password:', DEFAULT_ADMIN.password);
  console.log('   ⚠️  CHANGE THESE IN PRODUCTION!');
}

// Initialize default test user if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Create default test user if no users exist
const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
if (users.length === 0) {
  const hashedPassword = bcrypt.hashSync(DEFAULT_USER.password, 10);
  const testUser = {
    id: Date.now().toString(),
    username: DEFAULT_USER.username,
    email: DEFAULT_USER.email,
    password: hashedPassword,
    fullName: DEFAULT_USER.fullName,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  users.push(testUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log('✅ Default test user created');
  console.log('   Username:', DEFAULT_USER.username);
  console.log('   Password:', DEFAULT_USER.password);
  console.log('   Email:', DEFAULT_USER.email);
}

// Helper functions
const getUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
};

const getTokens = () => {
  try {
    return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'));
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const saveTokens = (tokens) => {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    // Check if user registration is enabled
    if (!settingsService.isUserRegistrationEnabled()) {
      return res.status(403).json({ error: 'User registration is currently disabled' });
    }

    let username, email, password, fullName;
    try {
      ({ username, email, password, fullName } = req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    // Basic validation (password requirements disabled for now)
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUserByUsername = userService.getByUsername(username);
    const existingUserByEmail = userService.getByEmail(email);

    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user using database service
    const newUser = await userService.create({
      username,
      email,
      fullName,
      password,
      isEmailVerified: !settingsService.isEmailVerificationEnabled() // Auto-verify if email verification is disabled
    });

    if (newUser) {
      res.status(201).json({
        success: true,
        message: settingsService.isEmailVerificationEnabled() 
          ? 'Registration successful! Please check your email for verification.'
          : 'Registration successful!',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName
        }
      });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify email endpoint
router.post('/verify-email', async (req, res) => {
  try {
    let email, code;
    try {
      ({ email, code } = req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.verified) {
      return res.json({ success: true, message: 'Email already verified' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (Date.now() > user.verificationExpiresAt) {
      return res.status(400).json({ error: 'Verification code expired' });
    }

    // Mark user as verified
    user.verified = true;
    user.verificationCode = null;
    user.verificationExpiresAt = null;

    saveUsers(users);

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    let username, password;
    try {
      ({ username, password } = req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Use database service to find user
    const user = userService.getByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified (only if email verification is enabled)
    if (settingsService.isEmailVerificationEnabled()) {
      const isVerified = user.isEmailVerified !== undefined ? user.isEmailVerified : (user.verified !== undefined ? user.verified : false);
      
      if (!isVerified) {
        return res.status(403).json({ error: 'Please verify your email before logging in' });
      }
    }

    // Check password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    userService.update(user.id, { lastLogin: new Date().toISOString() });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName || user.username
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Forgot password endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    let email;
    try {
      ({ email } = req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      // Don't reveal if email exists (security)
      return res.json({ success: true, message: 'If email exists, reset code will be sent' });
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    const tokens = getTokens();
    tokens[email] = {
      code: resetCode,
      expiresAt,
      attempts: 0,
    };

    saveTokens(tokens);

    // Send reset email
    await sendEmail(
      email,
      'Password Reset Code - Marketplace',
      `
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password.</p>
        <p>Your password reset code is: <strong>${resetCode}</strong></p>
        <p>This code expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    );

    res.json({ success: true, message: 'Reset code sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    let email, code, newPassword;
    try {
      ({ email, code, newPassword } = req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const tokens = getTokens();
    const resetToken = tokens[email];

    if (!resetToken) {
      return res.status(400).json({ error: 'No reset request found for this email' });
    }

    if (resetToken.code !== code) {
      resetToken.attempts = (resetToken.attempts || 0) + 1;
      if (resetToken.attempts > 5) {
        delete tokens[email];
      }
      saveTokens(tokens);
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    if (Date.now() > resetToken.expiresAt) {
      delete tokens[email];
      saveTokens(tokens);
      return res.status(400).json({ error: 'Reset code expired' });
    }

    // Update password
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    saveUsers(users);

    // Delete used token
    delete tokens[email];
    saveTokens(tokens);

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// Get user profile (protected)
router.get('/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const users = getUsers();
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      verified: user.verified,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Admin login endpoint
router.post('/admin-login', async (req, res) => {
  try {
    let username, password;
    try {
      ({ username, password } = req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'Admin username and password are required' });
    }

    // Read admin credentials from file
    let adminData;
    try {
      adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8'));
    } catch {
      return res.status(500).json({ error: 'Admin configuration error' });
    }

    // Check if username matches
    if (adminData.username !== username) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Check if password matches (using bcrypt)
    const isPasswordValid = await bcrypt.compare(password, adminData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Generate admin JWT token
    const token = jwt.sign(
      { type: 'admin', username: adminData.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' } // Admin tokens expire in 24 hours
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        username: adminData.username,
        type: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Change admin password endpoint (requires admin token)
router.post('/admin-change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    let currentPassword, newPassword;
    try {
      ({ currentPassword, newPassword } = req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    if (!token) {
      return res.status(401).json({ error: 'No admin token provided' });
    }

    // Verify it's an admin token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return res.status(401).json({ error: 'Invalid admin token' });
    }

    if (decoded.type !== 'admin') {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    // Read admin credentials
    let adminData;
    try {
      adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8'));
    } catch {
      return res.status(500).json({ error: 'Admin configuration error' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, adminData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash and update new password
    adminData.password = await bcrypt.hash(newPassword, 10);
    adminData.lastPasswordChange = new Date().toISOString();

    fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2));

    res.json({
      success: true,
      message: 'Admin password changed successfully',
    });
  } catch (error) {
    console.error('Admin password change error:', error);
    res.status(500).json({ error: 'Password change failed' });
  }
});

export default router;
