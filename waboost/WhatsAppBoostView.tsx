import React, { useState, useEffect, useCallback } from 'react';
import { 
  Smartphone, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus,
  ArrowLeft,
  Wallet
} from 'lucide-react';

interface WhatsAppBoostProps {
  user: any; 
  WORKER_URL: string;
  onBack?: () => void;
  fetchBalance: (uid: string) => void; 
}

export default function WhatsAppBoostView({ 
  user, 
  WORKER_URL, 
  fetchBalance: syncAppBalance, // Main Navbar sync එක සඳහා
  onBack
}: WhatsAppBoostProps) {
  
  // Worker එකේ data structure එකට අනුව "0.00" ලෙස ආරම්භ කළා
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

  // --- Worker එකෙන් Balance එක ගෙන ඒම ---
  const refreshBalance = useCallback(async (uid: string) => {
    if (!uid) return;
    setLoading(prev => ({ ...prev, balance: true }));
    try {
      const response = await fetch(`${WORKER_URL}/get-balance?userId=${uid}`);
      const data = await response.json();
      
      // Worker එකේ එවන්නේ total_balance නිසා එය set කරන්න
      const currentBal = parseFloat(data.total_balance || 0).toFixed(2);
      setTotalBalance(currentBal);
      
      // App එකේ අනෙක් තැන්වලටත් (Navbar) දැනුම් දීම
      syncAppBalance(uid);
    } catch (error) {
      console.error("Balance fetch error:", error);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  }, [WORKER_URL, syncAppBalance]);

  // පළමු වතාවට සහ සෑම තත්පර 30කට වරක්ම update කිරීම
  useEffect(() => {
    if (user?.uid) {
      refreshBalance(user.uid);
      const interval = setInterval(() => refreshBalance(user.uid), 30000);
      return () => clearInterval(interval);
    }
  }, [user?.uid, refreshBalance]);

  const handleExecute = async () => {
    // 1. Link Validation
    if (!link.includes('whatsapp.com/channel/')) {
      setStatus({ type: 'error', msg: 'INVALID_WHATSAPP_LINK_PROTOCOL' });
      return;
    }

    const cost = type === 'follow' ? 35 : 5;
    const currentBal = parseFloat(totalBalance);

    // 2. Local Balance Check
    if (currentBal < cost) {
      setStatus({ type: 'error', msg: 'INSUFFICIENT_FUNDS_IN_NODE' });
      return;
    }

    setLoading(prev => ({ ...prev, executing: true }));
    setStatus(null);

    try {
      // 3. Worker එකෙන් සල්ලි කැපීම
      const deductRes = await fetch(`${WORKER_URL}/deduct-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          amount: cost
        })
      });

      const deductData = await deductRes.json();

      if (deductRes.ok && deductData.success) {
        // --- වැදගත්ම කොටස: සල්ලි කැපුන ගමන්ම Worker එක දුන්න අලුත් balance එක screen එකට දැමීම ---
        setTotalBalance(parseFloat(deductData.newBalance).toFixed(2));
        syncAppBalance(user.uid);

        // 4. Bot එකට Signal එක යැවීම
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
          setStatus({ type: 'success', msg: `SYNC_COMPLETE: ${type.toUpperCase()} DEPLOYED` });
          setLink('');
        } else {
          // Bot එක fail වුනත් සල්ලි කැපී අවසානයි (Worker එකේ code එක අනුව)
          setStatus({ type: 'error', msg: `NODE_ERROR: ${botData.message || 'BOT_RESPONSE_FAILED'}` });
        }
      } else {
        throw new Error(deductData.error || "GATEWAY_DEDUCTION_FAILED");
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: `CRITICAL_ERROR: ${err.message}` });
    } finally {
      setLoading(prev => ({ ...prev, executing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-24 pb-12 px-4 animate-fade-in transition-colors">
      <div className="max-w-xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button onClick={onBack} className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-all shadow-sm active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">ZANTA STRIKE</h1>
            <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">WhatsApp Injection Node</p>
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
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-0.5">Wallet Balance</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                  LKR {totalBalance}
                </h3>
              </div>
            </div>
            <span className={`text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.15em] transition-all ${
              loading.balance ? 'bg-blue-500/10 text-blue-500 animate-pulse' : 'bg-emerald-500/10 text-emerald-500'
            }`}>
              {loading.balance ? 'Syncing...' : 'Live Node'}
            </span>
          </div>

          <div className="p-8 space-y-8">
            {/* Service Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Strike_Target_Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setType('follow')}
                  className={`p-5 rounded-[2rem] border-2 transition-all ${type === 'follow' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent opacity-60'}`}
                >
                  <UserPlus className={`mb-2 ${type === 'follow' ? 'text-emerald-500' : 'text-slate-400'}`} size={20} />
                  <p className="font-black text-slate-900 dark:text-white text-[12px]">Followers</p>
                  <p className="text-[9px] font-bold text-emerald-500 mt-1 uppercase italic">LKR 35.00</p>
                </button>

                <button 
                  onClick={() => setType('react')}
                  className={`p-5 rounded-[2rem] border-2 transition-all ${type === 'react' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent opacity-60'}`}
                >
                  <Heart className={`mb-2 ${type === 'react' ? 'text-blue-500' : 'text-slate-400'}`} size={20} />
                  <p className="font-black text-slate-900 dark:text-white text-[12px]">Reactions</p>
                  <p className="text-[9px] font-bold text-blue-500 mt-1 uppercase italic">LKR 5.00</p>
                </button>
              </div>
            </div>

            {/* Target Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Channel_Endpoint_URL</label>
              <input 
                type="text"
                placeholder="https://whatsapp.com/channel/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-[1.5rem] py-5 px-6 font-bold text-sm text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-500/20 transition-all"
              />
            </div>

            {/* Status Feedback */}
            {status && (
              <div className={`flex items-center gap-4 p-5 rounded-[1.5rem] border animate-in slide-in-from-bottom-2 duration-300 ${
                status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p className="text-[10px] font-black uppercase tracking-widest">{status.msg}</p>
              </div>
            )}

            {/* Execute Strike Button */}
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
