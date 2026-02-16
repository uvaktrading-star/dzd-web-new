import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus,
  ArrowLeft,
  Wallet,
  Zap
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
  const [selectedEmoji, setSelectedEmoji] = useState("❤️"); // Default emoji
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const BOT_API_URL = "https://akash-01-3d86d272b644.herokuapp.com/api/boost";
  const BOT_AUTH_KEY = "ZANTA_BOOST_KEY_99";
  const availableEmojis = ["❤️", "🔥", "👍", "✨", "💙", "😂", "💯", "✅"];

  const cleanBaseUrl = WORKER_URL?.replace(/\/$/, "");

  const refreshBalance = useCallback(async (uid: string) => {
    if (!uid || !cleanBaseUrl) return;
    setLoading(prev => ({ ...prev, balance: true }));
    try {
      const response = await fetch(`${cleanBaseUrl}/get-balance?userId=${uid}`);
      const data = await response.json();
      const currentBal = parseFloat(data.total_balance || 0).toFixed(2);
      setTotalBalance(currentBal);
      syncAppBalance(uid);
    } catch (error) {
      console.error("Balance sync error:", error);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  }, [cleanBaseUrl, syncAppBalance]);

  useEffect(() => {
    if (user?.uid) {
      refreshBalance(user.uid);
      const interval = setInterval(() => refreshBalance(user.uid), 15000);
      return () => clearInterval(interval);
    }
  }, [user?.uid, refreshBalance]);

  const handleExecute = async () => {
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
      // 1. මුලින්ම සල්ලි කපනවා (Database Update)
      const deductRes = await fetch(`${cleanBaseUrl}/deduct-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          amount: cost,
          description: `WA ${type} Boost: ${selectedEmoji}`
        })
      });

      const deductData = await deductRes.json();

      if (!deductRes.ok || !deductData.success) {
        throw new Error(deductData.error || "TRANSACTION FAILED");
      }

      // සල්ලි කැපුන ගමන් Balance එක UI එකේ update කරනවා
      setTotalBalance(parseFloat(deductData.newBalance).toFixed(2));
      syncAppBalance(user.uid);

      // 2. සල්ලි කැපීම සාර්ථක නම් විතරක් Bot එකට Signal එක යවනවා
      const botRes = await fetch(BOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: BOT_AUTH_KEY,
          type: type,
          link: link.trim(),
          emojis: type === 'react' ? [selectedEmoji] : ["✅"] // Reaction එකක් නම් තෝරපු emoji එක යවනවා
        })
      });

      const botData = await botRes.json();

      if (botRes.ok && botData.success) {
        setStatus({ type: 'success', msg: 'STRIKE DEPLOYED SUCCESSFULLY!' });
        setLink(''); 
      } else {
        setStatus({ type: 'error', msg: 'SIGNAL DELAYED. CREDITS DEDUCTED. CONTACT SUPPORT.' });
      }

    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || "SYSTEM ERROR" });
    } finally {
      setLoading(prev => ({ ...prev, executing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-20 pb-12 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:scale-105 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 italic tracking-tighter uppercase">ZANTA STRIKE</h1>
            <p className="text-[9px] font-bold text-slate-400 tracking-[0.3em] uppercase">WhatsApp Automation V2</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/60 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Balance Card - Now with Gradient */}
          <div className="p-1">
            <div className="px-8 py-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.3rem] text-white shadow-xl relative overflow-hidden">
               <Zap className="absolute right-[-10px] top-[-10px] w-32 h-32 opacity-10 rotate-12" />
               <div className="relative z-10 flex justify-between items-end">
                 <div>
                   <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Available Credits</p>
                   <h3 className="text-3xl font-black tracking-tight tabular-nums">LKR {totalBalance}</h3>
                 </div>
                 <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${loading.balance ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{loading.balance ? 'Syncing' : 'Verified'}</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Service Type */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Choose_Operation</label>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setType('follow')} className={`p-5 rounded-3xl border-2 transition-all ${type === 'follow' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5 opacity-40 grayscale'}`}>
                  <UserPlus className={`mb-2 ${type === 'follow' ? 'text-emerald-500' : ''}`} size={24} />
                  <p className="font-black text-sm dark:text-white">Followers</p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase">LKR 35.00</p>
                </button>
                <button onClick={() => setType('react')} className={`p-5 rounded-3xl border-2 transition-all ${type === 'react' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 opacity-40 grayscale'}`}>
                  <Heart className={`mb-2 ${type === 'react' ? 'text-blue-500' : ''}`} size={24} />
                  <p className="font-black text-sm dark:text-white">Reactions</p>
                  <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase">LKR 5.00</p>
                </button>
              </div>
            </div>

            {/* Emoji Selector - Only shows for Reactions */}
            {type === 'react' && (
               <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Select_Reaction</label>
                  <div className="flex flex-wrap gap-2">
                    {availableEmojis.map(emoji => (
                      <button 
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-11 h-11 flex items-center justify-center rounded-2xl text-xl transition-all ${selectedEmoji === emoji ? 'bg-blue-500 scale-110 shadow-lg shadow-blue-500/40' : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
               </div>
            )}

            {/* Link Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Channel_Endpoint</label>
              <input 
                type="text"
                placeholder="https://whatsapp.com/channel/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl py-5 px-6 font-bold text-sm dark:text-white outline-none focus:ring-4 ring-blue-500/10 transition-all"
              />
            </div>

            {/* Status Alert */}
            {status && (
              <div className={`flex items-start gap-4 p-5 rounded-2xl border animate-in zoom-in duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p className="text-[10px] font-black uppercase tracking-widest">{status.msg}</p>
              </div>
            )}

            {/* Launch Button */}
            <button
              onClick={handleExecute}
              disabled={loading.executing || !link}
              className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-[0.98] disabled:opacity-20 text-white shadow-2xl relative overflow-hidden ${
                type === 'follow' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
            >
              {loading.executing ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="animate-pulse">DEPLOING STRIKE...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>INITIATE PROTOCOL</span>
                  <ChevronRight size={18} />
                </div>
              )}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
          Warning: Unauthorized access to endpoints is logged.<br/>Strike delivery: 5-15 Minutes.
        </p>
      </div>
    </div>
  );
}
