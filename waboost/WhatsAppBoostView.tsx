import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus,
  Zap,
  SmilePlus,
  X,
  Target,
  Hash
} from 'lucide-react';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

interface WhatsAppBoostProps {
  user: any; 
  fetchBalance: (uid: string) => void; 
}

export default function WhatsAppBoostView({ 
  user, 
  fetchBalance: syncAppBalance
}: WhatsAppBoostProps) {
  
  const [totalBalance, setTotalBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState({ balance: false, executing: false });
  const [link, setLink] = useState('');
  const [type, setType] = useState<'follow' | 'react'>('follow');
  const [quantity, setQuantity] = useState<string>("50");
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(["❤️"]);
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const allEmojis = ["❤️", "🔥", "👍", "✨", "💙", "😂", "💯", "✅", "🙌", "🤩", "⚡", "🌟", "🎉", "👑", "💪", "🌈"];
  const cleanBaseUrl = WORKER_URL?.replace(/\/$/, "");

  // --- [CALCULATE COST] ---
  const currentQty = parseInt(quantity) || 0;
  let totalCost = 0;
  if (type === 'follow') {
    totalCost = (currentQty * 35) / 100;
  } else {
    // Reactions: First 100 Free, then 5 LKR per 100
    totalCost = currentQty > 100 ? ((currentQty - 100) * 5) / 100 : 0;
  }

  const refreshBalance = useCallback(async (uid: string) => {
    if (!uid || !cleanBaseUrl) return;
    setLoading(prev => ({ ...prev, balance: true }));
    try {
      const response = await fetch(`${cleanBaseUrl}/get-balance?userId=${uid}`);
      const data = await response.json();
      setTotalBalance(parseFloat(data.total_balance || 0).toFixed(2));
      syncAppBalance(uid);
    } catch (error) { console.error(error); } finally { setLoading(prev => ({ ...prev, balance: false })); }
  }, [cleanBaseUrl, syncAppBalance]);

  useEffect(() => {
    if (user?.uid) {
      refreshBalance(user.uid);
      const interval = setInterval(() => refreshBalance(user.uid), 20000);
      return () => clearInterval(interval);
    }
  }, [user?.uid, refreshBalance]);

  const handleExecute = async () => {
    if (!link.includes('whatsapp.com/channel/')) {
      setStatus({ type: 'error', msg: 'INVALID CHANNEL LINK' });
      return;
    }
    if (currentQty < 10 || currentQty > 150) {
      setStatus({ type: 'error', msg: 'LIMIT: 10 - 150 ONLY' });
      return;
    }

    if (parseFloat(totalBalance) < totalCost) {
      setStatus({ type: 'error', msg: 'INSUFFICIENT BALANCE' });
      return;
    }

    setLoading(prev => ({ ...prev, executing: true }));
    setStatus(null);

    try {
      // 1. Deduct Balance if cost > 0
      if (totalCost > 0) {
        await fetch(`${cleanBaseUrl}/deduct-balance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, amount: totalCost, description: `WA ${type} Boost` })
        });
      }

      // 2. Split Quantity across Heroku Apps (Max 50 per app)
      const USERS_PER_APP = 50;
      let remaining = currentQty + 10; // Adding your +10 buffer
      let appId = 1;
      const signals = [];

      while (remaining > 0) {
        const batchSize = Math.min(remaining, USERS_PER_APP);
        const formattedTarget = type === 'react' 
          ? `${link.trim()},${selectedEmojis.join('.')},${batchSize}` 
          : `${link.trim()},${batchSize}`;

        signals.push(
          fetch('/api/send-signal', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: type,
              targetJid: formattedTarget,
              serverId: appId.toString(), // Sending APP_ID as serverId
              emojiList: selectedEmojis
            })
          })
        );
        remaining -= batchSize;
        appId++;
      }

      await Promise.all(signals);
      
      setStatus({ type: 'success', msg: `STRIKE DEPLOYED TO ${signals.length} APP NODES!` });
      setLink('');
      refreshBalance(user.uid);
    } catch (err) {
      setStatus({ type: 'error', msg: "SYSTEM OVERLOAD. TRY AGAIN." });
    } finally {
      setLoading(prev => ({ ...prev, executing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-24 pb-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 italic tracking-tighter uppercase leading-none">DzD WA BOOST</h1>
            <p className="text-[8px] font-bold text-slate-400 tracking-[0.3em] uppercase mt-1">Multi-Node Hybrid Automation</p>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-1">
            <div className="px-6 py-6 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[2.3rem] text-white relative overflow-hidden">
               <Zap className="absolute right-[-5px] top-[-5px] w-24 h-24 opacity-10 rotate-12" />
               <div className="relative z-10 flex justify-between items-center">
                 <div>
                   <p className="text-blue-100 text-[9px] font-black uppercase tracking-widest opacity-80">Sync Balance</p>
                   <h3 className="text-2xl font-black tabular-nums tracking-tight">LKR {totalBalance}</h3>
                 </div>
                 <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-[9px] font-black uppercase tracking-tighter">{loading.balance ? 'Syncing...' : 'Stable'}</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setType('follow')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${type === 'follow' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 opacity-50 grayscale'}`}>
                <UserPlus className={`${type === 'follow' ? 'text-blue-500' : ''}`} size={20} />
                <span className="font-black text-[11px] mt-1 dark:text-white">Followers</span>
              </button>
              <button onClick={() => setType('react')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${type === 'react' ? 'border-cyan-500 bg-cyan-500/5' : 'border-slate-100 dark:border-white/5 opacity-50 grayscale'}`}>
                <Heart className={`${type === 'react' ? 'text-cyan-500' : ''}`} size={20} />
                <span className="font-black text-[11px] mt-1 dark:text-white">Reactions</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Channel Endpoint</label>
              <input 
                type="text"
                placeholder="https://whatsapp.com/channel/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl py-4 px-5 text-xs font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20"
              />
            </div>

            {type === 'react' && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                  {selectedEmojis.map(emoji => (
                    <button key={emoji} onClick={() => setSelectedEmojis(selectedEmojis.filter(e => e !== emoji))} className="bg-white dark:bg-white/5 p-2 rounded-xl text-sm shadow-sm flex items-center group">
                      {emoji} <X size={10} className="ml-1 text-red-500" />
                    </button>
                  ))}
                  <button onClick={() => setIsEmojiMenuOpen(!isEmojiMenuOpen)} className="p-2 rounded-xl bg-blue-500 text-white"><SmilePlus size={16} /></button>
                </div>
                {isEmojiMenuOpen && (
                  <div className="grid grid-cols-6 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
                    {allEmojis.map(emoji => (
                      <button key={emoji} onClick={() => { if(selectedEmojis.length < 10) setSelectedEmojis([...selectedEmojis, emoji]); setIsEmojiMenuOpen(false); }} className="h-10 flex items-center justify-center text-lg hover:scale-110 transition-transform">{emoji}</button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                    <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="number" min="10" max="150" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-10 pr-4 text-xs font-black dark:text-white outline-none focus:ring-2 ring-blue-500/20"/>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Charge</label>
                    <div className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl py-4 px-5 text-center">
                        <span className="text-[11px] font-black text-blue-500">
                            {totalCost > 0 ? `LKR ${totalCost.toFixed(2)}` : (type === 'react' ? '100 FREE' : '0.00')}
                        </span>
                    </div>
                </div>
            </div>

            <button
              onClick={handleExecute}
              disabled={loading.executing || !link}
              className="w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-20 text-white shadow-xl bg-gradient-to-r from-blue-600 to-blue-800"
            >
              {loading.executing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>SYNCING NODES...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Target size={18} />
                  <span>INITIATE MULTI-STRIKE</span>
                </div>
              )}
            </button>

            {status && (
              <div className={`flex items-center gap-3 p-4 rounded-2xl border text-[9px] font-black uppercase tracking-tight animate-in zoom-in ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {status.msg}
              </div>
            )}
          </div>
        </div>
        <p className="mt-6 text-center text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
          Load Balance: Distributed across {Math.ceil((parseInt(quantity)+10)/50)} App Nodes<br/>
          Secure Protocol v2.4.1 - DzD Network
        </p>
      </div>
    </div>
  );
}
