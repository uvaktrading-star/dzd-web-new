import React, { useState } from 'react';
import { 
  Zap, 
  Smartphone, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus
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

  const handleExecute = async () => {
    if (!link.includes('whatsapp.com')) {
      setStatus({ type: 'error', msg: 'INVALID_WHATSAPP_PROTOCOL_LINK' });
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
      // 1. Worker එකෙන් සල්ලි කැපීම
      const deductRes = await fetch(`${WORKER_URL}/deduct-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.uid,
          amount: cost
        })
      });

      const deductData = await deductRes.json();

      if (deductRes.ok && deductData.success) {
        // 2. සල්ලි කැපීම සාර්ථක නම් Bot එකට දැනුම් දීම
        // Heroku බොට් එකේ API එක මෙතනට දාන්න
        await fetch("https://ඔයාගේ-heroku-app-name.herokuapp.com/boost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.uid,
            email: currentUser.email,
            service: type,
            url: link
          })
        });

        setStatus({ type: 'success', msg: `NODE_INJECTED: LKR ${cost} DEDUCTED` });
        setLink('');
        fetchBalance(currentUser.uid);
        fetchHistory(currentUser.uid);
      } else {
        throw new Error(deductData.error || "UPLINK_ERROR");
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || "PROTOCOL_FAULT" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1 flex items-center gap-2">
            <Smartphone size={12} /> External_Node_Injection
          </h3>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            WhatsApp Protocol Boost
          </h2>
        </div>

        <div className="p-8">
          {/* Service Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setType('follow')}
              className={`relative overflow-hidden group p-5 rounded-3xl border-2 transition-all ${
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
                  <p className="font-bold text-slate-900 dark:text-white">Followers Boost</p>
                  <p className="text-sm font-black text-emerald-500 mt-1">LKR 35.00</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setType('react')}
              className={`relative overflow-hidden group p-5 rounded-3xl border-2 transition-all ${
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
                  <p className="font-bold text-slate-900 dark:text-white">Mass Reactions</p>
                  <p className="text-sm font-black text-blue-500 mt-1">LKR 5.00</p>
                </div>
              </div>
            </button>
          </div>

          {/* Input Area */}
          <div className="space-y-6">
            <div className="relative group">
              <label className="absolute left-5 -top-2 px-2 bg-white dark:bg-[#161d2f] text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 z-10">
                Target_Protocol_URL
              </label>
              <input 
                type="text"
                placeholder="https://whatsapp.com/channel/..."
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
                <p className="text-[9px] font-black uppercase tracking-widest">{status.msg}</p>
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={loading || !link}
              className={`w-full relative overflow-hidden group py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all active:scale-[0.98] disabled:opacity-30 ${
                type === 'follow' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-blue-600 shadow-blue-600/20'
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
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
            
            <p className="text-center text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-50">
              * Verification required. Latency may occur during node overload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
