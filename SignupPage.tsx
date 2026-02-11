import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Check,
  Zap,
  ArrowRight,
  X,
  Loader2
} from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function SignupPage({
  onSignup,
  onClose,
  onSwitchToLogin,
}: {
  onSignup: (u: any) => void;
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleAuthSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      window.location.href = '/'; 
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Verification fail: Passwords do not match!");
      return;
    }
    if (!agreed) {
      alert("Protocol error: Accept Node Protocols to proceed.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = { fullName, username, email, onboarded: false, createdAt: new Date().toISOString() };
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      handleAuthSuccess();
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = { 
        fullName: result.user.displayName || '', 
        username: result.user.email?.split('@')[0] || '', 
        email: result.user.email || '', 
        onboarded: false,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', result.user.uid), userData, { merge: true });
      handleAuthSuccess();
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-hidden">
      {/* Background Overlay Click to Close */}
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative w-full h-full sm:h-auto sm:max-w-5xl bg-white sm:rounded-[2.5rem] shadow-2xl overflow-y-auto sm:overflow-hidden animate-scale-in">
        {/* Premium Success Overlay */}
        {success && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-2xl animate-fade-in">
            <div className="bg-white/10 border border-white/20 backdrop-blur-3xl p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-scale-in">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-600/40 transform scale-110">
                <Check size={32} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase">Congratulations!</h2>
              <p className="text-blue-200/60 text-xs font-bold tracking-[0.2em] uppercase leading-relaxed">Identity Secured.<br />Initializing Account...</p>
            </div>
          </div>
        )}

        {/* Desktop Close Button */}
        <button 
          onClick={onClose} 
          className="hidden sm:flex absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-50 border border-slate-100 items-center justify-center text-slate-900 hover:bg-slate-100 transition-all"
        >
          <X size={20} />
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={onClose} 
          className="sm:hidden absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row h-full sm:h-auto">
          {/* Brand Side - Desktop Only */}
          <div className="hidden lg:flex lg:w-5/12 bg-slate-50 border-r border-slate-100 flex-col p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 mesh-bg">
              <div className="blob top-0 left-0 bg-blue-200"></div>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div className="flex items-center gap-2 mb-12">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Zap size={24} fill="white" />
                </div>
                <span className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                  DzD <span className="text-blue-600">Marketing</span>
                </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-12 tracking-tighter">
                Elevate your<br />social presence<br />
                <span className="text-blue-600">instantly.</span>
              </h1>
              <div className="space-y-4">
                {['Instant Delivery', '24/7 Support', 'Secure Payments'].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Check size={14} className="text-blue-600" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side - Full width on mobile, centered */}
          <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-8 lg:p-16 min-h-screen sm:min-h-0">
            <div className="w-full max-w-md mx-auto">
              {/* Mobile Header Branding */}
              <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
                  <Zap size={20} fill="white" />
                </div>
                <span className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                  DzD <span className="text-blue-600">Marketing</span>
                </span>
              </div>
              
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 tracking-tighter">
                  Create Account
                </h2>
                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em]">
                  Join the elite marketing ecosystem
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full h-12 sm:h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm placeholder:text-slate-400"
                        placeholder="Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                      <input
                        required
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full h-12 sm:h-12 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm placeholder:text-slate-400"
                        placeholder="handle"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full h-12 sm:h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm placeholder:text-slate-400"
                      placeholder="mail@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full h-12 sm:h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`w-full h-12 sm:h-12 bg-slate-50 border rounded-xl pl-11 pr-4 text-slate-900 outline-none transition-all text-sm ${
                          confirmPassword && password !== confirmPassword
                            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }`}
                        placeholder="••••••••"
                      />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2 cursor-pointer select-none" onClick={() => setAgreed(!agreed)}>
                  <div className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all ${
                    agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white hover:border-blue-400'
                  }`}>
                    {agreed && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    Accept <span className="text-blue-600">Terms of Service</span>
                  </span>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 sm:h-12 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black">
                    <span className="bg-white px-4 text-slate-400 tracking-[0.2em]">OR</span>
                  </div>
                </div>
                
                <button
                  onClick={handleGoogleSignup}
                  className="w-full h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </button>
                
                <p className="mt-8 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 pb-4 lg:pb-0">
                  Already have an account?{' '}
                  <button
                    onClick={onSwitchToLogin}
                    className="font-black text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
                  >
                    Login
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
