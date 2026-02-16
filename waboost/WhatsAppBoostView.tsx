import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  History, 
  Wallet,
  Activity,
  Ticket,
  Zap
} from 'lucide-react';
import DashboardHomeView from './DashboardHomeView';
import ServicesPageView from './ServicesPageView';
import OrdersPageView from './OrdersPageView';
import Tickets from './Tickets';
import WalletPage from './wallet/BillingPageView';

// Navbar එකේ පාවිච්චි කරන URL එකම මෙතනටත් ගන්නවා
const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export default function DashboardPage({ user }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Balance States (Navbar එකට සමානයි)
  const [navBalance, setNavBalance] = useState("0.00");
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Get current tab from URL path
  const getCurrentTabFromPath = () => {
    const path = location.pathname.split('/').pop() || 'home';
    const validTabs = ['home', 'services', 'orders', 'wallet', 'tickets'];
    return validTabs.includes(path) ? path : 'home';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTabFromPath());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getCurrentTabFromPath());
  }, [location.pathname]);

  // --- Navbar එකේ Balance Logic එක මෙතනට ---
  const fetchLiveStats = async (uid: string) => {
    if (!uid) return;
    setLoadingBalance(true);
    try {
      // Navbar එකේ පාවිච්චි කරන API endpoint එකමයි මෙතනත් තියෙන්නේ
      const response = await fetch(`${WORKER_URL}/get-balance?userId=${uid}`);
      const data = await response.json();
      setNavBalance(parseFloat(data.total_balance || 0).toFixed(2));
    } catch (error) {
      console.error("Dashboard balance sync error:", error);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchLiveStats(user.uid);
      // තත්පර 30කට සැරයක් auto-update වෙනවා
      const interval = setInterval(() => fetchLiveStats(user.uid), 30000);
      return () => clearInterval(interval);
    }
  }, [user]);
  // -----------------------------------------

  if (!user) return <Navigate to="/" />;

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: <LayoutGrid />, color: 'text-blue-500', path: '/dashboard/home' },
    { id: 'services', label: 'Services', icon: <List />, color: 'text-indigo-500', path: '/dashboard/services' },
    { id: 'orders', label: 'Orders', icon: <History />, color: 'text-pink-500', path: '/dashboard/orders' },
    { id: 'wallet', label: 'Wallet', icon: <Wallet />, color: 'text-amber-500', path: '/dashboard/wallet' },
    { id: 'tickets', label: 'Tickets', icon: <Ticket />, color: 'text-slate-500', path: '/dashboard/tickets' }
  ];

  const handleTabChange = (tabId: string, path: string) => {
    setActiveTab(tabId);
    navigate(path);
  };

  const renderContent = () => {
    // Balance එක LKR format එකට Dashboard views වලට යවනවා
    switch (activeTab) {
      case 'home':
        return <DashboardHomeView user={user} balance={navBalance} />;
      case 'services':
        return <ServicesPageView scrollContainerRef={mainRef} />;
      case 'orders':
        return <OrdersPageView scrollContainerRef={mainRef} />;
      case 'tickets':
        return <Tickets scrollContainerRef={mainRef} />;
      case 'wallet':
        return <WalletPage user={user} scrollContainerRef={mainRef} />;
      default:
        return null;
    }
  };

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

        <div className="flex-1 py-10 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => handleTabChange(item.id, item.path)}
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
            </button>
          ))}
        </div>

        {/* BOTTOM BALANCE CARD IN SIDEBAR (Optional) */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-100 dark:border-white/5">
             <div className="bg-gradient-to-br from-blue-600/5 to-blue-600/10 rounded-2xl p-4 border border-blue-600/10">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                     <Activity size={8} className={loadingBalance ? 'animate-pulse' : ''} />
                     WALLET_LKR
                   </p>
                   <p className="text-lg font-black text-slate-900 dark:text-white">Rs.{navBalance}</p>
                 </div>
                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                   <Zap size={14} fill="currentColor" />
                 </div>
               </div>
             </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 lg:p-12 relative pb-32 md:pb-12 bg-[#fcfdfe] dark:bg-[#020617]"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {renderContent()}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white dark:bg-[#050b1a] border-t border-slate-200 dark:border-white/10 flex items-center justify-between px-2 z-50">
        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id, item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
              }`}
            >
              {React.cloneElement(item.icon as any, {
                size: 20,
                strokeWidth: isActive ? 2.5 : 2
              })}
              <span className={`text-[10px] mt-1 font-semibold tracking-wide ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
