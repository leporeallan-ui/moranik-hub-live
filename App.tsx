
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TechPortal from './components/TechPortal';
import EntertainmentPortal from './components/EntertainmentPortal';
import AdminPortal from './components/AdminPortal';
import ProductUpload from './components/ProductUpload';
import ProductBrowser from './components/ProductBrowser';
import EmailVerification from './components/EmailVerification';
import { AppView, CartItem, SoftwareProduct, MusicTrack, Novel, SiteSettings } from './types';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.LANDING);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  
  // Virtual Backend States
  const [softwares, setSoftwares] = useState<SoftwareProduct[]>([]);
  const [music, setMusic] = useState<MusicTrack[]>([]);
  const [novels, setNovels] = useState<Novel[]>([]);

  useEffect(() => {
    try {
      storageService.init();
      refreshBackendState();
      
      // Polling for remote updates (simulated)
      const interval = setInterval(refreshBackendState, 3000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }, []);

  const refreshBackendState = () => {
    setSoftwares(storageService.getSoftwares());
    setMusic(storageService.getMusic());
    setNovels(storageService.getNovels());
    setSettings(storageService.getSettings());
  };

  const handleAddToCart = (item: any) => {
    const cartItem: CartItem = {
      id: item.id || Math.random().toString(36).substr(2, 9),
      name: item.name || item.title || item.tier,
      price: item.price,
      type: item.type
    };
    setCart([...cart, cartItem]);
    storageService.addLog(`Checkout buffer updated: ${cartItem.name}`, 'INFO');
  };

  const handleNavigate = (view: AppView) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveView(view);
  };

  if (settings?.maintenanceMode && activeView !== AppView.ADMIN) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-red-600/10 border border-red-600/20 rounded-3xl flex items-center justify-center mb-10 animate-pulse">
            <i className="fas fa-tools text-4xl text-red-600"></i>
        </div>
        <h1 className="text-4xl md:text-6xl font-outfit font-black text-white mb-6 uppercase tracking-tighter italic">Systems <span className="text-red-600">Suspended.</span></h1>
        <p className="text-slate-500 max-w-md font-bold text-sm tracking-widest uppercase mb-12">The Moranik Hub is currently undergoing scheduled optimization.</p>
        <button 
            onClick={() => handleNavigate(AppView.ADMIN)} 
            className="text-[10px] font-black text-slate-800 uppercase tracking-widest hover:text-white transition-colors"
        >
            Management Access
        </button>
      </div>
    );
  }

  const renderLanding = () => (
    <div className="relative overflow-hidden bg-[#0f0f0f] animate-fade-in">
      <div className="flex flex-col md:flex-row h-screen">
        <div 
          className="relative flex-1 group cursor-pointer overflow-hidden bg-[#111] border-r border-white/5"
          onClick={() => handleNavigate(AppView.TECH)}
        >
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-all duration-[1.5s] grayscale group-hover:grayscale-0">
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]" alt="Technology" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-12 z-10">
            <div className="w-24 h-24 bg-[#1a1a1a] border border-red-600/30 rounded-[2rem] flex items-center justify-center mb-10 shadow-3xl group-hover:border-red-600 transition-all duration-700">
              <i className="fas fa-terminal text-4xl text-red-600"></i>
            </div>
            <h2 className="text-5xl md:text-7xl font-outfit font-black text-white mb-6 tracking-tighter uppercase italic group-hover:text-red-500 transition-colors">Moranik Tech</h2>
            <p className="text-slate-400 max-w-sm font-bold mb-12 tracking-[0.3em] text-[10px] uppercase">Elite Software & High-Speed Hosting</p>
            <div className="px-10 py-4 border-2 border-red-600 text-red-600 font-black text-xs uppercase tracking-[0.2em] rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-2xl">
              Initiate Tech Ecosystem
            </div>
          </div>
        </div>

        <div 
          className="relative flex-1 group cursor-pointer overflow-hidden bg-[#141414]"
          onClick={() => handleNavigate(AppView.ENTERTAINMENT)}
        >
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-all duration-[1.5s] grayscale group-hover:grayscale-0">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]" alt="Entertainment" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-red-950/20 to-transparent"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-12 z-10">
            <div className="w-24 h-24 bg-[#1a1a1a] border border-red-600/30 rounded-[2rem] flex items-center justify-center mb-10 shadow-3xl group-hover:border-red-600 transition-all duration-700">
              <i className="fas fa-quill text-4xl text-red-600"></i>
            </div>
            <h2 className="text-5xl md:text-7xl font-outfit font-black text-white mb-6 tracking-tighter uppercase italic group-hover:text-red-500 transition-colors">Moranik ENT.</h2>
            <p className="text-slate-400 max-w-sm font-bold mb-12 tracking-[0.3em] text-[10px] uppercase">Curated Music & Masterpiece Literature</p>
            <div className="px-10 py-4 border-2 border-red-600 text-red-600 font-black text-xs uppercase tracking-[0.2em] rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-2xl">
              Enter Creative Studio
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminPortal = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      return (
        <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-center px-6">
          <div className="w-24 h-24 bg-red-600/10 border border-red-600/20 rounded-3xl flex items-center justify-center mb-10 animate-pulse">
            <i className="fas fa-lock text-4xl text-red-600"></i>
          </div>
          <h1 className="text-4xl md:text-6xl font-outfit font-black text-white mb-6 uppercase tracking-tighter">Access <span className="text-red-600">Denied.</span></h1>
          <p className="text-slate-500 max-w-md font-bold text-sm tracking-widest uppercase mb-12">Admin authentication required. Click the lock icon (🔐) in the navigation to login.</p>
        </div>
      );
    }
    return <AdminPortal onRefreshData={refreshBackendState} />;
  };

  return (
    <Layout activeView={activeView} onNavigate={handleNavigate} cartCount={cart.length}>
      {activeView === AppView.LANDING && renderLanding()}
      {activeView === AppView.TECH && <TechPortal onAddToCart={handleAddToCart} softwareList={softwares} />}
      {activeView === AppView.ENTERTAINMENT && <EntertainmentPortal onAddToCart={handleAddToCart} musicList={music} novelList={novels} />}
      {activeView === AppView.ADMIN && renderAdminPortal()}
      {activeView === 'UPLOAD' && <ProductUpload />}
      {activeView === 'MARKETPLACE' && <ProductBrowser />}
      {activeView === 'VERIFY_EMAIL' && <EmailVerification />}
    </Layout>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<any, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '20px', textAlign: 'center', color: 'white'}}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap App with Error Boundary
const AppWithErrorBoundary: React.FC = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
