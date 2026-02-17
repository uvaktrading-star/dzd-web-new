import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus,
  Zap,
  History,
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
  
  // --- [STATES] ---
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(["❤️"]);
  const [quantity, setQuantity] = useState<string>("100");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const allEmojis = ["❤️", "🔥", "👍", "✨", "💙", "😂", "💯", "✅", "🙌", "🤩", "⚡", "🌟", "🎉", "👑", "💪", "🌈", "💓", "💚", "💛", "🤍"];
  const cleanBaseUrl = WORKER_URL?.replace(/\/$/, "");

  // Cost Calculation: Followers 100 = 35 LKR | Reactions = Free
  const currentQty = parseInt(quantity) || 0;
  const totalCost = type === 'follow' ? (currentQty * 35) / 100 : 0;

  useEffect(() => {
    const saved = localStorage.getItem('zanta_recent_emojis');
    if (saved) setRecentEmojis(JSON.parse(saved));
  }, []);

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
      const interval = setInterval(() => refreshBalance(user.uid), 15000);
      return () => clearInterval(interval);
    }
  }, [user?.uid, refreshBalance]);

  const toggleEmoji = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter(e => e !== emoji));
    } else {
      if (selectedEmojis.length < 10) {
        setSelectedEmojis([...selectedEmojis, emoji]);
        const updated = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 8);
        setRecentEmojis(updated);
        localStorage.setItem('zanta_recent_emojis', JSON.stringify(updated));
      }
    }
  };

  const handleExecute = async () => {
    if (!link.includes('whatsapp.com/channel/')) {
      setStatus({ type: 'error', msg: 'INVALID CHANNEL LINK' });
      return;
    }
    if (currentQty < 10 || currentQty > 150) {
      setStatus({ type: 'error', msg: 'LIMIT: 10 - 150 ONLY' });
      return;
    }

    const dbQuantity = currentQty + 10;
    const currentBal = parseFloat(totalBalance);

    if (currentBal < totalCost) {
      setStatus({ type: 'error', msg: 'INSUFFICIENT BALANCE' });
      return;
    }

    setLoading(prev => ({ ...prev, executing: true }));
    setStatus(null);

    try {
      if (totalCost > 0) {
        const res = await fetch(`${cleanBaseUrl}/deduct-balance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, amount: totalCost, description: `WA ${type} Boost` })
        });
        if(!res.ok) throw new Error("Transaction Failed");
      }

      let formattedTarget = "";
      if (type === 'react') {
        formattedTarget = `${link.trim()},${selectedEmojis.join(',')},${dbQuantity}`;
      } else {
        formattedTarget = `${link.trim()},${dbQuantity}`;
      }

      const signalRes = await fetch('/api/send-signal', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: type,
          targetJid: formattedTarget,
          serverId: "100",
          emojiList: selectedEmojis
        })
      });

      if (signalRes.ok) {
        setStatus({ type: 'success', msg: `ORDER PLACED! (SIZE: ${dbQuantity})` });
        setLink('');
        refreshBalance(user.uid);
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: "SYSTEM ERROR" });
    } finally {
      setLoading(prev => ({ ...prev, executing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-24 pb-10 px-4">
      <div className="max-w-md mx-auto">
        {/* Header - DzD Branding */}
        <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 italic tracking-tighter uppercase leading-none">DzD WA BOOST</h1>
            <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.3em] uppercase mt-1">Next-Gen WhatsApp Automation</p>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/80 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Credits Display */}
          <div className="p-1">
            <div className="px-6 py-6 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[2.3rem] text-white relative overflow-hidden">
               <Zap className="absolute right-[-5px] top-[-5px] w-24 h-24 opacity-10 rotate-12" />
               <div className="relative z-10 flex justify-between items-center">
                 <div>
                   <p className="text-blue-100 text-[9px] font-black uppercase tracking-widest opacity-80">Available Credits</p>
                   <h3 className="text-2xl font-black tabular-nums tracking-tight">LKR {totalBalance}</h3>
                 </div>
                 <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-[9px] font-black uppercase tracking-tighter">{loading.balance ? 'Syncing...' : 'Verified'}</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Service Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setType('follow')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${type === 'follow' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 opacity-50 grayscale'}`}>
                <UserPlus className={`${type === 'follow' ? 'text-blue-500' : ''}`} size={20} />
                <span className="font-black text-[12px] dark:text-white mt-1">Followers</span>
              </button>
              <button onClick={() => setType('react')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${type === 'react' ? 'border-cyan-500 bg-cyan-500/5' : 'border-slate-100 dark:border-white/5 opacity-50 grayscale'}`}>
                <Heart className={`${type === 'react' ? 'text-cyan-500' : ''}`} size={20} />
                <span className="font-black text-[12px] dark:text-white mt-1">Reactions</span>
              </button>
            </div>

            {/* Link Input */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Channel Link</label>
              <input 
                type="text"
                placeholder="https://whatsapp.com/channel/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl py-4 px-5 text-xs font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20 transition-all"
              />
            </div>

            {/* Emoji Selector (Visible only for React) */}
            {type === 'react' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Reaction Mix (Up to 10)</label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5">
                  {selectedEmojis.map(emoji => (
                    <button key={emoji} onClick={() => toggleEmoji(emoji)} className="bg-white dark:bg-white/5 p-2 rounded-xl text-sm shadow-sm flex items-center gap-1 group">
                      {emoji} <X size={10} className="text-red-500 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                  <button onClick={() => setIsEmojiMenuOpen(!isEmojiMenuOpen)} className="p-2 rounded-xl bg-blue-500 text-white shadow-lg">
                    <SmilePlus size={16} />
                  </button>
                </div>

                {isEmojiMenuOpen && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-4 shadow-2xl grid grid-cols-5 gap-2 animate-in zoom-in-95">
                    {allEmojis.map(emoji => (
                      <button key={emoji} onClick={() => toggleEmoji(emoji)} className={`h-11 flex items-center justify-center rounded-xl text-xl hover:bg-blue-500/10 transition-all ${selectedEmojis.includes(emoji) ? 'bg-blue-500/20 ring-2 ring-blue-500/50' : ''}`}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quantity Input & Cost Calculation */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Strike Size</label>
                    <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="number"
                            min="10" max="150"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-10 pr-4 text-xs font-black dark:text-white outline-none focus:ring-2 ring-blue-500/20"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Cost</label>
                    <div className="w-full bg-slate-50 dark:bg-blue-500/5 border border-slate-200 dark:border-blue-500/20 rounded-2xl py-4 px-5 flex items-center justify-center">
                        <span className={`text-xs font-black ${totalCost > 0 ? 'text-emerald-500' : 'text-blue-500'}`}>
                            {totalCost > 0 ? `LKR ${totalCost.toFixed(2)}` : 'FREE / PROMO'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={loading.executing || !link || (type === 'react' && selectedEmojis.length === 0)}
              className="w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] disabled:opacity-20 text-white shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
            >
              {loading.executing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="animate-pulse">PROCESSING PROTOCOL...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Target size={18} />
                  <span>INITIATE DZD STRIKE</span>
                </div>
              )}
            </button>

            {status && (
              <div className={`flex items-center gap-3 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-tight animate-in zoom-in ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {status.msg}
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest opacity-60 leading-relaxed">
          STRIKE BUFFER: +10 UNITS ADDED AUTOMATICALLY<br/>
          System delivery: 5-15 Minutes. Secure Cloud Active.
        </p>
      </div>
    </div>
  );
}
