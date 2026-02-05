
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { RegistrationForm } from './RegistrationForm';
import { LoginForm } from './LoginForm';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, cartCount }) => {
  const isLanding = activeView === AppView.LANDING;
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Admin functionality removed
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <nav className={`sticky top-0 z-50 transition-colors duration-300 border-b ${
        isLanding ? 'bg-[#0f0f0f]/80 border-white/5' : 'bg-[#141414] border-red-600/10'
      } backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => onNavigate(AppView.LANDING)}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all group-hover:rotate-12 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                <i className="fas fa-crown text-white text-xl"></i>
              </div>
              <span className="text-2xl font-outfit font-bold tracking-tight text-white">
                Moranik<span className="text-red-600">Hub</span>
              </span>
            </div>

            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => onNavigate(AppView.TECH)}
                className={`text-sm font-semibold transition-colors ${
                  activeView === AppView.TECH ? 'text-red-500' : 'text-slate-300 hover:text-red-500'
                }`}
              >
                Moranik Tech
              </button>
              <button 
                onClick={() => onNavigate(AppView.ENTERTAINMENT)}
                className={`text-sm font-semibold transition-colors ${
                  activeView === AppView.ENTERTAINMENT ? 'text-red-500' : 'text-slate-300 hover:text-red-500'
                }`}
              >
                Moranik Entertainment
              </button>
              <button 
                onClick={() => onNavigate('MARKETPLACE' as any)}
                className={`text-sm font-semibold transition-colors ${
                  activeView === 'MARKETPLACE' ? 'text-red-500' : 'text-slate-300 hover:text-red-500'
                }`}
              >
                📦 Marketplace
              </button>
              <button 
                onClick={() => onNavigate('UPLOAD' as any)}
                className={`text-sm font-semibold transition-colors ${
                  activeView === 'UPLOAD' ? 'text-red-500' : 'text-slate-300 hover:text-red-500'
                }`}
              >
                📤 Upload Product
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <i className="fas fa-shopping-cart text-xl text-white hover:text-red-500 transition-colors"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#0f0f0f]">
                    {cartCount}
                  </span>
                )}
              </div>
              
              <button className="px-5 py-2 rounded-full text-sm font-bold transition-all bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white shadow-lg shadow-red-900/20" onClick={() => setShowRegister(true)}>
                Register
              </button>
              <button className="px-5 py-2 rounded-full text-sm font-bold transition-all bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20" onClick={() => setShowLogin(true)}>
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {showRegister && (
        <RegistrationForm onClose={() => setShowRegister(false)} />
      )}

      {showLogin && (
        <LoginForm onClose={() => setShowLogin(false)} />
      )}


      <footer className="bg-[#111111] border-t border-white/5 py-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <span className="text-xl font-outfit font-bold text-white mb-4 block">Moranik Hub</span>
              <p className="text-sm leading-relaxed text-slate-500">
                Premium digital destination for elite tech solutions and immersive entertainment. Powered by Moranik excellence.
              </p>
            </div>
            <div>
              <h4 className="text-slate-200 font-bold mb-4 uppercase text-[10px] tracking-widest">Moranik Tech</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-red-500 cursor-pointer transition-colors">Software Licensing</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Cloud Hosting</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Dedicated Servers</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Developer Tools</li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-200 font-bold mb-4 uppercase text-[10px] tracking-widest">Entertainment</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-red-500 cursor-pointer transition-colors">Moranik Records</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Novels & Literature</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Live Streaming</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Creative Rights</li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-200 font-bold mb-4 uppercase text-[10px] tracking-widest">Join the Elite</h4>
              <p className="text-sm mb-4 text-slate-500">Stay updated with the Moranik ecosystem.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-[#1a1a1a] border border-white/5 rounded-l-lg px-4 py-2 text-white w-full focus:ring-1 focus:ring-red-600 outline-none" 
                />
                <button className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-widest text-slate-600">
            &copy; 2024 Moranik Hub Platforms Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
