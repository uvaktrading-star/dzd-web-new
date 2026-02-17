import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Heart,
  UserPlus,
  ArrowLeft,
  Zap,
  History,
  SmilePlus,
  X,
  Target
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
  const [loading, setLoading] = useState({ balance: false, executing: false });
  const [link, setLink] = useState('');
  const [type, setType] = useState<'follow' | 'react'>('follow');
  
  // --- [NEW STATES] ---
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(["❤️"]);
  const [quantity, setQuantity] = useState<number>(100);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const allEmojis = ["❤️", "🔥", "👍", "✨", "💙", "😂", "💯", "✅", "🙌", "🤩", "⚡", "🌟", "🎉", "👑", "💪", "🌈", "💓", "💚", "💛", "🤍"];
  const cleanBaseUrl = WORKER_URL?.replace(/\/$/, "");

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
      setStatus({ type: 'error', msg: 'INVALID LINK' });
      return;
    }

    const dbQuantity = Number(quantity) + 10;
    const cost = type === 'follow' ? 35 : 0;
    const currentBal = parseFloat(totalBalance);

    if (currentBal < cost) {
      setStatus({ type: 'error', msg: 'INSUFFICIENT BALANCE' });
      return;
    }

    setLoading(prev => ({ ...prev, executing: true }));
    setStatus(null);

    try {
      // Balance Deduction
      if (cost > 0) {
        await fetch(`${cleanBaseUrl}/deduct-balance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, amount: cost, description: `WA ${type} Boost` })
        });
      }

      // Signal logic as requested
      // React: link/serverId,emoji1,emoji2,size
      // Follow: link,size
      let formattedTarget = "";
      if (type === 'react') {
        const emojisPart = selectedEmojis.join(',');
        formattedTarget = `${link.trim()},${emojisPart},${dbQuantity}`;
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
          emojiList: selectedEmojis,
          requestedQty: dbQuantity
        })
      });

      if (signalRes.ok) {
        setStatus({ type: 'success', msg: `STRIKE DEPLOYED! (SIZE: ${dbQuantity})` });
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-14 pb-10 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400">
            <ArrowLeft size={18} />
          </button>
          <div className="text-right">
            <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 italic tracking-tighter uppercase leading-none">ZANTA STRIKE</h1>
            <p className="text-[7px] font-bold text-slate-400 tracking-[0.2em] uppercase">WhatsApp Automation V2</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/60 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden backdrop-blur-xl">
          {/* Balance Card - Compact */}
          <div className="p-1">
            <div className="px-6 py-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[1.8rem] text-white relative overflow-hidden">
               <Zap className="absolute right-[-10px] top-[-10px] w-20 h-20 opacity-10 rotate-12" />
               <div className="relative z-10 flex justify-between items-center">
                 <div>
                   <p className="text-blue-100 text-[8px] font-black uppercase tracking-widest">Credits</p>
                   <h3 className="text-xl font-black tabular-nums">LKR {totalBalance}</h3>
                 </div>
                 <div className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                    <span className="text-[8px] font-black uppercase tracking-tighter">{loading.balance ? 'Syncing' : 'Verified'}</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Operation Type */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setType('follow')} className={`p-3 rounded-2xl border-2 transition-all ${type === 'follow' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5 opacity-40'}`}>
                <UserPlus className={`mb-1 ${type === 'follow' ? 'text-emerald-500' : ''}`} size={18} />
                <p className="font-black text-[11px] dark:text-white">Followers</p>
                <p className="text-[8px] font-bold text-emerald-500 uppercase">LKR 35.00</p>
              </button>
              <button onClick={() => setType('react')} className={`p-3 rounded-2xl border-2 transition-all ${type === 'react' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/5 opacity-40'}`}>
                <Heart className={`mb-1 ${type === 'react' ? 'text-blue-500' : ''}`} size={18} />
                <p className="font-black text-[11px] dark:text-white">Reactions</p>
                <p className="text-[8px] font-bold text-blue-500 uppercase">FREE / PROMO</p>
              </button>
            </div>

            {/* Link Input */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Channel Link</label>
              <input 
                type="text"
                placeholder="https://whatsapp.com/channel/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs font-bold dark:text-white outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            {/* React Engine - Multi Emoji */}
            {type === 'react' && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Reaction Engine (Max 10)</label>
                
                {/* Selected Emojis Display */}
                <div className="flex flex-wrap gap-2 p-2 min-h-[45px] bg-slate-50 dark:bg-black/20 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                  {selectedEmojis.map(emoji => (
                    <button key={emoji} onClick={() => toggleEmoji(emoji)} className="bg-white dark:bg-white/5 p-1.5 rounded-lg text-sm shadow-sm flex items-center gap-1 group">
                      {emoji} <X size={10} className="text-red-500 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                  <button onClick={() => setIsEmojiMenuOpen(!isEmojiMenuOpen)} className="p-1.5 rounded-lg bg-blue-500 text-white text-xs">
                    <SmilePlus size={14} />
                  </button>
                </div>

                {isEmojiMenuOpen && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3 shadow-xl grid grid-cols-6 gap-2">
                    {allEmojis.map(emoji => (
                      <button key={emoji} onClick={() => toggleEmoji(emoji)} className={`h-10 flex items-center justify-center rounded-lg text-lg hover:bg-blue-500/10 ${selectedEmojis.includes(emoji) ? 'bg-blue-500/20 ring-1 ring-blue-500' : ''}`}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Strike Size (Max 150)</label>
                <span className="text-[9px] font-bold text-blue-500">DB Send: {Number(quantity) + 10}</span>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                <input 
                  type="range" min="10" max="150" step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="flex-1 h-1.5 accent-blue-600 ml-3"
                />
                <div className="bg-white dark:bg-white/5 px-4 py-2 rounded-lg font-black text-xs min-w-[60px] text-center dark:text-white border border-slate-100 dark:border-white/5">
                  {quantity}
                </div>
              </div>
            </div>

            {/* Execution Button */}
            <button
              onClick={handleExecute}
              disabled={loading.executing || !link || (type === 'react' && selectedEmojis.length === 0)}
              className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] disabled:opacity-20 text-white shadow-lg ${
                type === 'follow' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
            >
              {loading.executing ? (
                <Loader2 size={16} className="animate-spin mx-auto" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Target size={16} />
                  <span>DEPOY STRIKE PROTOCOL</span>
                </div>
              )}
            </button>

            {status && (
              <div className={`flex items-center gap-2 p-3 rounded-xl border text-[9px] font-black uppercase tracking-tighter ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {status.msg}
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[7px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
          Secure Protocol Active. System delivery: 5-15 Minutes.
        </p>
      </div>
    </div>
  );
}
