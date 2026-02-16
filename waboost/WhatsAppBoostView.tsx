import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Zap, 
  Smartphone, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus,
  Wallet,
  X 
} from 'lucide-react';

interface WhatsAppBoostProps {
  currentUser: any;
  userBalance: any;
  WORKER_URL: string;
  fetchBalance: (uid: string) => void;
  fetchHistory: (uid: string) => void;
  onClose?: () => void;
}

export default function WhatsAppBoostView({ 
  currentUser, 
  userBalance, 
  WORKER_URL, 
  fetchBalance,
  fetchHistory,
  onClose
}: WhatsAppBoostProps) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [type, setType] = useState<'follow' | 'react'>('follow');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [liveBalance, setLiveBalance] = useState("0.00");
  
  // Interval එක handle කරන්න ref එකක්
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const BOT_API_URL = "https://akash-01-3d86d272b644.herokuapp.com/api/boost";
  const BOT_AUTH_KEY = "ZANTA_BOOST_KEY_99";

  // --- 1. Data Refresh Logic ---
  const refreshUserData = useCallback(() => {
    if (currentUser?.uid) {
      // Parent එකේ තියෙන functions හරහා අලුත් data fetch කරනවා
      fetchBalance(currentUser.uid);
      fetchHistory(currentUser.uid);
    }
  }, [currentUser, fetchBalance, fetchHistory]);

  // --- 2. Auto Polling Logic (සෑම තත්පර 30කටම) ---
  useEffect(() => {
    // Component එක load වෙද්දී මුලින්ම refresh කරනවා
    refreshUserData();

    // සෑම තත්පර 30කට වරක්ම refreshUserData function එක run කරනවා
    pollingInterval.current = setInterval(() => {
      console.log("Auto-syncing balance..."); // Debugging සඳහා
      refreshUserData();
    }, 30000); // 30 Seconds

    // Component එක වැසූ විට (Unmount) interval එක නතර කරනවා
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [refreshUserData]);

  // --- 3. Sync UI with Prop Changes ---
  useEffect(() => {
    if (userBalance?.total_balance !== undefined) {
      setLiveBalance(parseFloat(userBalance.total_balance).toFixed(2));
    }
  }, [userBalance]);

  const handleExecute = async () => {
    if (!link.includes('whatsapp.com/channel/')) {
      setStatus({ type: 'error', msg: 'INVALID_WHATSAPP_CHANNEL_LINK' });
      return;
    }

    const cost = type === 'follow' ? 35 : 5;
    const currentBal = parseFloat(liveBalance);

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
        // සල්ලි කැපුන ගමන් වහාම fetch කරනවා (තත්පර 30ක් ඉන්න ඕන නෑ)
        refreshUserData();

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
          setStatus({ 
            type: 'success', 
            msg: `NODE_INJECTED: ${type.toUpperCase()} SIGNAL SENT!` 
          });
          setLink('');
        } else {
          setStatus({ 
            type: 'error', 
            msg: `BOT_REJECTED: ${botData.message || 'UNKNOWN_ERROR'}` 
          });
        }
      } else {
        throw new Error(deductData.error || "BALANCE_DEDUCTION_FAILED");
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || "PROTOCOL_FAULT" });
    } finally {
      setLoading(false);
      refreshUserData(); // අවසානයේත් refresh කරනවා
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-red-500 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1 flex items-center gap-2">
                  <Smartphone size={12} /> External_Node
                </h3>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                  WA Protocol
                </h2>
              </div>
              
              <div className="flex flex-col items-end mr-8">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Available_Credits</span>
                <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 px-3 py-1 rounded-full shadow-sm">
                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                   <span className="text-xs font-black text-blue-600 tracking-tight">LKR {liveBalance}</span>
                </div>
              </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => { setType('follow'); setStatus(null); }}
              className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${
                type === 'follow' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
              }`}
            >
              <div className={`p-3 rounded-2xl ${type === 'follow' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                <UserPlus size={18} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Newsletter</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Followers Boost</p>
                <p className="text-xs font-black text-emerald-500 mt-0.5">LKR 35.00</p>
              </div>
            </button>

            <button 
              onClick={() => { setType('react'); setStatus(null); }}
              className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${
                type === 'react' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
              }`}
            >
              <div className={`p-3 rounded-2xl ${type === 'react' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                <Heart size={18} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Reaction</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Mass Reactions</p>
                <p className="text-xs font-black text-blue-500 mt-0.5">LKR 5.00</p>
              </div>
            </button>
          </div>

          <div className="relative group">
            <label className="absolute left-5 -top-2 px-2 bg-white dark:bg-[#0f172a] text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 z-10">
              Target_Protocol_URL
            </label>
            <input 
              type="text"
              placeholder="https://whatsapp.com/channel/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl py-4 px-6 font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all shadow-inner"
            />
          </div>

          {status && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl border animate-in slide-in-from-top-2 duration-300 ${
              status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <p className="text-[9px] font-black uppercase tracking-widest">{status.msg}</p>
            </div>
          )}

          <button
            onClick={handleExecute}
            disabled={loading || !link}
            className={`w-full relative py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all active:scale-[0.98] disabled:opacity-30 ${
              type === 'follow' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-blue-600 shadow-blue-600/20'
            } text-white shadow-xl hover:brightness-110`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 size={14} className="animate-spin" />
                <span>INJECTING_SIGNAL...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>EXECUTE_STRIKE</span>
                <ChevronRight size={14} />
              </div>
            )}
          </button>
          
          <p className="text-center text-[7px] font-bold text-slate-400 uppercase tracking-widest opacity-50">
            * Protocol connection auto-syncs every 30s.
          </p>
        </div>
      </div>
    </div>
  );
}
