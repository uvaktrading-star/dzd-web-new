
import React, { useState, useEffect, useRef } from 'react';
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
  Activity,
  Ticket
} from 'lucide-react';
import DashboardHomeView from './DashboardHomeView';
import ServicesPageView from './ServicesPageView';
import OrdersPageView from './OrdersPageView';
import Tickets from './Tickets';
import wallet from './wallet/BillingPageView';

const API_KEY = "ddaac158a07c133069b875419234d8e3";
const BASE_URL = "https://makemetrend.online/api/v2";

/**
 * PRIVATE PROXY FETCHER
 * This uses the /api/proxy serverless function to bypass CORS.
 * Ensure you deploy the api/proxy.ts file to your Vercel project.
 */
export const fetchSmmApi = async (params: Record<string, string>) => {
  // Use a relative path if the proxy is co-located in the same project
  // Or replace with your full vercel URL: e.g., https://your-app.vercel.app/api/proxy
  const proxyEndpoint = "/api/proxy";
  
  // We send the parameters in the body via POST for maximum reliability with SMM APIs
  const payload = {
    ...params,
    key: API_KEY
  };

  try {
    const response = await fetch(`${proxyEndpoint}?url=${encodeURIComponent(BASE_URL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Proxy Error (${response.status}): ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Critical SMM Node Failure:", error);
    throw error;
  }
};

export default function DashboardPage({ user }: any) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [balance, setBalance] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    const updateBalance = async () => {
      setLoadingBalance(true);
      try {
        const data = await fetchSmmApi({ action: 'balance' });
        if (data && data.balance) {
          setBalance(data.balance);
        }
      } catch (err) {
        console.error("Balance Protocol Sync Failed. Proxy might be offline.");
      } finally {
        setLoadingBalance(false);
      }
    };
    
    updateBalance();
    const interval = setInterval(updateBalance, 60000); // Sync every 60s
    return () => clearInterval(interval);
  }, []);

  if (!user) return <Navigate to="/" />;

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: <LayoutGrid />, color: 'text-blue-500' },
    { id: 'services', label: 'Services', icon: <List />, color: 'text-indigo-500' },
    { id: 'orders', label: 'Orders', icon: <History />, color: 'text-pink-500' },
    { id: 'Wallet', label: 'Wallet', icon: <Wallet />, color: 'text-amber-500' },
    { id: 'tickets', label: 'Tickets', icon: <Ticket />, color: 'text-slate-500' }
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark pt-20 overflow-hidden font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside 
        className={`hidden md:flex relative z-40 bg-white dark:bg-[#050b1a] border-r border-slate-200 dark:border-white/5 transition-all duration-500 ease-in-out flex-col ${sidebarOpen ? 'w-80' : 'w-24'}`}
      >
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 top-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-all z-50 border-4 border-slate-50 dark:border-dark"
        >
          {sidebarOpen ? <ChevronLeft size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
        </button>

        <div className="flex-1 py-10 px-4 space-y-2">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <div className={`shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : item.color}`}>
                {React.cloneElement(item.icon as any, { size: 24, strokeWidth: activeTab === item.id ? 2.5 : 2 })}
              </div>
              {sidebarOpen && (
                <span className="font-black uppercase tracking-[0.15em] text-[10px] whitespace-nowrap opacity-100 transition-opacity">
                  {item.label}
                </span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-2xl">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Desktop Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5">
           <div className={`bg-blue-600/5 dark:bg-blue-600/10 rounded-[1.5rem] p-5 transition-all overflow-hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
             <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
               <Activity size={10} className={loadingBalance ? 'animate-pulse' : ''} /> Matrix: Online
             </p>
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Balance</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">${balance || '0.00'}</p>
                </div>
                <button className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
                  <PlusCircle size={18} />
                </button>
             </div>
           </div>
           {!sidebarOpen && (
              <div className="flex justify-center py-4 text-blue-500">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <Zap size={20} fill="currentColor" />
                </div>
              </div>
           )}
        </div>
      </aside>

{/* MAIN CONTENT AREA */}
<main
  ref={mainRef}
  className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 lg:p-12 relative pb-32 md:pb-12 bg-[#fcfdfe] dark:bg-[#020617]"
>
  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

  <div className="max-w-6xl mx-auto relative z-10">
    {activeTab === 'home' && <DashboardHomeView user={user} balance={balance} />}
    
    {activeTab === 'services' && (
      <ServicesPageView scrollContainerRef={mainRef} />
    )}
    
    {activeTab === 'orders' && (
      <OrdersPageView scrollContainerRef={mainRef} />
    )}

    {activeTab === 'tickets' && (
      <Tickets scrollContainerRef={mainRef} />
    )}

    {activeTab === 'wallet' && (
      <Tickets scrollContainerRef={mainRef} />
    )}
    
    {!['home', 'services', 'orders', 'tickets', 'wallet'].includes(activeTab) && (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in bg-white dark:bg-white/5 rounded-[3.5rem] border border-slate-200 dark:border-white/5 p-12">
        <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center text-blue-600 mb-8 border border-blue-500/20">
          <Activity size={40} className="animate-pulse" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-3">Node: {activeTab}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] max-w-sm leading-relaxed">
          Establishing encrypted link to the {activeTab} protocol hub.
        </p>
      </div>
    )}
  </div>
</main>

{/* MOBILE BOTTOM NAV - Icon + Label */}
<nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white dark:bg-[#050b1a] border-t border-slate-200 dark:border-white/10 flex items-center justify-between px-2 z-50">

  {menuItems.slice(0, 4).map(item => {
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
          isActive 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-slate-500'
        }`}
      >
        {React.cloneElement(item.icon as any, {
          size: 20,
          strokeWidth: isActive ? 2.5 : 2
        })}

        <span className={`text-[10px] mt-1 font-semibold tracking-wide ${
          isActive ? 'opacity-100' : 'opacity-80'
        }`}>
          {item.label.split(' ')[0]}
        </span>
      </button>
    );
  })}

  <button className="flex flex-col items-center justify-center flex-1 h-full text-slate-500">
    <Menu size={20} />
    <span className="text-[10px] mt-1 font-semibold tracking-wide">
      Menu
    </span>
  </button>

</nav>


    </div>
  );
}
