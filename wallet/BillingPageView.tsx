import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Upload, Landmark, Smartphone, ShieldCheck, 
  AlertCircle, Wallet as WalletIcon, History, MessageSquare, 
  ArrowUpRight, Clock, CheckCircle2, Copy, Check, Bell, X, Trash2,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import emailjs from '@emailjs/browser'; // EmailJS Import kara

const WORKER_URL = import.meta.env.VITE_WORKER_URL;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export default function BillingPageView({ user: propUser }: any) {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [amount, setAmount] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [userBalance, setUserBalance] = useState({ total_balance: "0.00", pending_balance: "0.00" });
  
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [clearedNotifications, setClearedNotifications] = useState<string[]>([]);
  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({
    show: false, msg: '', type: 'success'
  });
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auth & User logic
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setCurrentUser(null);
        navigate('/');
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (propUser && !currentUser) {
      setCurrentUser(propUser);
    }
  }, [propUser, currentUser]);

  useEffect(() => {
    if (currentUser?.uid) {
      const saved = localStorage.getItem(`cleared_notifs_${currentUser?.uid}`);
      if (saved) setClearedNotifications(JSON.parse(saved));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.uid) {
      fetchBalance(currentUser.uid);
      fetchHistory(currentUser.uid);
    }
  }, [currentUser, clearedNotifications]);

  // UI Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const showNotification = (msg: string, type: 'success' | 'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const fetchBalance = async (uid: string) => {
    try {
      const response = await fetch(`${WORKER_URL}/get-balance?userId=${uid}`);
      const data = await response.json();
      setUserBalance({
        total_balance: parseFloat(data.total_balance || 0).toFixed(2),
        pending_balance: parseFloat(data.pending_balance || 0).toFixed(2)
      });
    } catch (error) { console.error("Balance fetch error:", error); }
  };

  const fetchHistory = async (uid: string) => {
    try {
      const response = await fetch(`${WORKER_URL}/get-history?userId=${uid}`);
      const data = await response.json();
      setHistory(data);
      const alerts = data.filter((item: any) => 
        (item.status === 'approved' || item.status === 'rejected') && 
        !clearedNotifications.includes(item.id || item.created_at)
      );
      setNotifications(alerts);
    } catch (error) { console.error("History fetch error:", error); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    if (!currentUser?.uid) return;
    const allIds = notifications.map(n => n.id || n.created_at);
    const newClearedList = [...clearedNotifications, ...allIds];
    setClearedNotifications(newClearedList);
    localStorage.setItem(`cleared_notifs_${currentUser?.uid}`, JSON.stringify(newClearedList));
    setNotifications([]);
    setShowNotifications(false);
  };

  // --- EMAIL SENDING LOGIC ---
  const sendAdminEmail = async (userName: string, userEmail: string, depositAmount: string) => {
    try {
      const templateParams = {
        admin_email: ADMIN_EMAIL,
        user_name: userName,
        user_email: userEmail,
        amount: depositAmount,
        date: new Date().toLocaleString(),
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log("Admin notified via EmailJS");
    } catch (error) {
      console.error("Email notification error:", error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !currentUser) return showNotification("Please select a receipt.", "error");
    
    setUploading(true);
    const formData = new FormData();
    const userName = currentUser.displayName || currentUser.email?.split('@')[0] || "Unknown";
    
    formData.append("userId", currentUser.uid);
    formData.append("email", currentUser.email || "no-email");
    formData.append("username", userName); 
    formData.append("amount", amount);
    formData.append("receipt", selectedFile);

    try {
      const response = await fetch(`${WORKER_URL}/submit-deposit`, { method: "POST", body: formData });
      if (response.ok) {
        // Submit eka success unama EmailJS eka call karanawa
        await sendAdminEmail(userName, currentUser.email || "N/A", amount);
        
        showNotification("Deposit submitted for verification successfully!", "success");
        setAmount(''); 
        setSelectedFile(null); 
        fetchBalance(currentUser.uid);
        fetchHistory(currentUser.uid);
      } else {
        showNotification("Submission failed. Please try again.", "error");
      }
    } catch (error) { 
      showNotification("A network error occurred!", "error");
    } finally { setUploading(false); }
  };

  // Loading State
  if (loadingUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">LOADING USER DATA...</p>
        </div>
      </div>
    );
  }

  // Not Logged In State
  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] p-12 border border-slate-200 dark:border-white/5 max-w-md">
          <ShieldCheck size={48} className="mx-auto text-blue-500 mb-4" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Please sign in to access your wallet</p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in pb-32">
      {/* TOAST SYSTEM */}
      {toast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[250] w-[90%] max-w-md">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-top duration-300 ${
            toast.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-tight">System Alert</p>
              <p className="text-[11px] font-bold opacity-90 leading-tight">{toast.msg}</p>
            </div>
            <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="p-1 hover:bg-black/10 rounded-lg">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {showNotifications && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest dark:text-white flex items-center gap-2">
                <Bell size={16} className="text-blue-500" /> System_Alerts
              </h4>
              <div className="flex items-center gap-4">
                <button onClick={clearAll} className="text-[9px] font-black uppercase text-red-500 flex items-center gap-1 hover:opacity-80 transition-opacity">
                  <Trash2 size={12}/> Clear All
                </button>
                <button onClick={() => setShowNotifications(false)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X size={18} className="dark:text-white" />
                </button>
              </div>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-[9px] font-bold uppercase tracking-widest">No New Alerts</div>
              ) : (
                notifications.map((n, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <div className="flex gap-4">
                      <div className={`p-2 rounded-xl shrink-0 ${n.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {n.status === 'approved' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black dark:text-white uppercase tracking-tight">Deposit {n.status}</p>
                          <p className="text-[8px] font-bold text-slate-400">{new Date(n.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm font-black text-slate-600 dark:text-slate-300 mt-1">LKR {parseFloat(n.amount).toFixed(2)}</p>
                        {n.status === 'rejected' && n.reason && (
                          <div className="mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                            <p className="text-[9px] font-bold text-red-500/80 uppercase mb-0.5 tracking-tighter">Admin Reason:</p>
                            <p className="text-[10px] font-bold text-slate-500 leading-tight italic">"{n.reason}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-white/5">
              <button onClick={() => setShowNotifications(false)} className="w-full py-3 bg-slate-100 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTION HISTORY MODAL */}
      {showHistory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-white flex items-center gap-2">
                <History size={18} className="text-blue-500" /> Transaction History
              </h3>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="dark:text-white" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {history.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No transactions found</div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                          item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {item.status === 'approved' ? <CheckCircle2 size={18}/> : item.status === 'rejected' ? <X size={18}/> : <Clock size={18}/>}
                        </div>
                        <div>
                          <p className="text-[11px] font-black dark:text-white uppercase">LKR {parseFloat(item.amount).toFixed(2)}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${
                        item.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                        item.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div 
        className={`-mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 pt-6 md:pt-8 pb-6 bg-[#fcfdfe] dark:bg-[#020617] border-b border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300 ${
          showHeader ? 'translate-y-0 opacity-100 relative' : '-translate-y-full opacity-0 pointer-events-none absolute'
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none flex items-center gap-3">
                <WalletIcon className="text-blue-600" size={32} />
                Wallet Section
              </h1>
              <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] text-[9px] mt-1.5 flex items-center gap-2">
                <Activity size={10} className="text-blue-500 animate-pulse" />
                Balance & Transaction Hub
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowHistory(true)}
                className="hidden md:flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-blue-500 transition-all shadow-sm active:scale-95 text-[9px] font-black uppercase tracking-widest"
              >
                <History size={14} /> History
              </button>

              <button
                onClick={() => navigate('/support')}
                className="hidden md:flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                <MessageSquare size={14} /> Support
              </button>
              
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 rounded-xl transition-all border shrink-0 flex items-center justify-center ${
                  showNotifications ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:border-blue-500'
                }`}
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a] animate-pulse"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY HEADER WHEN SCROLLED */}
      {!showHeader && (
        <div className="sticky top-0 z-40 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-3 bg-[#fcfdfe]/95 dark:bg-[#020617]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <WalletIcon size={16} className="text-blue-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Financial Core
              </p>
              {notifications.length > 0 && (
                <span className="ml-auto flex items-center gap-1 text-[8px] font-black text-red-500">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  {notifications.length} Alert{notifications.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="mt-1.5 pt-1.5">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={() => setShowHistory(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95"
            >
              <History size={14} /> History
            </button>
            <button 
              onClick={() => navigate('/support')}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
              <MessageSquare size={14} /> Support
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Total Balance Card */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl shadow-blue-600/20">
              <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Available Credits</p>
                <h3 className="text-4xl font-black tracking-tighter tabular-nums flex items-baseline gap-2">
                  <span className="text-lg opacity-60">LKR</span> {userBalance.total_balance}
                </h3>
              </div>
              <WalletIcon size={120} className="absolute -right-6 -bottom-6 opacity-10 rotate-12" />
            </div>
            
            {/* Pending Balance Card */}
            <div className="rounded-[2rem] bg-white dark:bg-[#0f172a]/40 p-8 border border-slate-200 dark:border-white/5">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">In Verification</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                LKR {userBalance.pending_balance}
              </h3>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-amber-500 transition-all duration-1000 ${parseFloat(userBalance.pending_balance) > 0 ? 'w-1/3 animate-pulse' : 'w-0'}`}></div>
                </div>
                <span className="text-[8px] font-black uppercase text-amber-500 tracking-tighter">Processing</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* BANK DETAILS */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 font-mono">PAYMENT DETAILS</h3>
              <div className="bg-white dark:bg-[#0f172a]/40 rounded-3xl p-6 border border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                    <Landmark size={20} />
                  </div>
                  <button onClick={() => copyToClipboard("71782008")} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg">
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-slate-400" />}
                  </button>
                </div>
                <div className="space-y-0.5 mb-3">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Bank Name</p>
                  <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase">Bank of Ceylon (BOC)</p>
                </div>
                <div className="space-y-0.5 mb-3">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Account Name</p>
                  <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase">Example</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Account Number</p>
                    <h4 className="text-md font-mono font-black text-blue-500 tracking-wider">71782008</h4>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Branch</p>
                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase">Mawanella</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0f172a]/40 rounded-2xl p-5 border border-slate-200 dark:border-white/5 flex items-center gap-4">
                <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 font-black italic text-[10px]">ez</div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Mobile Wallet (eZ Cash)</p>
                  <p className="text-md font-mono font-black text-slate-900 dark:text-white">0766247995</p>
                </div>
              </div>
            </div>

            {/* DEPOSIT FORM */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] p-6 md:p-8 border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2 font-mono uppercase">
                  <ArrowUpRight size={18} className="text-blue-500" /> UPLOAD DEPOSIT
                </h3>

                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Amount (LKR)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl py-4 px-5 text-lg font-black text-slate-900 dark:text-white focus:ring-2 ring-blue-500/20 outline-none pl-14"
                        placeholder="0.00"
                        required
                      />
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 font-black text-[10px] border-r border-slate-200 dark:border-white/10 pr-3">LKR</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest font-mono">Upload_Slip</label>
                    <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-black/10 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all p-4 text-center">
                      {selectedFile ? (
                        <div className="text-blue-500 font-black text-[9px] uppercase flex items-center gap-2">
                          <CheckCircle2 size={16} /> {selectedFile.name.substring(0, 20)}
                        </div>
                      ) : (
                        <>
                          <Upload size={20} className="text-slate-400 mb-1" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Image</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} required />
                    </label>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-amber-500 shrink-0" size={16} />
                    <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                      Verification takes 15-30 mins. False uploads lead to termination.
                    </p>
                  </div>

                  <button 
                    disabled={uploading}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center min-h-[56px]"
                  >
                    {uploading ? "SYNCING..." : "UPLOAD RECEIPT"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
