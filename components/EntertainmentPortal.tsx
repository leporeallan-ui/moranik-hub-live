
import React, { useState } from 'react';
import { MusicTrack, Novel } from '../types';
import { getEntertainmentInsight } from '../geminiService';

interface EntertainmentPortalProps {
  onAddToCart: (item: any) => void;
  musicList: MusicTrack[];
  novelList: Novel[];
}

const EntertainmentPortal: React.FC<EntertainmentPortalProps> = ({ onAddToCart, musicList, novelList }) => {
  const [activeTab, setActiveTab] = useState<'Music' | 'Novels'>('Music');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<MusicTrack | null>(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const fetchInsight = async (topic: string) => {
    setLoading(true);
    const result = await getEntertainmentInsight(topic);
    setInsight(result || '');
    setLoading(false);
  };

  const handlePlayMusic = (track: MusicTrack) => {
    if (playingTrack?.id === track.id) {
      setIsPaused(!isPaused);
      return;
    }
    setPlayingTrack(track);
    setIsPaused(false);
    fetchInsight(track.genre);
  };

  const handleNextTrack = () => {
    if (!playingTrack || musicList.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * musicList.length);
    } else {
      const currentIndex = musicList.findIndex(t => t.id === playingTrack.id);
      nextIndex = (currentIndex + 1) % musicList.length;
    }
    const nextTrack = musicList[nextIndex];
    setPlayingTrack(nextTrack);
    setIsPaused(false);
    fetchInsight(nextTrack.genre);
  };

  const handlePrevTrack = () => {
    if (!playingTrack || musicList.length === 0) return;
    const currentIndex = musicList.findIndex(t => t.id === playingTrack.id);
    let prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
    const prevTrack = musicList[prevIndex];
    setPlayingTrack(prevTrack);
    setIsPaused(false);
    fetchInsight(prevTrack.genre);
  };

  const handleReadNovel = (novel: Novel) => {
    fetchInsight(novel.genre);
    alert(`Opening Moranik e-Reader for: ${novel.title}. Immerse yourself in the story.`);
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-slate-100 font-inter relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-16">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 mb-6 rounded border border-red-600/20 text-red-500 text-[10px] font-black tracking-[0.2em] uppercase bg-red-600/5">
              Moranik Creative Studio
            </div>
            <h2 className="text-5xl md:text-8xl font-outfit font-black tracking-tighter mb-8 text-white leading-none">
              {activeTab === 'Music' ? 'Pulse of the Red.' : 'Chronicles of Moranik.'}
            </h2>
            <div className="flex space-x-10">
              <button onClick={() => setActiveTab('Music')} className={`text-xs font-black pb-3 transition-all tracking-[0.2em] uppercase ${activeTab === 'Music' ? 'border-b-2 border-red-600 text-red-500' : 'text-slate-500 hover:text-white'}`}>Moranik Audio</button>
              <button onClick={() => setActiveTab('Novels')} className={`text-xs font-black pb-3 transition-all tracking-[0.2em] uppercase ${activeTab === 'Novels' ? 'border-b-2 border-red-600 text-red-500' : 'text-slate-500 hover:text-white'}`}>Moranik Literature</button>
            </div>
          </div>
          {insight && (
            <div className="max-w-md bg-[#161616] border border-white/5 rounded-3xl p-6 text-sm italic text-slate-300 animate-fade-in shadow-2xl relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg"><i className="fas fa-quote-left text-white text-[10px]"></i></div>
              <span className="font-black uppercase tracking-widest text-[10px] text-red-600 block mb-2">Creative Echo</span>
              <p className="leading-relaxed">{insight}</p>
            </div>
          )}
        </div>

        {activeTab === 'Music' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {musicList.map((track) => (
              <div key={track.id} className="bg-[#141414]/60 backdrop-blur rounded-[2rem] p-6 border border-white/5 hover:border-red-600/30 transition-all group relative">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative shadow-2xl">
                  <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100" />
                  <button onClick={() => handlePlayMusic(track)} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                      <i className={`fas ${(playingTrack?.id === track.id && !isPaused) ? 'fa-pause' : 'fa-play'} ml-1`}></i>
                    </div>
                  </button>
                </div>
                <h4 className="font-bold text-xl mb-1 truncate text-white">{track.title}</h4>
                <p className="text-slate-500 text-sm mb-6 font-medium">{track.artist}</p>
                <div className="flex items-center justify-between pt-5 border-t border-white/5">
                  <span className="text-red-600 font-black text-lg">KSh {track.price}</span>
                  <button onClick={() => onAddToCart({ ...track, name: track.title, type: 'Music' })} className="text-[9px] font-black uppercase tracking-widest bg-white text-black px-5 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all">Purchase</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {novelList.map((novel) => (
              <div key={novel.id} className="flex flex-col sm:flex-row gap-10 group bg-[#141414]/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-red-600/20 transition-all">
                <div className="w-full sm:w-48 h-72 rounded-2xl overflow-hidden flex-shrink-0 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/5 group-hover:-translate-y-2 transition-transform duration-500">
                  <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center py-2">
                  <span className="text-[10px] text-red-500 font-black mb-2 uppercase tracking-[0.3em]">{novel.genre}</span>
                  <h3 className="text-3xl font-black mb-4 text-white group-hover:text-red-500 transition-colors leading-tight">{novel.title}</h3>
                  <p className="text-slate-500 text-sm mb-8 line-clamp-4 italic leading-relaxed">"{novel.description}"</p>
                  <div className="flex items-center space-x-1 text-red-600 text-[10px] mb-8 font-black uppercase tracking-widest">
                    <i className="fas fa-star"></i>
                    <span className="text-slate-400 ml-2">Legacy Score: {novel.rating}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <button onClick={() => handleReadNovel(novel)} className="bg-white text-black hover:bg-red-600 hover:text-white px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">Read Now</button>
                    <button onClick={() => onAddToCart({ ...novel, name: novel.title, type: 'Novel' })} className="text-red-600 font-black transition-all text-xs uppercase tracking-widest hover:text-red-500">Own: KSh {novel.price}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {playingTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0c0c0c]/90 backdrop-blur-2xl border-t border-white/5 px-8 py-5 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-neutral-800 flex-shrink-0 relative overflow-hidden shadow-lg"><img src={playingTrack.coverUrl} className="w-full h-full object-cover" alt="" /></div>
              <div className="hidden sm:block">
                <h5 className="font-bold text-base text-white truncate">{playingTrack.title}</h5>
                <p className="text-red-600 text-[10px] uppercase font-black tracking-widest mt-0.5">{playingTrack.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 sm:gap-10">
              <button onClick={() => setIsShuffle(!isShuffle)} className={`transition-colors ${isShuffle ? 'text-red-600' : 'text-slate-600 hover:text-red-500'}`}><i className="fas fa-random text-sm"></i></button>
              <button onClick={handlePrevTrack} className="text-slate-600 hover:text-red-500 transition-colors"><i className="fas fa-step-backward text-sm"></i></button>
              <button onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-xl shadow-red-600/30">
                <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} ${isPaused ? 'ml-1' : ''} text-lg sm:text-xl`}></i>
              </button>
              <button onClick={handleNextTrack} className="text-slate-600 hover:text-red-500 transition-colors"><i className="fas fa-step-forward text-sm"></i></button>
              <button onClick={() => setIsRepeat(!isRepeat)} className={`transition-colors ${isRepeat ? 'text-red-600' : 'text-slate-600 hover:text-red-500'}`}><i className="fas fa-redo text-sm"></i></button>
            </div>
            <div className="hidden md:flex items-center gap-8 w-64 lg:w-80">
              <i className="fas fa-volume-up text-slate-600 text-sm"></i>
              <div className="h-1 bg-white/5 rounded-full flex-grow overflow-hidden relative">
                <div className="h-full bg-red-600 w-2/3 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntertainmentPortal;
