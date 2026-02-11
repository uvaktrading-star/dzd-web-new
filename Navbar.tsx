
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, LayoutGrid, User, Settings, LogOut, Menu, X, Moon, Sun, CreditCard, Shield } from 'lucide-react';

export const ThemeToggle = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  return (
    <button 
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-blue-600/10 hover:text-blue-600 transition-all border border-slate-200 dark:border-white/10"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default function Navbar({ theme, toggleTheme, user, onLogout, onLoginClick, onSignupClick }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setProfileOpen(false);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when switching to desktop or on navigation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = () => setIsOpen(false);

  const handleSignOut = () => {
    setProfileOpen(false);
    onLogout();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100]">
      {/* Header Bar Section - This contains the visual styling for the top strip only */}
      <div className="relative z-[110] bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <Zap size={22} fill="white" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">DzD <span className="text-blue-600">Marketing</span></span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-10 font-bold uppercase tracking-widest text-[10px]">
              <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Home</Link>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Services</a>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Support</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-1.5 pr-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-500 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm uppercase shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                      {(user.fullName?.[0] || user.name?.[0] || user.email?.[0]).toUpperCase()}
                    </div>
                    <div className="text-left leading-tight hidden lg:block">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[100px]">{user.fullName || user.name || 'Account'}</p>
                      <p className="text-[9px] font-black text-blue-500 uppercase">Verified User</p>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#050b1a] rounded-3xl p-3 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] animate-scale-in border border-slate-200 dark:border-white/10 overflow-hidden isolate">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-600/5 blur-3xl -z-10 rounded-full"></div>
                      
                      <div className="px-5 py-5 border-b border-slate-100 dark:border-white/5 mb-2">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Command Profile</p>
                        <p className="text-sm font-black truncate text-slate-900 dark:text-white">{user.email}</p>
                        <div className="mt-4 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-[10px] font-black text-slate-500 uppercase">Online</span>
                           </div>
                           <span className="text-[10px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-0.5 rounded-md">Platinum Member</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-500 rounded-xl transition-all uppercase tracking-widest">
                          <LayoutGrid size={18} strokeWidth={2.5} /> Dashboard
                        </Link>
                        <button className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-500 rounded-xl transition-all uppercase tracking-widest">
                          <User size={18} strokeWidth={2.5} /> Profile Vault
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-500 rounded-xl transition-all uppercase tracking-widest">
                          <CreditCard size={18} strokeWidth={2.5} /> Billing
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-500 rounded-xl transition-all uppercase tracking-widest">
                          <Settings size={18} strokeWidth={2.5} /> Systems
                        </button>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5">
                        <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest">
                          <LogOut size={18} strokeWidth={2.5} /> Terminate Session
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={onLoginClick} className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors px-4">Login</button>
                  <button onClick={onSignupClick} className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">Join Empire</button>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`text-slate-900 dark:text-white p-2.5 rounded-xl border transition-all ${isOpen ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Moved outside the blurry container to avoid stacking context issues */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-white dark:bg-[#020617] z-[100] animate-slide-up flex flex-col p-6 overflow-y-auto overflow-x-hidden no-scrollbar">
          {/* Subtle background glow for mobile menu */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10 rounded-full"></div>
          
          <div className="space-y-4 max-w-lg mx-auto w-full pb-10">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] border border-slate-200 dark:border-white/10 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs group active:scale-[0.98] transition-all">
              Home <ChevronDown size={14} className="-rotate-90 text-slate-400" />
            </Link>
            <a href="#" onClick={closeMobileMenu} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] border border-slate-200 dark:border-white/10 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs active:scale-[0.98] transition-all">
              Services <ChevronDown size={14} className="-rotate-90 text-slate-400" />
            </a>
            <a href="#" onClick={closeMobileMenu} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] border border-slate-200 dark:border-white/10 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs active:scale-[0.98] transition-all">
              Support <ChevronDown size={14} className="-rotate-90 text-slate-400" />
            </a>
            
            <div className="pt-8 space-y-4">
              {user ? (
                 <div className="space-y-4">
                    <div className="px-2 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                         {(user.fullName?.[0] || user.name?.[0]).toUpperCase()}
                       </div>
                       <div>
                         <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{user.fullName || user.name}</p>
                         <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Active Member</p>
                       </div>
                    </div>
                    <Link to="/dashboard" onClick={closeMobileMenu} className="flex items-center gap-4 p-6 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                      <LayoutGrid size={20} /> Dashboard Center
                    </Link>
                    <button onClick={() => { onLogout(); closeMobileMenu(); }} className="w-full flex items-center gap-4 p-6 border border-red-500/20 text-red-500 rounded-[1.5rem] font-black uppercase tracking-widest text-xs active:bg-red-500/5">
                      <LogOut size={20} /> Logout Protocol
                    </button>
                 </div>
              ) : (
                <div className="flex flex-col gap-4">
                   <button onClick={() => { onLoginClick(); closeMobileMenu(); }} className="w-full py-6 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs border border-slate-200 dark:border-white/10 rounded-[1.5rem] bg-slate-50 dark:bg-white/5 active:bg-slate-100">Login to Empire</button>
                   <button onClick={() => { onSignupClick(); closeMobileMenu(); }} className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-[1.5rem] shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all">Join The Resistance</button>
                </div>
              )}
            </div>
            
            <div className="pt-10 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">DzD Global Network v2.0</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
