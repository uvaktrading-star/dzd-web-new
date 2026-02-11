
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
  ShieldCheck,
  Smartphone,
  X,
  Loader2,
  ShieldCheck as ShieldIcon
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
  const [strength, setStrength] = useState({
    label: "",
    color: "bg-slate-200",
    score: 0,
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!password) {
      setStrength({ label: "", color: "bg-slate-100", score: 0 });
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1)
      setStrength({ label: "Weak", color: "bg-red-500", score: 1 });
    else if (score === 2)
      setStrength({ label: "Medium", color: "bg-yellow-500", score: 2 });
    else if (score === 3)
      setStrength({ label: "Strong", color: "bg-blue-500", score: 3 });
    else
      setStrength({ label: "Very Strong", color: "bg-green-500", score: 4 });
  }, [password]);

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
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-start p-4 sm:p-8 lg:p-12 overflow-y-auto no-scrollbar bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Background Overlay Click to Close */}
      <div className="fixed inset-0 cursor-pointer -z-10" onClick={onClose} />

      <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_48px_100px_-12px_rgba(0,0,0,0.8)] animate-scale-in border border-slate-100 relative z-10 min-h-fit isolate my-auto">
        
        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center animate-fade-in text-center p-8">
            <div className="relative mb-10">
              <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 animate-pulse border border-blue-500/20">
                <ShieldIcon size={44} />
              </div>
              <div className="absolute -inset-4 border border-blue-600/20 rounded-[2.5rem] animate-[spin_4s_linear_infinite]"></div>
              <div className="absolute -inset-8 border border-white/5 rounded-[3rem] animate-[spin_8s_linear_infinite_reverse]"></div>
            </div>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">Identity Secured</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Synchronizing Command Node...</p>
            
            <div className="w-56 h-1.5 bg-white/5 rounded-full mt-10 overflow-hidden border border-white/5">
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

        {/* Global Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-200 transition-all shadow-sm">
          <X size={20} />
        </button>

        {/* Left Side: Brand Story */}
        <div className="hidden lg:flex lg:w-5/12 bg-slate-50 border-r border-slate-100 flex-col p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 mesh-bg">
            <div className="blob top-0 left-0 bg-blue-200"></div>
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                <Zap size={24} fill="white" />
              </div>
              <span className="text-xl font-bold text-slate-900 uppercase tracking-tight">DzD <span className="text-blue-600">Empire</span></span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-12 tracking-tighter">
                Elevate your<br />social presence<br /><span className="text-blue-600">instantly.</span>
              </h1>
              
              <div className="space-y-6">
                {[
                  { title: "INSTANT DELIVERY", icon: <Zap className="text-blue-600" size={18} />, bg: "bg-blue-100" },
                  { title: "24/7 SUPPORT", icon: <Smartphone className="text-blue-600" size={18} />, bg: "bg-indigo-100" },
                  { title: "SECURE PAYMENTS", icon: <ShieldCheck className="text-blue-600" size={18} />, bg: "bg-blue-100" }
                ].map((f, i) => (
                  <div key={i} className="flex gap-4 group items-center">
                    <div className={`w-10 h-10 shrink-0 rounded-xl ${f.bg} flex items-center justify-center transition-transform group-hover:scale-110 border border-white`}>{f.icon}</div>
                    <h4 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">{f.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 bg-white flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Header */}
            <div className="mb-10 text-center lg:text-left">
              <div className="flex items-center justify-center lg:hidden mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                  <Zap size={22} fill="white" />
                </div>
                <span className="text-xl font-bold text-slate-900 ml-2 uppercase tracking-tight">DzD <span className="text-blue-600">Empire</span></span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 tracking-tighter">Create Identity</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Initialize your elite marketing node</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full h-12 sm:h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 text-slate-900 focus:border-blue-600 outline-none transition-all font-medium text-sm placeholder:text-slate-300" placeholder="Name" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">@</span>
                    <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full h-12 sm:h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 text-slate-900 focus:border-blue-600 outline-none transition-all font-medium text-sm placeholder:text-slate-300" placeholder="handle" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-12 sm:h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 text-slate-900 focus:border-blue-600 outline-none transition-all font-medium text-sm placeholder:text-slate-300" placeholder="mail@example.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secret Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 sm:h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-12 text-slate-900 focus:border-blue-600 outline-none transition-all font-medium text-sm placeholder:text-slate-300" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`w-full h-12 sm:h-14 bg-slate-50 border rounded-2xl pl-11 pr-4 text-slate-900 outline-none transition-all font-medium text-sm ${confirmPassword && password !== confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-blue-600'}`} placeholder="••••••••" />
                  </div>
                </div>
              </div>

              {password && (
                <div className="px-1">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3, 4].map(l => (
                      <div key={l} className={`h-1 flex-1 rounded-full transition-all duration-500 ${l <= strength.score ? strength.color : 'bg-slate-100'}`}></div>
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Strength: <span className="text-slate-900">{strength.label}</span></p>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-3 py-2 cursor-pointer group select-none" onClick={() => setAgreed(!agreed)}>
                <div className={`w-5 h-5 shrink-0 rounded-lg border flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20' : 'border-slate-200 bg-slate-50 group-hover:border-blue-400'}`}>
                  {agreed && <Check size={12} className="text-white" strokeWidth={4} />}
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Accept <button type="button" className="text-blue-600 font-black hover:underline">Node Protocols</button></span>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-14 sm:h-16 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] text-[11px] uppercase tracking-[0.25em] mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>APPLY FOR ACCESS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
            
            <div className="mt-8 relative text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Or Auth Via</span>
            </div>
            
            <button onClick={handleGoogleSignup} className="mt-6 w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-100 transition-all active:scale-[0.99] text-[10px] uppercase tracking-widest">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Authority
            </button>
            
            <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Member already? <button onClick={onSwitchToLogin} className="font-black text-blue-600 hover:text-blue-700 ml-1 underline underline-offset-4">Link Hub</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
