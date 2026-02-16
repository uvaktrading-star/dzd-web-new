import React, { useState, useEffect, useCallback } from 'react';
import { 
  Smartphone, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus,
  ArrowLeft
} from 'lucide-react';

interface WhatsAppBoostProps {
  currentUser: any;
  WORKER_URL: string;
  onBack?: () => void; // Page එකෙන් අයින් වෙන්න (Back button)
  fetchBalance: (uid: string) => void;
  fetchHistory: (uid: string) => void;
}

export default function WhatsAppBoostView({ 
  currentUser, 
  WORKER_URL, 
  fetchBalance,
  fetchHistory,
  onBack
}: WhatsAppBoostProps) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [type, setType] = useState<'follow' | 'react'>('follow');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [navBalance, setNavBalance] = useState("0.00");

  const BOT_API_URL = "https://akash-01-3d86d272b644.herokuapp.com/api/boost";
  const BOT_AUTH_KEY = "ZANTA_BOOST_KEY_99";

  // --- 1. Polling Logic (Navbar එකේ වගේම) ---
  const fetchLiveStats = useCallback(async (uid: string) => {
    try {
      const response = await fetch(`${WORKER_URL}/get-balance?userId=${uid}`);
      const data = await response.json();
      setNavBalance(parseFloat(data.total_balance || 0).toFixed(2));
      fetchBalance(uid); 
    } catch (error) {
      console.error("WhatsAppBoost sync error:", error);
    }
  }, [WORKER_URL, fetchBalance]);

  useEffect(() => {
    if (currentUser?.uid) {
      fetchLiveStats(currentUser.uid);
      const interval = setInterval(() => fetchLiveStats(currentUser.uid), 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser, fetchLiveStats]);

  const handleExecute = async () => {
    if (!link.includes('whatsapp.com/channel/')) {
      setStatus({ type: 'error', msg: 'INVALID_WHATSAPP_CHANNEL_LINK' });
      return;
    }

    const cost = type === 'follow' ? 35 : 5;
    const currentBal = parseFloat(navBalance);

    if (currentBal < cost) {
      setStatus({ type: 'error', msg: 'INSUFFICIENT_CREDITS_IN_CORE' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const deductRes = await fetch(`${WORKER_URL}/deduct-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.uid,
          amount: cost,
          service: `WhatsApp ${type === 'follow' ? 'Followers' : 'Reactions'}`
        })
      });

      const deductData = await deductRes.json();

      if (deductRes.ok && deductData.success) {
        fetchLiveStats(currentUser.uid);
        fetchHistory(currentUser.uid);

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
          setStatus({ type: 'success', msg: `NODE_INJECTED: ${type.toUpperCase()} SIGNAL SENT!` });
          setLink('');
        } else {
          setStatus({ type: 'error', msg: `BOT_REJECTED: ${botData.message || 'UNKNOWN_ERROR'}` });
        }
      } else {
        throw new Error(deductData.error || "BALANCE_DEDUCTION_FAILED");
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || "PROTOCOL_FAULT" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-24 pb-12 px-4 transition-colors duration-500">
      <div className="max-w-xl mx-auto">
        
        {/* Page Navigation & Title */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button 
            onClick={onBack}
            className="p-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">WhatsApp Boost</h1>
            <p className="text-[10px] font-bold text-emerald-500 tracking-[0.2em] uppercase">Protocol Node v2.0</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/60 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Top Wallet Banner */}
          <div className="px-8 py-6 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                <Smartphone size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active_Node</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">WA_STRIKE_SYSTEM</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Live_Balance</p>
              <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm font-black text-blue-600">LKR {navBalance}</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Service Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Select_Operation</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => { setType('follow'); setStatus(null); }}
                  className={`relative overflow-hidden group p-5 rounded-[2rem] border-2 transition-all ${
                    type === 'follow' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5'
                  }`}
                >
                  <UserPlus className={`mb-3 ${type === 'follow' ? 'text-emerald-500' : 'text-slate-400'}`} size={24} />
                  <p className="font-black text-slate-900 dark:text-white text-sm">Followers</p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-1">LKR 35.00</p>
                </button>

                <button 
                  onClick={() => { setType('react'); setStatus(null); }}
                  className={`relative overflow-hidden group p-5 rounded-[2rem] border-2 transition-all ${
                    type === 'react' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5'
                  }`}
                >
                  <Heart className={`mb-3 ${type === 'react' ? 'text-blue-500' : 'text-slate-400'}`} size={24} />
                  <p className="font-black text-slate-900 dark:text-white text-sm">Reactions</p>
                  <p className="text-[10px] font-bold text-blue-500 mt-1">LKR 5.00</p>
                </button>
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Channel_Endpoint_URL</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="https://whatsapp.com/channel/..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-[1.5rem] py-5 px-6 font-bold text-sm text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-500/20 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Status Display */}
            {status && (
              <div className={`flex items-center gap-4 p-5 rounded-[1.5rem] border ${
                status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
              } animate-in fade-in slide-in-from-bottom-2`}>
                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="text-xs font-black uppercase tracking-widest">{status.msg}</p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleExecute}
              disabled={loading || !link}
              className={`w-full relative py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-[0.98] disabled:opacity-20 ${
                type === 'follow' ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-blue-600 shadow-blue-600/30'
              } text-white shadow-2xl hover:brightness-110`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Start Strike</span>
                  <ChevronRight size={18} />
                </div>
              )}
            </button>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
              <p className="text-center text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                * Real-time balance synchronization active. <br/>
                * Double check URL before execution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
