import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

// Database files
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SOFTWARE_FILE = path.join(DATA_DIR, 'software.json');
const MUSIC_FILE = path.join(DATA_DIR, 'music.json');
const NOVELS_FILE = path.join(DATA_DIR, 'novels.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database files if they don't exist
const initializeDatabase = () => {
  const files = [
    { file: USERS_FILE, defaultContent: [] },
    { file: SOFTWARE_FILE, defaultContent: [] },
    { file: MUSIC_FILE, defaultContent: [] },
    { file: NOVELS_FILE, defaultContent: [] },
    { file: ORDERS_FILE, defaultContent: [] },
    { file: ANALYTICS_FILE, defaultContent: { views: 0, users: 0, products: 0, lastUpdated: new Date().toISOString() } }
  ];

  files.forEach(({ file, defaultContent }) => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultContent, null, 2));
      console.log(`✅ Initialized database file: ${path.basename(file)}`);
    }
  });
};

// Helper functions
const readDatabase = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeDatabase = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// User operations
export const userService = {
  getAll: () => readDatabase(USERS_FILE),
  
  getById: (id) => {
    const users = readDatabase(USERS_FILE);
    return users.find(user => user.id === id);
  },
  
  getByUsername: (username) => {
    const users = readDatabase(USERS_FILE);
    return users.find(user => user.username === username);
  },
  
  getByEmail: (email) => {
    const users = readDatabase(USERS_FILE);
    return users.find(user => user.email === email);
  },
  
  create: async (userData) => {
    const users = readDatabase(USERS_FILE);
    
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      password: hashedPassword, // Store hashed password
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    return writeDatabase(USERS_FILE, users) ? newUser : null;
  },
  
  update: (id, updates) => {
    const users = readDatabase(USERS_FILE);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      return writeDatabase(USERS_FILE, users);
    }
    return false;
  },
  
  delete: (id) => {
    const users = readDatabase(USERS_FILE);
    const filteredUsers = users.filter(user => user.id !== id);
    return writeDatabase(USERS_FILE, filteredUsers);
  }
};

// Software operations
export const softwareService = {
  getAll: () => readDatabase(SOFTWARE_FILE),
  
  getById: (id) => {
    const software = readDatabase(SOFTWARE_FILE);
    return software.find(item => item.id === id);
  },
  
  getByUserId: (userId) => {
    const software = readDatabase(SOFTWARE_FILE);
    return software.filter(item => item.uploadedBy === userId);
  },
  
  create: (softwareData) => {
    const software = readDatabase(SOFTWARE_FILE);
    const newSoftware = {
      id: Date.now().toString(),
      ...softwareData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloads: 0,
      rating: 0
    };
    software.push(newSoftware);
    return writeDatabase(SOFTWARE_FILE, software) ? newSoftware : null;
  },
  
  update: (id, updates) => {
    const software = readDatabase(SOFTWARE_FILE);
    const index = software.findIndex(item => item.id === id);
    if (index !== -1) {
      software[index] = { ...software[index], ...updates, updatedAt: new Date().toISOString() };
      return writeDatabase(SOFTWARE_FILE, software);
    }
    return false;
  },
  
  delete: (id) => {
    const software = readDatabase(SOFTWARE_FILE);
    const filteredSoftware = software.filter(item => item.id !== id);
    return writeDatabase(SOFTWARE_FILE, filteredSoftware);
  },
  
  incrementDownloads: (id) => {
    const software = readDatabase(SOFTWARE_FILE);
    const index = software.findIndex(item => item.id === id);
    if (index !== -1) {
      software[index].downloads = (software[index].downloads || 0) + 1;
      return writeDatabase(SOFTWARE_FILE, software);
    }
    return false;
  }
};

