
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, X, Check, Loader2, Zap } from 'lucide-react';
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

  const handleRestoreClick = () => {
    onClose();
    navigate('/forgot');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-[2.5rem] overflow-hidden shadow-[0_48px_100px_-12px_rgba(0,0,0,1)] animate-scale-in border border-white/10 bg-[#020617] relative my-auto">
        
        {/* Premium Success Overlay */}
        {success && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-2xl animate-fade-in">
            <div className="bg-white/10 border border-white/20 backdrop-blur-3xl p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-scale-in">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-600/40 transform scale-110">
                <Check size={32} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase">Access Granted</h2>
              <p className="text-blue-200/60 text-xs font-bold tracking-[0.2em] uppercase leading-relaxed">Logging success.<br />Redirecting to homepage...</p>
            </div>
          </div>
        )}

        <button onClick={onClose} className="absolute top-8 right-8 z-20 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90">
          <X size={24} />
        </button>

        {/* Brand Side - Styled for Login (Secure/Dark) */}
        <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#020617] via-[#050b1a] to-[#0a1121] border-r border-white/5 flex-col p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 mesh-bg">
            <div className="blob top-0 left-0 bg-blue-600"></div>
            <div className="blob bottom-0 right-0 bg-indigo-900"></div>
          </div>
          <div className="relative z-10 flex flex-col h-full justify-center">
            <div className="flex items-center gap-2 mb-14">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/40">
                <Zap size={28} fill="white" />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-tighter">DzD <span className="text-blue-500">Marketing</span></span>
            </div>
            
            <h1 className="text-5xl font-black text-white leading-[1.1] mb-12 tracking-tighter">
              Secure <br />Access<br />
              <span className="text-blue-500">Authorized.</span>
            </h1>

            <div className="space-y-6">
               {[
                 { label: 'Cloud Distribution', icon: <Check size={16} /> },
                 { label: 'Real-time Analytics', icon: <Check size={16} /> },
                 { label: 'Encrypted Payments', icon: <Check size={16} /> }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group cursor-default">
                   <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    {item.icon}
                   </div>
                   {item.label}
                 </div>
               ))}
            </div>

            <div className="mt-20 pt-10 border-t border-white/5">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Access DzD Auth v4.2</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 bg-[#050b1a] p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                  <Zap size={20} fill="white" />
                </div>
                <span className="text-xl font-black text-white uppercase tracking-tighter">DzD <span className="text-blue-500">Empire</span></span>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Login</h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Login using valid credentials</p>
            </div>

            {error && (
              <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0a1121] border border-white/5 rounded-[1.25rem] py-5 pl-12 pr-4 text-white focus:border-blue-600 outline-none transition-all font-medium text-sm placeholder:text-slate-800" placeholder="auth@dzd.network" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Password</label>
                  <button type="button" onClick={handleRestoreClick} className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">Forgot Password</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#0a1121] border border-white/5 rounded-[1.25rem] py-5 pl-12 pr-12 text-white focus:border-blue-600 outline-none transition-all font-medium text-sm placeholder:text-slate-800" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-16 rounded-[1.25rem] shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.25em] text-[12px] mt-4">
                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Login'}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black">
                <span className="bg-[#050b1a] px-5 text-slate-600 tracking-[0.4em]">OR</span>
              </div>
            </div>

            <button onClick={handleGoogleLogin} className="w-full bg-[#0a1121] border border-white/5 h-14 rounded-[1.25rem] flex items-center justify-center gap-4 font-bold text-white hover:bg-[#0f172a] transition-all group text-[11px] uppercase tracking-widest">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Login with Google
            </button>
            
            <p className="mt-10 text-center text-slate-700 font-bold text-[10px] uppercase tracking-widest">
              Don't have an account? <button onClick={onSwitchToSignup} className="text-blue-500 font-black ml-1 hover:underline underline-offset-4">Create account</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
