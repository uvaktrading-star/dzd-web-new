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
  user: any; // Dashboard එකේ වගේම 'user' ලෙස ගත්තා
  WORKER_URL: string;
  onBack?: () => void;
  fetchBalance: (uid: string) => void;
  fetchHistory: (uid: string) => void;
}

export default function WhatsAppBoostView({ 
  user, 
  WORKER_URL, 
  fetchBalance: syncMainBalance, // Main App sync එකට
  fetchHistory,
  onBack
}: WhatsAppBoostProps) {
  // --- Dashboard එකේ තියෙන State එකමයි ---
  const [userBalance, setUserBalance] = useState("0.00");
  const [loading, setLoading] = useState({
    balance: false,
    executing: false
  });
  
  const [link, setLink] = useState('');
  const [type, setType] = useState<'follow' | 'react'>('follow');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const BOT_API_URL = "https://akash-01-3d86d272b644.herokuapp.com/api/boost";
  const BOT_AUTH_KEY = "ZANTA_BOOST_KEY_99";

  // --- Dashboard එකේ 'fetchBalance' Function එක එලෙසම ---
  const fetchBalance = useCallback(async (uid: string) => {
    setLoading(prev => ({ ...prev, balance: true }));
    try {
      const response = await fetch(`${WORKER_URL}/get-balance?userId=${uid}`);
      const data = await response.json();
      setUserBalance(parseFloat(data.total_balance || 0).toFixed(2));
      
      // Main app එකේ Navbar එකත් sync කරමු
      syncMainBalance(uid); 
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  }, [WORKER_URL, syncMainBalance]);

  // --- Auto-refresh logic (Dashboard එකේ වගේම) ---
  useEffect(() => {
    if (user?.uid) {
      fetchBalance(user.uid);
      // Auto-refresh balance every 30 seconds
      const balanceInterval = setInterval(() => fetchBalance(user.uid), 30000);
      return () => clearInterval(balanceInterval);
    }
  }, [user, fetchBalance]);

  const handleExecute = async () => {
    if (!link.includes('whatsapp.com/channel/')) {
      setStatus({ type: 'error', msg: 'INVALID_WHATSAPP_CHANNEL_LINK' });
      return;
    }

    const cost = type === 'follow' ? 35 : 5;
    const currentBal = parseFloat(userBalance);

    if (currentBal < cost) {
      setStatus({ type: 'error', msg: 'INSUFFICIENT_CREDITS_IN_CORE' });
      return;
    }

    setLoading(prev => ({ ...prev, executing: true }));
    setStatus(null);

    try {
      const deductRes = await fetch(`${WORKER_URL}/deduct-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          amount: cost,
          service: `WhatsApp ${type === 'follow' ? 'Followers' : 'Reactions'}`
        })
      });

      const deductData = await deductRes.json();

      if (deductRes.ok && deductData.success) {
        // සල්ලි කැපුන ගමන්ම නැවත Balance එක sync කරනවා
        fetchBalance(user.uid);
        fetchHistory(user.uid);

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
      setLoading(prev => ({ ...prev, executing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-24 pb-12 px-4 animate-fade-in transition-colors duration-500">
      <div className="max-w-xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button 
            onClick={onBack}
            className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">WhatsApp Boost</h1>
            <p className="text-[10px] font-bold text-emerald-500 tracking-[0.2em] uppercase">Deployment Node</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/60 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Balance Banner - Dashboard එකේ විදියටමයි */}
          <div className="px-8 py-7 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-0.5">
                  Available Balance
                </p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                  LKR {userBalance}
                </h3>
              </div>
            </div>

            <span className="text-[8px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg uppercase tracking-[0.15em]">
              {loading.balance ? 'Syncing...' : 'Live Sync'}
            </span>
          </div>

          <div className="p-8 space-y-8">
            {/* Service Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Operation_Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => { setType('follow'); setStatus(null); }}
                  className={`relative p-5 rounded-[2rem] border-2 transition-all active:scale-[0.97] ${
                    type === 'follow' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent'
                  }`}
                >
                  <UserPlus className={`mb-3 ${type === 'follow' ? 'text-emerald-500' : 'text-slate-400'}`} size={24} />
                  <p className="font-black text-slate-900 dark:text-white text-sm">Followers</p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-wider">LKR 35.00</p>
                </button>

                <button 
                  onClick={() => { setType('react'); setStatus(null); }}
                  className={`relative p-5 rounded-[2rem] border-2 transition-all active:scale-[0.97] ${
                    type === 'react' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent'
                  }`}
                >
                  <Heart className={`mb-3 ${type === 'react' ? 'text-blue-500' : 'text-slate-400'}`} size={24} />
                  <p className="font-black text-slate-900 dark:text-white text-sm">Reactions</p>
                  <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-wider">LKR 5.00</p>
                </button>
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Channel_Protocol_Link</label>
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
              <div className={`flex items-center gap-4 p-5 rounded-[1.5rem] border animate-in slide-in-from-bottom-2 ${
                status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="text-xs font-black uppercase tracking-widest">{status.msg}</p>
              </div>
            )}

            {/* Execute Button */}
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
                  <span>Deploying...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Execute Strike</span>
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
