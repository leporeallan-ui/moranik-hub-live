import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import databaseAuth from '../middleware/auth.js'; // Disabled

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const TOKENS_FILE = path.join(DATA_DIR, 'tokens.json');

// Helper functions
const getUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
};

const getAdmin = () => {
  try {
    return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8'));
  } catch {
    return null;
  }
};

const getTokens = () => {
  try {
    return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'));
  } catch {
    return {};
  }
};

// Database Manager - View all data (public - authentication disabled)
router.get('/manager', (req, res) => {
  try {
    const users = getUsers();
    const admin = getAdmin();
    const tokens = getTokens();
    
    const databaseInfo = {
      timestamp: new Date().toISOString(),
      statistics: {
        totalUsers: users.length,
        totalTokens: Object.keys(tokens).length,
        adminExists: !!admin
      },
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        passwordHash: user.password ? '***HASHED***' : 'N/A'
      })),
      admin: admin ? {
        username: admin.username,
        createdAt: admin.createdAt,
        passwordHash: '***HASHED***'
      } : null,
      activeTokens: Object.entries(tokens).map(([token, data]) => ({
        token: token.substring(0, 20) + '...',
        username: data.username,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt
      }))
    };
    
    res.json({
      success: true,
      data: databaseInfo
    });
  } catch (error) {
    console.error('Database manager error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve database information'
    });
  }
});

// Clear all tokens (public - authentication disabled)
router.delete('/tokens/clear', (req, res) => {
  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify({}));
    res.json({
      success: true,
      message: 'All tokens cleared successfully'
    });
  } catch (error) {
    console.error('Clear tokens error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear tokens'
    });
  }
});

// Reset database (public - authentication disabled)
router.delete('/reset', (req, res) => {
  try {
    // Backup current data
    const backup = {
      timestamp: new Date().toISOString(),
      users: getUsers(),
      admin: getAdmin(),
      tokens: getTokens()
    };
    
    const backupFile = path.join(DATA_DIR, `backup_${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    // Reset to empty state
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    fs.writeFileSync(TOKENS_FILE, JSON.stringify({}));
    
    res.json({
      success: true,
      message: 'Database reset successfully',
      backupFile: backupFile
    });
  } catch (error) {
    console.error('Reset database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset database'
    });
  }
});

export default router;
