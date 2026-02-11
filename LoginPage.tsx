
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage({ onLogin }: { onLogin: (u: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mocking Firebase Auth delay
    setTimeout(() => {
      onLogin({ email, name: email.split('@')[0], onboarded: true });
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ email: 'googleuser@gmail.com', name: 'Google User', onboarded: true });
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-32 animate-fade-in bg-slate-50 dark:bg-dark">
      <div className="max-w-md w-full glass p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-white/10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Log in to manage your growth</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 pl-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all" placeholder="john@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
              <label className="text-xs font-black uppercase text-slate-400">Password</label>
              <Link to="/forgot" className="text-xs font-black text-blue-600">Forgot?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 relative text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10"></div></div>
          <span className="relative bg-white dark:bg-darkSecondary px-4 text-xs font-black text-slate-400 uppercase">Or</span>
        </div>

        <button onClick={handleGoogleLogin} className="mt-6 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="G" />
          Login with Google
        </button>

        <p className="mt-8 text-center text-slate-500 text-sm font-semibold">
          No account? <Link to="/signup" className="text-blue-600 font-black">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
