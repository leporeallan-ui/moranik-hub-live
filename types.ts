
export enum AppView {
  LANDING = 'LANDING',
  TECH = 'TECH',
  ENTERTAINMENT = 'ENTERTAINMENT',
  ADMIN = 'ADMIN'
}

export enum UserRole {
  ROOT = 'ROOT',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  lastActive: string;
}

export interface SiteSettings {
  siteName: string;
  maintenanceMode: boolean;
  globalMarkup: number; // Percentage
  currency: string;
  regionLock: boolean;
  apiKeyStripe: string;
  apiKeyGemini: string;
  rateLimit: number;
}

export interface SystemLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  message: string;
  user?: string;
}

export interface SoftwareProduct {
  id: string;
  name: string;
  category: 'Development' | 'Enterprise' | 'Security' | 'Design';
  price: number;
  description: string;
  features: string[];
  imageUrl: string;
}

export interface HostingPlan {
  id: string;
  tier: 'Starter' | 'Pro' | 'Enterprise';
  price: number;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  price: number;
  genre: string;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  genre: string;
  price: number;
  rating: number;
  chapters: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'Software' | 'Hosting' | 'Music' | 'Novel';
}
