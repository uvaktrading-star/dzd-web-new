import React, { useState, useEffect, useRef } from 'react';
import { Settings, Zap, Wrench } from 'lucide-react';

const MaintenancePage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // CSS Hack: Header සහ Footer බලහත්කාරයෙන් හංගනවා (Hide Navbar/Footer)
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');
    const chatWidget = document.querySelector('.fixed.bottom-4'); // Chat widget class එක

    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (chatWidget) chatWidget.style.display = 'none';

    // Music logic
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }

    // Page එකෙන් අයින් වෙද්දී ආපහු Header/Footer පෙන්වනවා
    return () => {
      if (navbar) navbar.style.display = 'flex';
      if (footer) footer.style.display = 'block';
      if (chatWidget) chatWidget.style.display = 'block';
    };
  }, []);

  const handleStartAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center p-4 overflow-hidden cursor-pointer"
      onClick={!isPlaying ? handleStartAudio : undefined}
    >
      {/* Background Music */}
      <audio 
        ref={audioRef}
        src="https://github.com/Akashkavindu/ZANTA_MD/raw/main/images/Edward%20Maya%20and%20Vika%20Jigulina%20-%20Stereo%20Love%20(Karaoke%20Version).mp3"
        loop
      />

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[120px]" />

      <div className="max-w-2xl w-full text-center z-10">
        
        {/* Animated Icon Section */}
        <div className="relative inline-block mb-10">
          <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-slate-900/50 border border-white/10 p-10 rounded-[3rem] backdrop-blur-2xl shadow-2xl">
            <Settings className="w-20 h-20 text-blue-500 animate-[spin_8s_linear_infinite]" />
            <div className="absolute -top-3 -right-3">
              <Zap className="w-10 h-10 text-yellow-500 fill-yellow-500 animate-bounce" />
            </div>
            <div className="absolute -bottom-3 -left-3">
                <Wrench className="w-10 h-10 text-pink-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main Text */}
        <div className="space-y-6">
          <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
            SYSTEM <br />
            <span className="text-blue-600">UNDER MAINTAIN</span>
          </h1>
          
          <p className="text-slate-500 text-xs sm:text-base font-bold uppercase tracking-[0.4em] opacity-80">
            FINE-TUNING FOR EXCELLENCE
          </p>
        </div>

        {/* Status indicator */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span className="text-blue-500/60 font-black text-[10px] uppercase tracking-[0.3em]">
              Core Optimization in progress
            </span>
          </div>

          {!isPlaying && (
            <div className="text-slate-600 text-[9px] font-bold uppercase tracking-widest animate-pulse border border-white/5 px-4 py-2 rounded-full">
              Click anywhere to play audio 🎵
            </div>
          )}
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default MaintenancePage;
