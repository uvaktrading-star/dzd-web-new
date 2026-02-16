import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus,
  ArrowLeft,
  Wallet
} from 'lucide-react';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

interface WhatsAppBoostProps {
  user: any; 
  onBack?: () => void;
  fetchBalance: (uid: string) => void; 
}

export default function WhatsAppBoostView({ 
  user, 
  fetchBalance: syncAppBalance, 
  onBack 
}: WhatsAppBoostProps) {
  
  const [totalBalance, setTotalBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState({
    balance: false,
    executing: false
  });
  
  const [link, setLink] = useState('');
  const [type, setType] = useState<'follow' | 'react'>('follow');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const BOT_API_URL = "https://akash-01-3d86d272b644.herokuapp.com/api/boost";
  const BOT_AUTH_KEY = "ZANTA_BOOST_KEY_99";

  const cleanBaseUrl = WORKER_URL?.replace(/\/$/, "");

  // --- Balance එක Fetch කරන Function එක ---
  const refreshBalance = useCallback(async (uid: string) => {
    if (!uid || !cleanBaseUrl) return;
    
    setLoading(prev => ({ ...prev, balance: true }));
    try {
      const response = await fetch(`${cleanBaseUrl}/get-balance?userId=${uid}`);
      const data = await response.json();
      const currentBal = parseFloat(data.total_balance || 0).toFixed(2);
      
      setTotalBalance(currentBal);
      syncAppBalance(uid); // Global App State එක Sync කිරීම
    } catch (error) {
      console.error("Balance sync error:", error);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  }, [cleanBaseUrl, syncAppBalance]);

  // පේජ් එකට ආපු ගමන් සහ සෑම තත්පර 15කටම වරක් balance refresh කිරීම
  useEffect(() => {
    if (user?.uid) {
      refreshBalance(user.uid);
      const interval = setInterval(() => refreshBalance(user.uid), 15000);
      return () => clearInterval(interval);
    }
  }, [user?.uid, refreshBalance]);

  const handleExecute = async () => {
    // 1. Validation
    if (!link.includes('whatsapp.com/channel/')) {
      setStatus({ type: 'error', msg: 'INVALID WHATSAPP LINK' });
      return;
    }

    const cost = type === 'follow' ? 35 : 5;
    const currentBal = parseFloat(totalBalance);

    if (currentBal < cost) {
      setStatus({ type: 'error', msg: 'INSUFFICIENT BALANCE' });
      return;
    }

    setLoading(prev => ({ ...prev, executing: true }));
    setStatus(null);

    try {
      // 2. සල්ලි කැපීම (Deduct Balance)
      const deductRes = await fetch(`${cleanBaseUrl}/deduct-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          amount: cost,
          description: `WhatsApp ${type} boost`
        })
      });

      const deductData = await deductRes.json();

      if (!deductRes.ok || !deductData.success) {
        throw new Error(deductData.error || "TRANSACTION FAILED");
      }

      // සල්ලි කැපුන වහාම UI එක Update කිරීම
      setTotalBalance(parseFloat(deductData.newBalance).toFixed(2));
      syncAppBalance(user.uid);

      // 3. Bot එකට Signal එක යැවීම
      const botRes = await fetch(BOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: BOT_AUTH_KEY,
          type: type,
          link: link.trim(),
          emojis: ["❤️", "🔥", "👍", "✨", "💙"]
        })
      });

      const botData = await botRes.json();

      if (botRes.ok && botData.success) {
        setStatus({ type: 'success', msg: 'STRIKE DEPLOYED SUCCESSFULLY' });
        setLink(''); // Input එක clear කිරීම
      } else {
        // සල්ලි කැපිලා Bot එකේ අවුලක් නම් මේක පෙන්නනවා
        setStatus({ type: 'error', msg: 'SIGNAL DELAYED. CONTACT SUPPORT' });
      }

    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || "SYSTEM ERROR" });
    } finally {
      setLoading(prev => ({ ...prev, executing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-24 pb-12 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button 
            onClick={onBack} 
            className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">ZANTA STRIKE</h1>
            <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">WhatsApp Automation Node</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/60 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Wallet Status Card */}
          <div className="px-8 py-7 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-0.5">Wallet Credits</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                  LKR {totalBalance}
                </h3>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${loading.balance ? 'bg-blue-500/5 border-blue-500/10' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
               <div className={`w-1.5 h-1.5 rounded-full ${loading.balance ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
               <span className={`text-[8px] font-black uppercase tracking-widest ${loading.balance ? 'text-blue-500' : 'text-emerald-500'}`}>
                  {loading.balance ? 'Syncing' : 'Live'}
               </span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Strike Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-mono">Select_Protocol</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setType('follow')}
                  className={`relative p-5 rounded-[2rem] border-2 transition-all duration-300 ${type === 'follow' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5 opacity-40 grayscale hover:grayscale-0'}`}
                >
                  <UserPlus className={`mb-2 ${type === 'follow' ? 'text-emerald-500' : 'text-slate-400'}`} size={24} />
                  <p className="font-black text-slate-900 dark:text-white text-[13px]">Followers</p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase">LKR 35.00</p>
                  {type === 'follow' && <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
                </button>

                <button 
                  onClick={() => setType('react')}
                  className={`relative p-5 rounded-[2rem] border-2 transition-all duration-300 ${type === 'react' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 opacity-40 grayscale hover:grayscale-0'}`}
                >
                  <Heart className={`mb-2 ${type === 'react' ? 'text-blue-500' : 'text-slate-400'}`} size={24} />
                  <p className="font-black text-slate-900 dark:text-white text-[13px]">Reactions</p>
                  <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase">LKR 5.00</p>
                  {type === 'react' && <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full animate-ping" />}
                </button>
              </div>
            </div>

            {/* Link Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-mono">Target_Endpoint</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Paste WhatsApp channel link..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-[1.5rem] py-5 px-6 font-bold text-sm text-slate-900 dark:text-white outline-none focus:ring-4 ring-blue-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Status Feedback */}
            {status && (
              <div className={`flex items-start gap-4 p-5 rounded-[1.5rem] border animate-in fade-in zoom-in duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                {status.type === 'success' ? <CheckCircle2 className="shrink-0" size={18} /> : <AlertCircle className="shrink-0" size={18} />}
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{status.msg}</p>
              </div>
            )}

            {/* Execution Button */}
            <button
              onClick={handleExecute}
              disabled={loading.executing || !link}
              className={`w-full py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-[0.98] disabled:opacity-20 text-white shadow-2xl relative overflow-hidden ${
                type === 'follow' ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-blue-600 shadow-blue-600/30'
              }`}
            >
              {loading.executing ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="animate-pulse">TRANSMITTING...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>DEPLOY STRIKE</span>
                  <ChevronRight size={18} />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Info Note */}
        <p className="mt-8 text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Automated processing. Strike will be delivered within 5-10 minutes.
        </p>
      </div>
    </div>
  );
}
