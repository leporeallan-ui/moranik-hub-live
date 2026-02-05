import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Default settings
const DEFAULT_SETTINGS = {
  site: {
    name: "Moranik Hub",
    description: "Your Digital Marketplace",
    logo: "",
    favicon: "",
    theme: {
      primaryColor: "#ff4444",
      secondaryColor: "#0f0f0f",
      accentColor: "#666666"
    },
    contact: {
      email: "support@moranik.com",
      phone: "",
      address: ""
    }
  },
  features: {
    userRegistration: true,
    emailVerification: false, // Disabled for now
    passwordRequirements: {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false
    },
    fileUpload: {
      maxFileSize: "50MB",
      allowedTypes: ["jpg", "png", "pdf", "zip", "mp3", "mp4", "doc", "docx"]
    },
    marketplace: {
      enablePricing: true,
      enableReviews: true,
      enableDownloads: true,
      enableUploads: true
    }
  },
  security: {
    enablePasswordProtection: false, // Disabled for now
    sessionTimeout: "7d",
    maxLoginAttempts: 5,
    lockoutDuration: "15m"
  },
  notifications: {
    emailNotifications: false,
    pushNotifications: false,
    adminAlerts: true
  },
  maintenance: {
    mode: false,
    message: "Site is under maintenance. Please check back later."
  },
  analytics: {
    enableTracking: true,
    enableUserStats: true,
    enableProductStats: true
  }
};

// Initialize settings file
const initializeSettings = () => {
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    console.log('✅ Settings file initialized with default values');
  }
};

// Helper functions
const readSettings = () => {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

const writeSettings = (settings) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing settings:', error);
    return false;
  }
};

// Settings service
export const settingsService = {
  getAll: () => {
    return readSettings();
  },
  
  get: (category) => {
    const settings = readSettings();
    return settings[category] || null;
  },
  
  update: (category, updates) => {
    const settings = readSettings();
    if (settings[category]) {
      settings[category] = { ...settings[category], ...updates };
      return writeSettings(settings);
    }
    return false;
  },
  
  updateMultiple: (updates) => {
    const settings = readSettings();
    Object.keys(updates).forEach(category => {
      if (settings[category]) {
        settings[category] = { ...settings[category], ...updates[category] };
      }
    });
    return writeSettings(settings);
  },
  
  reset: () => {
    return writeSettings(DEFAULT_SETTINGS);
  },
  
  isFeatureEnabled: (feature) => {
    const settings = readSettings();
    const featurePath = feature.split('.');
    let value = settings;
    
    for (const path of featurePath) {
      value = value?.[path];
      if (value === undefined) return false;
    }
    
    return Boolean(value);
  },
  
  getPasswordRequirements: () => {
    const settings = readSettings();
    return settings.features.passwordRequirements;
  },
  
  isPasswordProtectionEnabled: () => {
    const settings = readSettings();
    return settings.security.enablePasswordProtection;
  },
  
  isEmailVerificationEnabled: () => {
    const settings = readSettings();
    return settings.features.emailVerification;
  },
  
  isUserRegistrationEnabled: () => {
    const settings = readSettings();
    return settings.features.userRegistration;
  },
  
  isMaintenanceMode: () => {
    const settings = readSettings();
    return settings.maintenance.mode;
  },
  
  getMaintenanceMessage: () => {
    const settings = readSettings();
    return settings.maintenance.message;
  }
};

// Initialize settings on service load
initializeSettings();

export default settingsService;
