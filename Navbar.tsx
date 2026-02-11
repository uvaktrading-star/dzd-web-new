
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, LayoutGrid, User, Settings, LogOut, Menu, X, Moon, Sun } from 'lucide-react';

export const ThemeToggle = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  return (
    <button 
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-all border border-slate-300 dark:border-white/10"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default function Navbar({ theme, toggleTheme, user, onLogout }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Zap size={24} fill="white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white uppercase">DzD <span className="text-blue-600">Marketing</span></span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 font-semibold">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 text-sm">Home</Link>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 text-sm">Services</a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 text-sm">Support</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 pr-4 rounded-full border border-slate-200 dark:border-white/10 hover:border-blue-500 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm uppercase">
                    {user.name?.[0] || user.email?.[0]}
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name || 'User'}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass rounded-2xl p-2 shadow-2xl animate-scale-in border border-slate-200 dark:border-white/10">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5 mb-2">
                      <p className="text-[10px] font-black uppercase text-slate-400">Account</p>
                      <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-semibold">
                      <LayoutGrid size={18} /> Dashboard
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-semibold">
                      <User size={18} /> Profile Details
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-semibold">
                      <Settings size={18} /> Settings
                    </button>
                    <hr className="my-2 border-slate-200 dark:border-white/5" />
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold">
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm px-4">Login</Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg">Sign Up</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
