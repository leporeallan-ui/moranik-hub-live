
import { SoftwareProduct, HostingPlan, MusicTrack, Novel, SiteSettings, User, UserRole, SystemLog } from '../types';
import { SOFTWARE_PRODUCTS, HOSTING_PLANS, MUSIC_TRACKS, NOVELS } from '../constants';

const KEYS = {
  SOFTWARE: 'moranik_software',
  HOSTING: 'moranik_hosting',
  MUSIC: 'moranik_music',
  NOVELS: 'moranik_novels',
  LOGS: 'moranik_system_logs',
  SETTINGS: 'moranik_settings',
  USERS: 'moranik_users'
};

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Moranik Hub',
  maintenanceMode: false,
  globalMarkup: 0,
  currency: 'KSh',
  regionLock: false,
  apiKeyStripe: 'sk_live_********',
  apiKeyGemini: 'gm_********',
  rateLimit: 1000
};

const DEFAULT_USERS: User[] = [
  { id: 'u1', username: 'moranik_root', role: UserRole.ROOT, lastActive: new Date().toISOString() },
  { id: 'u2', username: 'admin_alpha', role: UserRole.ADMIN, lastActive: new Date().toISOString() }
];

export const storageService = {
  init() {
    if (!localStorage.getItem(KEYS.SOFTWARE)) {
      localStorage.setItem(KEYS.SOFTWARE, JSON.stringify(SOFTWARE_PRODUCTS));
      localStorage.setItem(KEYS.HOSTING, JSON.stringify(HOSTING_PLANS));
      localStorage.setItem(KEYS.MUSIC, JSON.stringify(MUSIC_TRACKS));
      localStorage.setItem(KEYS.NOVELS, JSON.stringify(NOVELS));
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      this.addLog("Backend initialized with factory defaults.", 'INFO');
    }
  },

  // Settings
  getSettings(): SiteSettings {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },
  updateSettings(settings: Partial<SiteSettings>) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    this.addLog("Site configuration updated by Root.", 'WARN');
  },

  // Users
  getUsers(): User[] {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  // Data Getters
  getData<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  // Software CRUD
  // Fix: Remove explicit type argument from this.getData call as it causes "untyped call" errors in this context
  getSoftwares(): SoftwareProduct[] { 
    const markup = this.getSettings().globalMarkup;
    return (this.getData(KEYS.SOFTWARE) as SoftwareProduct[]).map(s => ({
      ...s,
      price: Math.round(s.price * (1 + markup / 100))
    }));
  },
  // Fix: Remove explicit type argument from this.getData call as it causes "untyped call" errors in this context
  saveSoftware(item: SoftwareProduct) {
    const list: SoftwareProduct[] = this.getData(KEYS.SOFTWARE);
    localStorage.setItem(KEYS.SOFTWARE, JSON.stringify([item, ...list]));
    this.addLog(`Deployed software: ${item.name} to mainnet.`, 'INFO');
  },
  // Fix: Remove explicit type argument from this.getData call as it causes "untyped call" errors in this context
  deleteSoftware(id: string) {
    const list = (this.getData(KEYS.SOFTWARE) as SoftwareProduct[]).filter(s => s.id !== id);
    localStorage.setItem(KEYS.SOFTWARE, JSON.stringify(list));
    this.addLog(`Deprovisioned software ID: ${id}`, 'WARN');
  },

  getHosting(): HostingPlan[] { return this.getData(KEYS.HOSTING); },
  getMusic(): MusicTrack[] { return this.getData(KEYS.MUSIC); },
  getNovels(): Novel[] { return this.getData(KEYS.NOVELS); },

  // Logs
  getLogs(): SystemLog[] {
    const logs = localStorage.getItem(KEYS.LOGS);
    return logs ? JSON.parse(logs) : [];
  },
  addLog(msg: string, level: SystemLog['level'] = 'INFO') {
    const logs = this.getLogs();
    const newLog: SystemLog = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message: msg,
      user: 'moranik_root'
    };
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(updatedLogs));
  },
  clearLogs() {
    localStorage.setItem(KEYS.LOGS, JSON.stringify([]));
  }
};
