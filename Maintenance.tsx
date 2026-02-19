import React, { useState, useEffect, useRef } from 'react';
import { Settings, Zap, Wrench } from 'lucide-react';

const MaintenancePage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Music එක Play කිරීමට සහ Auto-play පරීක්ෂා කිරීමට
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            console.log("Autoplay blocked. Waiting for user interaction.");
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const handleStartAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden relative cursor-pointer"
      onClick={!isPlaying ? handleStartAudio : undefined}
    >
      {/* Background Music */}
      <audio 
        ref={audioRef}
        src="https://github.com/Akashkavindu/ZANTA_MD/raw/main/images/Edward%20Maya%20and%20Vika%20Jigulina%20-%20Stereo%20Love%20(Karaoke%20Version).mp3"
        loop
      />

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px]" />

      <div className="max-w-2xl w-full text-center z-10">
        
        {/* Animated Icon Section */}
        <div className="relative inline-block mb-12">
          <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-slate-900/50 border border-white/10 p-10 rounded-[3rem] backdrop-blur-2xl shadow-2xl">
            <Settings className="w-20 h-20 text-blue-500 animate-[spin_6s_linear_infinite]" />
            <div className="absolute -top-3 -right-3">
              <Zap className="w-10 h-10 text-yellow-500 fill-yellow-500 animate-bounce" />
            </div>
            <div className="absolute -bottom-3 -left-3">
                <Wrench className="w-10 h-10 text-pink-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            System <br />
            <span className="text-blue-600">Under Maintain</span>
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-lg max-w-sm mx-auto font-bold uppercase tracking-[0.2em] opacity-80">
            Fine-tuning for excellence
          </p>
        </div>

        {/* Interaction Prompt - Only visible if music hasn't started */}
        {!isPlaying && (
          <div className="mt-12 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
            Click anywhere to activate audio
          </div>
        )}

        {/* Status indicator */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <span className="text-blue-500/50 font-black text-[10px] uppercase tracking-widest">
            Core Optimization in progress
          </span>
        </div>

      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default MaintenancePage;
