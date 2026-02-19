import React from 'react';
import { Settings, Zap, Construction, Wrench, Clock, ShieldAlert } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background Glows - Dashboard එකේ වගේම */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]" />

      <div className="max-w-2xl w-full text-center z-10">
        
        {/* Animated Icon Section */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative bg-slate-900/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
            <Settings className="w-16 h-16 text-blue-500 animate-[spin_4s_linear_infinite]" />
            <div className="absolute -top-2 -right-2">
              <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -left-2">
                <Wrench className="w-8 h-8 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic">
            System <span className="text-blue-600">Upgrade</span> In Progress
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs">
            <Construction size={14} className="text-blue-500" />
            Establishing Secure Connection... 99%
          </div>

          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto font-medium leading-relaxed">
            We're fine-tuning the engines for a faster, more powerful experience. 
            DzD Marketing will be back online shortly. 
          </p>
        </div>

        {/* Progress Card */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
              <Clock size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase">Estimated Wait</p>
              <p className="text-sm font-bold text-white">~15 Minutes</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 bg-pink-600/20 rounded-xl flex items-center justify-center text-pink-500">
              <ShieldAlert size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase">System Status</p>
              <p className="text-sm font-bold text-white">Optimizing DB</p>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-12">
          <a 
            href="https://wa.me/your-number" 
            className="inline-flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest hover:text-blue-400 transition-colors"
          >
            Contact Support Via WhatsApp <Zap size={10} />
          </a>
        </div>

      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default MaintenancePage;
