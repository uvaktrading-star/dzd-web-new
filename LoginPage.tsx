
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, Headphones, X, ShieldCheck as ShieldIcon, Loader2, Sparkles } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function LoginPage({ onLogin, onClose, onSwitchToSignup }: { onLogin: (u: any) => void, onClose: () => void, onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleAuthSuccess = (userData: any) => {
    setSuccess(true);
    setError('');
    // Delay for the animation then force a hard refresh to the root as requested
    setTimeout(() => {
      window.location.href = '/'; 
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      handleAuthSuccess({ 
        uid: userCredential.user.uid, 
        email: userCredential.user.email, 
        ...(userDoc.exists() ? userDoc.data() : { name: email.split('@')[0] }) 
      });
    } catch (err: any) {
      setError(err.message.includes('auth/invalid-credential') ? 'Identity verification failed. Please check credentials.' : err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      handleAuthSuccess({ 
        uid: result.user.uid, 
        email: result.user.email, 
        ...(userDoc.exists() ? userDoc.data() : { name: result.user.displayName }) 
      });
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto no-scrollbar bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0 cursor-pointer -z-10" onClick={onClose} />
      
      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_48px_100px_-12px_rgba(0,0,0,1)] animate-scale-in border border-white/10 bg-[#020617] relative z-10 min-h-[600px]">
        {/* Success Overlay with Progress Bar */}
        {success && (
          <div className="absolute inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center animate-fade-in">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 animate-pulse border border-blue-500/30">
                <ShieldIcon size={40} />
              </div>
              <div className="absolute -inset-4 border border-blue-600/20 rounded-[2rem] animate-spin [animation-duration:4s]"></div>
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Identity Verified</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Synchronizing Command Center...</p>
            
            <div className="w-48 h-1.5 bg-white/5 rounded-full mt-10 overflow-hidden border border-white/5">
              <div className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_forwards]"></div>
            </div>
            
            <style>{`
              @keyframes loading {
                0% { width: 0%; }
                100% { width: 100%; }
              }
            `}</style>
          </div>
        )}

        <button onClick={onClose} className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <X size={20} />
        </button>

        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 p-16 flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 mesh-bg"><div className="blob top-0 left-0 bg-white"></div></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Secure Entry Protocol</span>
            </div>
            <h1 className="text-6xl font-black text-white mb-6 tracking-tighter leading-none">DzD <br /><span className="text-blue-300">Empire</span></h1>
            <p className="text-blue-100 text-lg font-medium mb-12 opacity-80 max-w-sm">Access your high-performance growth assets from anywhere in the world.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                <ShieldCheck className="text-blue-300 mb-3" size={24} />
                <h3 className="text-white text-xl font-black">Private</h3>
                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest opacity-60">Auth-Secure</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                <Sparkles className="text-blue-300 mb-3" size={24} />
                <h3 className="text-white text-xl font-black">Elite</h3>
                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest opacity-60">Priority API</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#050b1a] p-8 md:p-12 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">Access Node</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Initialize Secure Session</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Identity UID</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0a1121] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-600 outline-none transition-all font-medium text-sm placeholder:text-slate-800" placeholder="auth@dzd.network" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Access Key</label>
                  <button type="button" onClick={() => navigate('/forgot')} className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">Restore</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#0a1121] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:border-blue-600 outline-none transition-all font-medium text-sm placeholder:text-slate-800" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-[11px]">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Establish Connection'}
              </button>
            </form>

            <div className="mt-8 relative text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <span className="relative bg-[#050b1a] px-4 text-[9px] font-black text-slate-700 uppercase tracking-widest">Authority Bridge</span>
            </div>

            <button onClick={handleGoogleLogin} className="mt-6 w-full bg-[#0a1121] border border-white/5 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white hover:bg-[#0f172a] transition-all group text-[11px] uppercase tracking-widest">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Auth
            </button>
            <p className="mt-8 text-center text-slate-700 font-bold text-[10px] uppercase tracking-widest">Not in the system? <button onClick={onSwitchToSignup} className="text-blue-500 font-black ml-1 hover:underline">Register Identity</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}
