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
    onLogin(userData); // Update parent component state
    
    setTimeout(() => {
      onClose(); // Close login modal
      navigate('/dashboard'); // ✅ Redirect to dashboard (NOT window.location.href)
    }, 1500);
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
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-hidden">
      {/* Background Overlay Click to Close */}
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full h-full sm:h-auto sm:max-w-5xl bg-[#020617] sm:rounded-[2.5rem] overflow-y-auto sm:overflow-hidden shadow-[0_48px_100px_-12px_rgba(0,0,0,1)] animate-scale-in border border-white/10">
        
        {/* Premium Success Overlay */}
        {success && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-2xl animate-fade-in">
            <div className="bg-white/10 border border-white/20 backdrop-blur-3xl p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-scale-in">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-600/40 transform scale-110">
                <Check size={32} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase">Access Granted</h2>
              <p className="text-blue-200/60 text-xs font-bold tracking-[0.2em] uppercase leading-relaxed">Login successful.<br />Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {/* Desktop Close Button */}
        <button 
          onClick={onClose} 
          className="hidden sm:flex absolute top-6 lg:top-8 right-6 lg:right-8 z-20 w-10 lg:w-12 h-10 lg:h-12 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
        >
          <X size={20} className="lg:w-6 lg:h-6" />
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={onClose} 
          className="sm:hidden absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row h-full sm:h-auto">
          {/* Brand Side - Desktop Only */}
          <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#020617] via-[#050b1a] to-[#0a1121] border-r border-white/5 flex-col p-12 xl:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 mesh-bg">
              <div className="blob top-0 left-0 bg-blue-600"></div>
              <div className="blob bottom-0 right-0 bg-indigo-900"></div>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="flex items-center gap-2 mb-12 xl:mb-14">
                <div className="w-10 xl:w-12 h-10 xl:h-12 bg-blue-600 rounded-xl xl:rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/40">
                  <Zap size={22} className="xl:w-7 xl:h-7" fill="white" />
                </div>
                <span className="text-xl xl:text-2xl font-black text-white uppercase tracking-tighter">
                  DzD <span className="text-blue-500">Marketing</span>
                </span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-10 xl:mb-12 tracking-tighter">
                Secure <br />Access<br />
                <span className="text-blue-500">Authorized.</span>
              </h1>

              <div className="space-y-5 xl:space-y-6">
                {[
                  { label: 'Cloud Distribution', icon: <Check size={14} className="xl:w-4 xl:h-4" /> },
                  { label: 'Real-time Analytics', icon: <Check size={14} className="xl:w-4 xl:h-4" /> },
                  { label: 'Encrypted Payments', icon: <Check size={14} className="xl:w-4 xl:h-4" /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 xl:gap-4 text-[9px] xl:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group cursor-default">
                    <div className="w-5 xl:w-6 h-5 xl:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="mt-16 xl:mt-20 pt-8 xl:pt-10 border-t border-white/5">
                <p className="text-[8px] xl:text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Access DzD Auth v4.2</p>
              </div>
            </div>
          </div>

          {/* Form Side - Full width on mobile, centered */}
          <div className="w-full lg:w-7/12 bg-[#050b1a] flex items-center justify-center p-5 sm:p-8 lg:p-12 xl:p-16 min-h-screen sm:min-h-0">
            <div className="w-full max-w-md mx-auto">
              {/* Mobile Header - Centered */}
              <div className="lg:hidden flex flex-col items-center justify-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                    <Zap size={20} fill="white" />
                  </div>
                  <span className="text-xl font-black text-white uppercase tracking-tighter">
                    DzD <span className="text-blue-500">Marketing</span>
                  </span>
                </div>
              </div>

              <div className="mb-8 lg:mb-10 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tighter">
                  Welcome Back
                </h2>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">
                  Login with valid credentials
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
{/* Email Field */}
<div>
  <label className="block text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1.5 lg:mb-2 ml-1">
    Email
  </label>
  <div className="relative">
    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-[18px] h-[18px] lg:w-5 lg:h-5" />
    <input
      required
      type="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      className="w-full h-12 lg:h-14 bg-[#0a1121] border border-white/5 rounded-xl pl-12 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm placeholder:text-slate-700"
      placeholder="mail@example.com"
    />
  </div>
</div>

{/* Password Field */}
<div>
  <div className="flex justify-between items-center px-1 mb-1.5 lg:mb-2">
    <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-600">
      Password
    </label>
    <button
      type="button"
      onClick={handleRestoreClick}
      className="text-[9px] lg:text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
    >
      Forgot Password?
    </button>
  </div>
  <div className="relative">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-[18px] h-[18px] lg:w-5 lg:h-5" />
    <input
      required
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={e => setPassword(e.target.value)}
      className="w-full h-12 lg:h-14 bg-[#0a1121] border border-white/5 rounded-xl pl-12 pr-12 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm placeholder:text-slate-700"
      placeholder="••••••••"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
    >
      {showPassword ? <EyeOff size={18} className="lg:w-5 lg:h-5" /> : <Eye size={18} className="lg:w-5 lg:h-5" />}
    </button>
  </div>
</div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 lg:h-14 rounded-xl shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs lg:text-sm mt-4 lg:mt-6"
                >
                  {loading ? (
                    <Loader2 className="animate-spin lg:w-5 lg:h-5" size={18} />
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <div className="relative my-6 lg:my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[9px] lg:text-[10px] uppercase font-black">
                  <span className="bg-[#050b1a] px-4 lg:px-5 text-slate-600 tracking-[0.2em]">OR</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full bg-[#0a1121] border border-white/5 h-12 lg:h-14 rounded-xl flex items-center justify-center gap-3 lg:gap-4 font-bold text-white hover:bg-[#0f172a] transition-all text-[11px] lg:text-xs uppercase tracking-wider"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
              
              <p className="mt-8 lg:mt-10 text-center text-slate-600 font-bold text-[10px] lg:text-[11px] uppercase tracking-widest pb-4 lg:pb-0">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="text-blue-500 font-black hover:text-blue-400 hover:underline underline-offset-4 transition-colors"
                >
                Create an account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}