import React, { useState } from 'react';
import { 
  Zap, 
  Smartphone, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus,
  Wallet
} from 'lucide-react';

interface WhatsAppBoostProps {
  currentUser: any;
  userBalance: any;
  WORKER_URL: string;
  fetchBalance: (uid: string) => void;
  fetchHistory: (uid: string) => void;
}

export default function WhatsAppBoostView({ 
  currentUser, 
  userBalance, 
  WORKER_URL, 
  fetchBalance,
  fetchHistory 
}: WhatsAppBoostProps) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [type, setType] = useState<'follow' | 'react'>('follow');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const BOT_API_URL = "https://akash-01-3d86d272b644.herokuapp.com/api/boost";
  const BOT_AUTH_KEY = "ZANTA_BOOST_KEY_99";

  const handleExecute = async () => {
    if (!link.includes('whatsapp.com/channel/')) {
      setStatus({ type: 'error', msg: 'INVALID_WHATSAPP_CHANNEL_LINK' });
      return;
    }

    const cost = type === 'follow' ? 35 : 5;
    const balance = parseFloat(userBalance?.total_balance || '0');

    if (balance < cost) {
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
          fetchBalance(currentUser.uid);
          fetchHistory(currentUser.uid);
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
    }
  };

  return (
    <div className="animate-fade-in pb-10 px-4 md:px-0">
      {/* Container with Scroll support */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm max-h-[85vh] overflow-y-auto">
        
        {/* Header Section with Wallet Balance */}
        <div className="px-6 md:px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1 flex items-center gap-2">
              <Smartphone size={12} /> External_Node_Injection
            </h3>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
              WhatsApp Protocol Boost
            </h2>
          </div>
          
          {/* Wallet Balance View */}
          <div className="bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center gap-3">
             <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-500">
               <Wallet size={16} />
             </div>
             <div>
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Available_Credits</p>
               <p className="text-sm font-black text-slate-900 dark:text-white">LKR {parseFloat(userBalance?.total_balance || '0').toFixed(2)}</p>
             </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Service Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setType('follow')}
              className={`relative p-5 rounded-3xl border-2 transition-all ${
                type === 'follow' 
                ? 'border-emerald-500 bg-emerald-500/5' 
                : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${type === 'follow' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                  <UserPlus size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Newsletter</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Followers Boost</p>
                  <p className="text-xs font-black text-emerald-500 mt-1">LKR 35.00</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setType('react')}
              className={`relative p-5 rounded-3xl border-2 transition-all ${
                type === 'react' 
                ? 'border-blue-500 bg-blue-500/5' 
                : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${type === 'react' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                  <Heart size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Reaction</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Mass Reactions</p>
                  <p className="text-xs font-black text-blue-500 mt-1">LKR 5.00</p>
                </div>
              </div>
            </button>
          </div>

          {/* Input Area */}
          <div className="space-y-6">
            <div className="relative group">
              <label className="absolute left-5 -top-2 px-2 bg-white dark:bg-[#111827] text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 z-10">
                Target_Protocol_URL
              </label>
              <input 
                type="text"
                placeholder={type === 'follow' ? "https://whatsapp.com/channel/XYZ" : "https://whatsapp.com/channel/XYZ/123"}
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl py-4 px-6 font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all shadow-inner"
              />
            </div>

            {/* Status Messages */}
            {status && (
              <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                status.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <p className="text-[9px] font-black uppercase tracking-widest leading-tight">{status.msg}</p>
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={loading || !link}
              className={`w-full relative py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all active:scale-[0.98] disabled:opacity-30 ${
                type === 'follow' ? 'bg-emerald-600' : 'bg-blue-600'
              } text-white shadow-xl`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 size={14} className="animate-spin" />
                  <span>SYNCHRONIZING_NODES...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>EXECUTE_STRIKE</span>
                  <ChevronRight size={14} />
                </div>
              )}
            </button>
            
            <p className="text-center text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-50 pb-4">
              * Verification required. Latency may occur during node overload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
