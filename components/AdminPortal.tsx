
import React, { useState, useEffect } from 'react';
import { SoftwareProduct, SiteSettings, User, UserRole, SystemLog } from '../types';
import { GoogleGenAI } from "@google/genai";
import { storageService } from '../services/storageService';

interface AdminPortalProps {
  onRefreshData: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Upload' | 'Database' | 'Settings' | 'Logs'>('Overview');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const [users, setUsers] = useState<User[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Development' as any,
    price: '',
    description: '',
    features: ''
  });

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshAll = () => {
    setLogs(storageService.getLogs());
    setSettings(storageService.getSettings());
    setUsers(storageService.getUsers());
  };

  const handleUpdateSetting = (key: keyof SiteSettings, value: any) => {
    storageService.updateSettings({ [key]: value });
    setSettings(storageService.getSettings());
    onRefreshData();
  };

  const handleRestart = () => {
    setIsRestarting(true);
    storageService.addLog("Initiating kernel sequence restart...", 'CRITICAL');
    setTimeout(() => {
      setIsRestarting(false);
      storageService.addLog("Systems synchronized across cloud clusters.", 'INFO');
    }, 2000);
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) return alert("Asset name required");
    setLoadingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a high-end, professional description for a digital asset named "${formData.name}" in "${formData.category}".`,
      });
      setFormData(prev => ({ ...prev, description: response.text || '' }));
    } catch (e) {
      storageService.addLog("AI generation failed.", "ERROR");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSoftware: SoftwareProduct = {
      id: `s-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      features: formData.features.split(',').map(f => f.trim()),
      imageUrl: `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400`
    };
    storageService.saveSoftware(newSoftware);
    onRefreshData();
    setFormData({ name: '', category: 'Development', price: '', description: '', features: '' });
    setActiveTab('Database');
  };

  const getLogLevelColor = (level: SystemLog['level']) => {
    switch(level) {
      case 'CRITICAL': return 'text-red-600 font-black';
      case 'ERROR': return 'text-red-500';
      case 'WARN': return 'text-amber-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="bg-[#0c0c0c] min-h-screen text-slate-200 font-inter">
      {/* Dynamic Admin Header */}
      <div className="bg-[#141414] border-b border-red-600/10 px-8 py-6 sticky top-16 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Moranik <span className="text-red-600">Command</span></h1>
              {settings.maintenanceMode && (
                <span className="bg-red-600/10 text-red-500 text-[10px] font-black px-2 py-0.5 rounded border border-red-600/20 uppercase tracking-widest">Maintenance Active</span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Environment: PRODUCTION | Node: AF-EAST-1</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleRestart}
              disabled={isRestarting}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${isRestarting ? 'bg-red-600 border-red-600 text-white animate-pulse' : 'bg-[#1a1a1a] border-white/5 text-slate-400 hover:border-red-600 hover:text-red-500'}`}
            >
              {isRestarting ? 'REBOOTING...' : 'FORCE RESTART'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-2">
          {[
            { id: 'Overview', icon: 'fa-chart-network', label: 'Monitor' },
            { id: 'Upload', icon: 'fa-plus-circle', label: 'Deploy Asset' },
            { id: 'Database', icon: 'fa-database', label: 'Database' },
            { id: 'Settings', icon: 'fa-cog', label: 'Settings' },
            { id: 'Logs', icon: 'fa-stream', label: 'Audit Logs' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-[#141414] text-slate-500 hover:text-white border border-white/5'}`}
            >
              <i className={`fas ${tab.icon} mr-3`}></i> {tab.label}
            </button>
          ))}
          
          <div className="mt-8 pt-8 border-t border-white/5">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Active Staff</h4>
            <div className="space-y-3">
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-xs font-bold text-slate-400">{u.username}</span>
                  <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-slate-500 uppercase">{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {activeTab === 'Overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#141414] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><i className="fas fa-memory text-6xl"></i></div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-2">DB Latency</span>
                  <div className="text-4xl font-black text-white">12<span className="text-sm font-light text-slate-500">ms</span></div>
                  <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden"><div className="bg-green-500 h-full w-[12%]"></div></div>
                </div>
                <div className="bg-[#141414] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><i className="fas fa-microchip text-6xl"></i></div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-2">Cloud Cluster Load</span>
                  <div className="text-4xl font-black text-red-600">34<span className="text-sm font-light text-slate-500">%</span></div>
                  <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden"><div className="bg-red-600 h-full w-[34%]"></div></div>
                </div>
                <div className="bg-[#141414] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><i className="fas fa-shield-alt text-6xl"></i></div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-2">Active Sessions</span>
                  <div className="text-4xl font-black text-white">1.2<span className="text-sm font-light text-slate-500">k</span></div>
                  <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden"><div className="bg-white/20 h-full w-[80%]"></div></div>
                </div>
              </div>

              <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-8">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                  <i className="fas fa-server text-red-600"></i> Service Status Matrix
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['PostgreSQL Cluster', 'Redis Cache', 'Vercel Edge', 'Stripe Gateway', 'Gemini AI Pro', 'S3 Asset Storage'].map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{service}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-green-500 uppercase">Operational</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-10 animate-fade-in shadow-3xl">
              <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">Platform Variables</h2>
              <div className="space-y-10">
                <div className="flex items-center justify-between py-6 border-b border-white/5">
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">Maintenance Mode</h4>
                    <p className="text-xs text-slate-500 mt-1 italic">Blocks all public access to the storefronts.</p>
                  </div>
                  <button 
                    onClick={() => handleUpdateSetting('maintenanceMode', !settings.maintenanceMode)}
                    className={`w-14 h-8 rounded-full p-1 transition-all ${settings.maintenanceMode ? 'bg-red-600' : 'bg-white/10'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between py-6 border-b border-white/5">
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">Global Price Markup (%)</h4>
                    <p className="text-xs text-slate-500 mt-1 italic">Applies an automatic percentage increase to all KSh prices.</p>
                  </div>
                  <input 
                    type="number" 
                    value={settings.globalMarkup} 
                    onChange={(e) => handleUpdateSetting('globalMarkup', parseInt(e.target.value) || 0)}
                    className="w-24 bg-black border border-white/5 rounded-xl px-4 py-2 text-center font-black text-red-600 focus:ring-1 focus:ring-red-600 outline-none"
                  />
                </div>

                <div className="flex items-center justify-between py-6">
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">API Integration Keys</h4>
                    <p className="text-xs text-slate-500 mt-1 italic">Management of simulated service endpoints.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-600 font-mono">STRIPE_SK:</span>
                        <span className="bg-black px-3 py-1 rounded-lg text-[10px] text-slate-400 font-mono tracking-widest">sk_live_********</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-600 font-mono">GEMINI_AK:</span>
                        <span className="bg-black px-3 py-1 rounded-lg text-[10px] text-slate-400 font-mono tracking-widest">gm_prod_********</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Logs' && (
            <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-8 overflow-hidden animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">System Audit Log</h3>
                <button 
                    onClick={() => { storageService.clearLogs(); refreshAll(); }}
                    className="text-[10px] font-black text-slate-500 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                    Wipe Logs
                </button>
              </div>
              <div className="font-mono text-[11px] space-y-3 max-h-[500px] overflow-y-auto bg-black/40 p-8 rounded-3xl border border-white/5 scrollbar-thin scrollbar-thumb-red-600">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4 border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 transition-colors p-1">
                    <span className="text-slate-600 whitespace-nowrap">[{log.timestamp}]</span>
                    <span className={`w-20 uppercase font-black text-[9px] ${getLogLevelColor(log.level)}`}>{log.level}</span>
                    <span className="text-slate-300 flex-grow">{log.message}</span>
                    <span className="text-slate-600 text-[9px] font-bold">BY: {log.user}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Upload' && (
            <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-10 animate-fade-in">
              <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">Deploy Digital Asset</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Identifier</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-red-600 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Environment</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-red-600 outline-none transition-all">
                      <option>Development</option><option>Enterprise</option><option>Security</option><option>Design</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Base Value (KSh)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-red-600 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Product Copy</label>
                    <button type="button" onClick={handleGenerateDescription} disabled={loadingAI} className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest">{loadingAI ? 'GENERATING...' : 'AI ASSIST'}</button>
                  </div>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-red-600 outline-none transition-all"></textarea>
                </div>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-600/20 uppercase tracking-[0.3em] text-xs">Authorize Deployment</button>
              </form>
            </div>
          )}
          
          {activeTab === 'Database' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white uppercase tracking-widest">Entity Manager</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-white/5 text-slate-600 uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="pb-4 px-2">Type</th>
                                    <th className="pb-4 px-2">ID</th>
                                    <th className="pb-4 px-2">Asset Name</th>
                                    <th className="pb-4 px-2">Price</th>
                                    <th className="pb-4 px-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {storageService.getSoftwares().map(s => (
                                    <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-2 text-red-600 font-bold uppercase text-[9px]">Software</td>
                                        <td className="py-4 px-2 text-slate-500 font-mono text-[10px]">{s.id}</td>
                                        <td className="py-4 px-2 font-bold text-white">{s.name}</td>
                                        <td className="py-4 px-2 text-slate-300">KSh {s.price}</td>
                                        <td className="py-4 px-2">
                                            <button onClick={() => { storageService.deleteSoftware(s.id); refreshAll(); onRefreshData(); }} className="text-slate-700 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