// Music operations
export const musicService = {
  getAll: () => readDatabase(MUSIC_FILE),
  
  getById: (id) => {
    const music = readDatabase(MUSIC_FILE);
    return music.find(item => item.id === id);
  },
  
  getByUserId: (userId) => {
    const music = readDatabase(MUSIC_FILE);
    return music.filter(item => item.uploadedBy === userId);
  },
  
  create: (musicData) => {
    const music = readDatabase(MUSIC_FILE);
    const newMusic = {
      id: Date.now().toString(),
      ...musicData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plays: 0,
      likes: 0
    };
    music.push(newMusic);
    return writeDatabase(MUSIC_FILE, music) ? newMusic : null;
  },
  
  update: (id, updates) => {
    const music = readDatabase(MUSIC_FILE);
    const index = music.findIndex(item => item.id === id);
    if (index !== -1) {
      music[index] = { ...music[index], ...updates, updatedAt: new Date().toISOString() };
      return writeDatabase(MUSIC_FILE, music);
    }
    return false;
  },
  
  delete: (id) => {
    const music = readDatabase(MUSIC_FILE);
    const filteredMusic = music.filter(item => item.id !== id);
    return writeDatabase(MUSIC_FILE, filteredMusic);
  },
  
  incrementPlays: (id) => {
    const music = readDatabase(MUSIC_FILE);
    const index = music.findIndex(item => item.id === id);
    if (index !== -1) {
      music[index].plays = (music[index].plays || 0) + 1;
      return writeDatabase(MUSIC_FILE, music);
    }
    return false;
  }
};

// Novels operations
export const novelsService = {
  getAll: () => readDatabase(NOVELS_FILE),
  
  getById: (id) => {
    const novels = readDatabase(NOVELS_FILE);
    return novels.find(item => item.id === id);
  },
  
  getByUserId: (userId) => {
    const novels = readDatabase(NOVELS_FILE);
    return novels.filter(item => item.uploadedBy === userId);
  },
  
  create: (novelData) => {
    const novels = readDatabase(NOVELS_FILE);
    const newNovel = {
      id: Date.now().toString(),
      ...novelData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloads: 0,
      rating: 0
    };
    novels.push(newNovel);
    return writeDatabase(NOVELS_FILE, novels) ? newNovel : null;
  },
  
  update: (id, updates) => {
    const novels = readDatabase(NOVELS_FILE);
    const index = novels.findIndex(item => item.id === id);
    if (index !== -1) {
      novels[index] = { ...novels[index], ...updates, updatedAt: new Date().toISOString() };
      return writeDatabase(NOVELS_FILE, novels);
    }
    return false;
  },
  
  delete: (id) => {
    const novels = readDatabase(NOVELS_FILE);
    const filteredNovels = novels.filter(item => item.id !== id);
    return writeDatabase(NOVELS_FILE, filteredNovels);
  }
};

// Analytics operations
export const analyticsService = {
  getStats: () => {
    const analytics = readDatabase(ANALYTICS_FILE);
    const users = readDatabase(USERS_FILE);
    const software = readDatabase(SOFTWARE_FILE);
    const music = readDatabase(MUSIC_FILE);
    const novels = readDatabase(NOVELS_FILE);
    
    return {
      ...analytics,
      users: users.length,
      products: software.length + music.length + novels.length,
      lastUpdated: new Date().toISOString()
    };
  },
  
  updateStats: (updates) => {
    const analytics = readDatabase(ANALYTICS_FILE);
    const updatedAnalytics = { ...analytics, ...updates, lastUpdated: new Date().toISOString() };
    return writeDatabase(ANALYTICS_FILE, updatedAnalytics);
  },
  
  incrementViews: () => {
    const analytics = readDatabase(ANALYTICS_FILE);
    analytics.views = (analytics.views || 0) + 1;
    return writeDatabase(ANALYTICS_FILE, analytics);
  }
};

// Initialize database on service load
initializeDatabase();

// Database backup and restore
export const databaseUtils = {
  backup: () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(DATA_DIR, 'backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupFile = path.join(backupDir, `backup_${timestamp}.json`);
    const backupData = {
      timestamp,
      users: readDatabase(USERS_FILE),
      software: readDatabase(SOFTWARE_FILE),
      music: readDatabase(MUSIC_FILE),
      novels: readDatabase(NOVELS_FILE),
      orders: readDatabase(ORDERS_FILE),
      analytics: readDatabase(ANALYTICS_FILE)
    };
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    return backupFile;
  },
  
  restore: (backupFile) => {
    try {
      const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
      
      writeDatabase(USERS_FILE, backupData.users || []);
      writeDatabase(SOFTWARE_FILE, backupData.software || []);
      writeDatabase(MUSIC_FILE, backupData.music || []);
      writeDatabase(NOVELS_FILE, backupData.novels || []);
      writeDatabase(ORDERS_FILE, backupData.orders || []);
      writeDatabase(ANALYTICS_FILE, backupData.analytics || { views: 0, users: 0, products: 0 });
      
      return true;
    } catch (error) {
      console.error('Restore error:', error);
      return false;
    }
  }
};
