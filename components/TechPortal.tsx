
import React, { useState } from 'react';
import { HOSTING_PLANS } from '../constants';
import { SoftwareProduct, HostingPlan } from '../types';
import { getTechRecommendation } from '../geminiService';

interface TechPortalProps {
  onAddToCart: (item: any) => void;
  softwareList: SoftwareProduct[];
}

const TechPortal: React.FC<TechPortalProps> = ({ onAddToCart, softwareList }) => {
  const [activeTab, setActiveTab] = useState<'Software' | 'Hosting'>('Software');
  const [userQuery, setUserQuery] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!userQuery.trim()) return;
    setLoading(true);
    const result = await getTechRecommendation(userQuery);
    setRecommendation(result || '');
    setLoading(false);
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-slate-200 font-inter">
      {/* Hero Header with subtle gradient */}
      <div className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.08)_0%,_transparent_60%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-red-600/20 bg-red-600/5 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Moranik Tech Ecosystem
          </div>
          <h1 className="text-5xl md:text-8xl font-outfit font-black mb-6 tracking-tighter text-white text-wrap">
            Architect the <span className="text-red-600">Digital Realm.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light">
            Enterprise software and iron-clad hosting solutions engineered for the modern elite.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button 
              onClick={() => setActiveTab('Software')}
              className={`px-10 py-4 rounded-2xl font-bold transition-all border ${activeTab === 'Software' ? 'bg-red-600 border-red-600 text-white scale-105 shadow-[0_10px_30px_rgba(220,38,38,0.3)]' : 'bg-[#1a1a1a] border-white/5 text-slate-400 hover:border-red-600/30'}`}
            >
              <i className="fas fa-code mr-2"></i> Moranik Software
            </button>
            <button 
              onClick={() => setActiveTab('Hosting')}
              className={`px-10 py-4 rounded-2xl font-bold transition-all border ${activeTab === 'Hosting' ? 'bg-red-600 border-red-600 text-white scale-105 shadow-[0_10px_30px_rgba(220,38,38,0.3)]' : 'bg-[#1a1a1a] border-white/5 text-slate-400 hover:border-red-600/30'}`}
            >
              <i className="fas fa-server mr-2"></i> Server Hosting
            </button>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="max-w-4xl mx-auto px-4 mb-20 relative z-10">
          <div className="bg-[#141414]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg shadow-red-600/30">
                <i className="fas fa-bolt text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Moranik AI Consultant</h3>
                <p className="text-slate-500 text-sm">Real-time tech stack optimization</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input 
                type="text" 
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="What project are you scaling? (e.g. AI SaaS with 50k users)"
                className="flex-grow bg-[#0c0c0c] border border-white/5 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-red-600 outline-none text-white transition-all"
              />
              <button 
                onClick={handleAskAI}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Deploy AI'}
              </button>
            </div>
            {recommendation && (
              <div className="mt-6 bg-red-950/10 border border-red-600/20 rounded-2xl p-6 text-sm leading-relaxed text-slate-300 animate-fade-in">
                <p className="font-bold text-red-500 mb-2 tracking-widest uppercase text-[10px]">Strategic Recommendation</p>
                <p>{recommendation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {activeTab === 'Software' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {softwareList.map((prod) => (
              <div key={prod.id} className="bg-[#141414] border border-white/5 rounded-[2rem] overflow-hidden hover:border-red-600/40 transition-all group flex flex-col h-full hover:-translate-y-1 duration-300">
                <div className="h-56 relative overflow-hidden">
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100" />
                  <div className="absolute top-4 left-4 bg-red-600 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-xl">
                    {prod.category}
                  </div>
                  {prod.price === 0 && (
                    <div className="absolute bottom-4 right-4 bg-white text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">
                      Moranik Free
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-red-500 transition-colors">{prod.name}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{prod.description}</p>
                  <div className="space-y-3 mb-8 flex-grow">
                    {prod.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center text-xs text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center mr-3">
                            <i className="fas fa-check text-red-600 scale-75"></i>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div>
                      <span className="text-3xl font-black text-white">{prod.price === 0 ? 'FREE' : `KSh ${prod.price}`}</span>
                    </div>
                    <button 
                      onClick={() => onAddToCart({ ...prod, type: 'Software' })}
                      className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                        prod.price === 0 
                          ? 'bg-white text-black hover:bg-red-600 hover:text-white' 
                          : 'bg-[#1c1c1c] hover:bg-red-600 text-white border border-white/5'
                      }`}
                    >
                      <i className={`fas ${prod.price === 0 ? 'fa-bolt' : 'fa-plus'}`}></i>
                      {prod.price === 0 ? 'Activate' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOSTING_PLANS.map((plan) => (
              <div key={plan.id} className={`p-10 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden ${plan.tier === 'Pro' ? 'bg-[#1a1414] border-red-600 shadow-2xl' : 'bg-[#141414] border-white/5 hover:border-red-600/30'}`}>
                {plan.tier === 'Pro' && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-red-600 text-white text-[9px] font-black px-8 py-2 rotate-45 translate-x-6 translate-y-2 uppercase tracking-widest">Recommended</div>
                  </div>
                )}
                <h3 className="text-3xl font-black mb-2 text-white">{plan.tier}</h3>
                <div className="mb-8">
                  <span className="text-5xl font-black text-white">KSh {plan.price}</span>
                  <span className="text-slate-500 text-sm font-medium">/mo</span>
                </div>
                <div className="space-y-5 mb-10">
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                    <span className="text-slate-500">vCPU Resources</span>
                    <span className="font-bold text-white">{plan.cpu}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                    <span className="text-slate-500">RAM Capacity</span>
                    <span className="font-bold text-white">{plan.ram}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                    <span className="text-slate-500">NVMe Storage</span>
                    <span className="font-bold text-white">{plan.storage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                    <span className="text-slate-500">Bandwidth</span>
                    <span className="font-bold text-white">{plan.bandwidth}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onAddToCart({ ...plan, name: `${plan.tier} Hosting`, type: 'Hosting' })}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${plan.tier === 'Pro' ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl' : 'bg-[#1c1c1c] text-white hover:bg-red-600'}`}
                >
                  Initiate Provisioning
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechPortal;
