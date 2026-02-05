
import { SoftwareProduct, HostingPlan, MusicTrack, Novel } from './types';

export const SOFTWARE_PRODUCTS: SoftwareProduct[] = [
  {
    id: 's1',
    name: 'Nexus IDE Pro',
    category: 'Development',
    price: 199,
    description: 'Next-generation intelligent development environment with built-in AI pair programming.',
    features: ['AI Autocomplete', 'Cloud Sync', 'Multi-language Debugging'],
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's4',
    name: 'Moranik Code-Lite',
    category: 'Development',
    price: 0,
    description: 'A lightweight, blazing fast code editor for quick scripts and configuration editing.',
    features: ['Instant Startup', 'Syntax Highlighting', 'Git Integration'],
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's2',
    name: 'VaultShield VPN',
    category: 'Security',
    price: 59,
    description: 'Military-grade encryption for your enterprise network and individual workstations.',
    features: ['Zero-Knowledge Logging', 'Kill Switch', 'P2P Optimized'],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's5',
    name: 'NetScan Community',
    category: 'Security',
    price: 0,
    description: 'Essential network security scanning tool for independent researchers and students.',
    features: ['Port Scanning', 'Vulnerability DB', 'Export Reports'],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's3',
    name: 'Flux CRM',
    category: 'Enterprise',
    price: 499,
    description: 'Streamline your customer relationships with automated workflows and predictive analytics.',
    features: ['Lead Scoring', 'Email Automation', 'Sales Forecasting'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400'
  }
];

export const HOSTING_PLANS: HostingPlan[] = [
  {
    id: 'h1',
    tier: 'Starter',
    price: 29,
    cpu: '2 vCPU',
    ram: '4 GB',
    storage: '80 GB NVMe',
    bandwidth: '2 TB'
  },
  {
    id: 'h2',
    tier: 'Pro',
    price: 89,
    cpu: '4 vCPU',
    ram: '16 GB',
    storage: '240 GB NVMe',
    bandwidth: '5 TB'
  },
  {
    id: 'h3',
    tier: 'Enterprise',
    price: 299,
    cpu: '16 vCPU',
    ram: '64 GB',
    storage: '1 TB NVMe',
    bandwidth: 'Unlimited'
  }
];

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'm1',
    title: 'Neon Horizon',
    artist: 'SynthWave Labs',
    album: 'Electric Dreams',
    coverUrl: 'https://picsum.photos/seed/music1/400/400',
    duration: '3:45',
    price: 1.29,
    genre: 'Retrowave'
  },
  {
    id: 'm2',
    title: 'Midnight rain',
    artist: 'Lofi Chill',
    album: 'Study Session 2024',
    coverUrl: 'https://picsum.photos/seed/music2/400/400',
    duration: '2:58',
    price: 0.99,
    genre: 'Lofi'
  },
  {
    id: 'm3',
    title: 'Velocity',
    artist: 'Drift Masters',
    album: 'High Octane',
    coverUrl: 'https://picsum.photos/seed/music3/400/400',
    duration: '4:12',
    price: 1.49,
    genre: 'Electronic'
  }
];

export const NOVELS: Novel[] = [
  {
    id: 'n1',
    title: 'The Silicon Echo',
    author: 'Elena Vance',
    coverUrl: 'https://picsum.photos/seed/book1/400/600',
    description: 'In a world where AI has its own subconscious, one hacker discovers a secret that could restart humanity.',
    genre: 'Cyberpunk',
    price: 14.99,
    rating: 4.8,
    chapters: 24
  },
  {
    id: 'n2',
    title: 'Veil of Shadows',
    author: 'Kaelen Thorne',
    coverUrl: 'https://picsum.photos/seed/book2/400/600',
    description: 'Magic is illegal, but the crown prince just manifested the most dangerous power of all.',
    genre: 'Fantasy',
    price: 12.50,
    rating: 4.5,
    chapters: 32
  },
  {
    id: 'n3',
    title: 'Quantum Hearts',
    author: 'Sarah Jenkins',
    coverUrl: 'https://picsum.photos/seed/book3/400/600',
    description: 'A scientist working on time travel accidentally keeps meeting the same person in different timelines.',
    genre: 'Sci-Fi Romance',
    price: 9.99,
    rating: 4.9,
    chapters: 18
  }
];
