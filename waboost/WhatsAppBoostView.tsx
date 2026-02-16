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

// API URL එක මෙතන hardcode කළා (අන්තිමට slash එකක් නැතුව)
const HARDCODED_WORKER_URL = "https://dzd-billing-api.sitewasd2026.workers.dev";

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

  // --- 1. Balance එක ගෙන ඒමේ නිවැරදි ක්‍රමය ---
  const refreshBalance = useCallback(async (uid: string) => {
    if (!uid || uid === "null") return;
    
    setLoading(prev => ({ ...prev, balance: true }));
    try {
      // මෙතන URL එක හදන්නේ slash එකක් නැති බව තහවුරු කරගෙනයි
      const response = await fetch(`${HARDCODED_WORKER_URL}/get-balance?userId=${uid}`);
      if (!response.ok) throw new Error("API_OFFLINE");
      
      const data = await response.json();
      const currentBal = parseFloat(data.total_balance || 0).toFixed(2);
      
      setTotalBalance(currentBal);
      syncAppBalance(uid); // Main Navbar එකත් update කරනවා
    } catch (error) {
      console.error("Balance fetch error:", error);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  }, [syncAppBalance]);

  // Page එක load වන විට සහ තත්පර 15න් 15ට balance එක check කිරීම
  useEffect(() => {
    if (user?.uid) {
      refreshBalance(user.uid);
      const interval = setInterval(() => refreshBalance(user.uid), 15000);
      return () => clearInterval(interval);
    }
  }, [user?.uid, refreshBalance]);

  // --- 2. Order එක Execute කිරීම ---
  const handleExecute = async () => {
    if (!link.includes('whatsapp.com')) {
      setStatus({ type: 'error', msg: 'INVALID_LINK_FORMAT' });
      return;
    }

    const cost = type === 'follow' ? 35 : 5;
    const currentBal = parseFloat(totalBalance);

    if (currentBal < cost) {
      setStatus({ type: 'error', msg: 'INSUFFICIENT_FUNDS' });
      return;
    }

    setLoading(prev => ({ ...prev, executing: true }));
    setStatus(null);

    try {
      // A. සල්ලි කැපීම
      const deductRes = await fetch(`${HARDCODED_WORKER_URL}/deduct-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          amount: cost
        })
      });

      const deductData = await deductRes.json();

      if (deductRes.ok && deductData.success) {
        // --- වැදගත්ම දේ: Worker එකෙන් ආපු අලුත් balance එක වහාම screen එකට දැමීම ---
        setTotalBalance(parseFloat(deductData.newBalance).toFixed(2));
        syncAppBalance(user.uid);

        // B. Bot එකට signal යැවීම
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
          setStatus({ type: 'success', msg: `STRIKE_DEPLOYED: ${type.toUpperCase()} SUCCESS` });
          setLink('');
        } else {
          setStatus({ type: 'error', msg: `BOT_TIMEOUT: BUT_BALANCE_DEDUCTED` });
        }
      } else {
        throw new Error(deductData.error || "API_REJECTED_TRANSACTION");
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: `CRITICAL: ${err.message}` });
    } finally {
      setLoading(prev => ({ ...prev, executing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-24 pb-12 px-4 animate-fade-in transition-colors">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button onClick={onBack} className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-all active:scale-95 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">ZANTA STRIKE</h1>
            <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">Deployment Protocol</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/60 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Real-time Wallet Section */}
          <div className="px-8 py-7 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-0.5">Live Balance</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                  LKR {totalBalance}
                </h3>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${loading.balance ? 'border-blue-500/20 bg-blue-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${loading.balance ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className={`text-[8px] font-black uppercase tracking-widest ${loading.balance ? 'text-blue-500' : 'text-emerald-500'}`}>
                {loading.balance ? 'Syncing' : 'Node_Online'}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Service Type */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Strike_Configuration</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setType('follow')}
                  className={`p-5 rounded-[2rem] border-2 transition-all ${type === 'follow' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent opacity-50 hover:opacity-100'}`}
                >
                  <UserPlus className={`mb-2 ${type === 'follow' ? 'text-emerald-500' : 'text-slate-400'}`} size={20} />
                  <p className="font-black text-slate-900 dark:text-white text-[12px]">Followers</p>
                  <p className="text-[9px] font-bold text-emerald-500 mt-1 italic">LKR 35.00</p>
                </button>

                <button 
                  onClick={() => setType('react')}
                  className={`p-5 rounded-[2rem] border-2 transition-all ${type === 'react' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent opacity-50 hover:opacity-100'}`}
                >
                  <Heart className={`mb-2 ${type === 'react' ? 'text-blue-500' : 'text-slate-400'}`} size={20} />
                  <p className="font-black text-slate-900 dark:text-white text-[12px]">Reactions</p>
                  <p className="text-[9px] font-bold text-blue-500 mt-1 italic">LKR 5.00</p>
                </button>
              </div>
            </div>

            {/* Input Link */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Target_Endpoint_URL</label>
              <input 
                type="text"
                placeholder="https://whatsapp.com/channel/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-[1.5rem] py-5 px-6 font-bold text-sm text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-500/20 transition-all"
              />
            </div>

            {/* Status */}
            {status && (
              <div className={`flex items-center gap-4 p-5 rounded-[1.5rem] border animate-in slide-in-from-bottom-2 duration-300 ${
                status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p className="text-[10px] font-black uppercase tracking-widest">{status.msg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleExecute}
              disabled={loading.executing || !link}
              className={`w-full relative py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-[0.98] disabled:opacity-20 ${
                type === 'follow' ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-blue-600 shadow-blue-600/30'
              } text-white shadow-2xl hover:brightness-110`}
            >
              {loading.executing ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Transmitting...</span>
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
      </div>
    </div>
  );
}
