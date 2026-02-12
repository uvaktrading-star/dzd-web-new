
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  PlusCircle, 
  History, 
  CreditCard, 
  Settings, 
  Zap, 
  Wallet,
  Menu,
  X
} from 'lucide-react';
import DashboardHomeView from './DashboardHomeView';
import ServicesPageView from './ServicesPageView';

const API_KEY = "ddaac158a07c133069b875419234d8e3";
const BASE_URL = "https://makemetrend.online/api/v2";

// CORS Proxy to bypass browser restrictions
export const fetchSmmApi = async (params: Record<string, string>) => {
  const urlParams = new URLSearchParams({ ...params, key: API_KEY }).toString();
  // Using a reliable public CORS proxy
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(BASE_URL + '?' + urlParams)}`;
  
  const response = await fetch(proxyUrl, {
    method: 'GET', // Using GET through the proxy often bypasses strict POST CORS issues on some bridges
    headers: { 'Accept': 'application/json' }
  });
  
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export default function DashboardPage({ user }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [balance, setBalance] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    const updateBalance = async () => {
      setLoadingBalance(true);
      try {
        const data = await fetchSmmApi({ action: 'balance' });
        setBalance(data.balance);
      } catch (err) {
        console.error("Balance Sync Failed:", err);
      } finally {
        setLoadingBalance(false);
      }
    };
    updateBalance();
    const interval = setInterval(updateBalance, 60000); // Sync balance every minute
    return () => clearInterval(interval);
  }, []);

  if (!user) return <Navigate to="/" />;

  const menuItems = [
    { id: 'home', label: 'Command Hub', icon: <LayoutGrid />, color: 'text-blue-500' },
    { id: 'services', label: 'Protocols', icon: <List />, color: 'text-indigo-500' },
    { id: 'new-order', label: 'Deploy Unit', icon: <PlusCircle />, color: 'text-emerald-500' },
    { id: 'orders', label: 'Mission Logs', icon: <History />, color: 'text-pink-500' },
    { id: 'billing', label: 'Financials', icon: <CreditCard />, color: 'text-amber-500' },
    { id: 'settings', label: 'Terminal', icon: <Settings />, color: 'text-slate-500' }
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark pt-20 overflow-hidden font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex relative z-40 bg-white dark:bg-[#050b1a] border-r border-slate-200 dark:border-white/5 transition-all duration-500 ease-in-out flex-col ${sidebarOpen ? 'w-80' : 'w-24'}`}>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 top-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-all z-50 border-4 border-slate-50 dark:border-dark"
        >
          {sidebarOpen ? <ChevronLeft size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
        </button>

        <div className="flex-1 py-10 px-4 space-y-1">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <div className={`shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : item.color}`}>
                {React.cloneElement(item.icon as any, { size: 24, strokeWidth: activeTab === item.id ? 2.5 : 2 })}
              </div>
              {sidebarOpen && <span className="font-black uppercase tracking-widest text-[10px] whitespace-nowrap">{item.label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-2xl">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-white/5">
           <div className={`bg-blue-600/10 rounded-2xl p-5 transition-all overflow-hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
             <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Live Credit</p>
             <div className="flex justify-between items-center">
                <p className="text-xl font-black text-slate-900 dark:text-white">${balance || '0.00'}</p>
                <div className={`w-2 h-2 rounded-full ${loadingBalance ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
             </div>
           </div>
           {!sidebarOpen && <div className="flex justify-center py-4 text-blue-500"><Zap size={20} fill="currentColor" /></div>}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-4 lg:p-12 relative pb-32 md:pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {activeTab === 'home' && <DashboardHomeView user={user} balance={balance} />}
          {activeTab === 'services' && <ServicesPageView />}
          
          {/* Placeholder for other views */}
          {(activeTab !== 'home' && activeTab !== 'services') && (
            <div className="h-96 flex flex-col items-center justify-center text-center animate-fade-in bg-white dark:bg-slate-900/40 rounded-[3rem] border border-white/5 p-12">
              <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-400 mb-6">
                <Settings size={32} className="animate-spin-slow" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2">{activeTab} Initializing</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Secure connection to the {activeTab} protocol is being established.</p>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/80 dark:bg-[#050b1a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50">
        {menuItems.slice(0, 4).map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-4 rounded-2xl transition-all relative ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 -translate-y-4' : 'text-slate-500'}`}
          >
            {React.cloneElement(item.icon as any, { size: 22, strokeWidth: activeTab === item.id ? 2.5 : 2 })}
            {activeTab === item.id && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>}
          </button>
        ))}
        <button className="p-4 rounded-2xl text-slate-500">
           <Menu size={22} />
        </button>
      </nav>
    </div>
  );
}
