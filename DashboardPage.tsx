
import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Bell, 
  ShoppingCart, 
  Wallet, 
  PieChart, 
  CreditCard, 
  Mail, 
  Zap, 
  LayoutGrid, 
  List, 
  History, 
  PlusCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  TrendingUp, 
  Smartphone, 
  MoreVertical,
  Globe,
  Loader2,
  RefreshCw
} from 'lucide-react';

const API_KEY = "ddaac158a07c133069b875419234d8e3";
const API_URL = "https://makemetrend.online/api/v2";

// Sub-components for different views
const DashboardHome = ({ user, balance, loading }: any) => (
  <div className="animate-fade-in space-y-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Overview</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Commanding account: {user?.email}</p>
      </div>
      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-blue-600/20 text-sm hover:scale-105 active:scale-95 transition-all">
          <PlusCircle size={18} /> New Order
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Available Balance', value: loading ? '...' : `$${balance || '0.00'}`, icon: <Wallet />, color: 'bg-blue-600', trend: '+12.5%' },
        { label: 'Active Orders', value: '12', icon: <PieChart />, color: 'bg-pink-600', trend: 'Live' },
        { label: 'Total Investment', value: '$1,890', icon: <CreditCard />, color: 'bg-green-600', trend: 'Safe' },
        { label: 'Support Tickets', value: '0', icon: <Mail />, color: 'bg-orange-600', trend: 'Clean' }
      ].map((stat, i) => (
        <div key={i} className="bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-inherit/20`}>
              {React.cloneElement(stat.icon as any, { size: 22 })}
            </div>
            <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase">{stat.trend}</span>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-black tracking-tight">Execution History</h3>
           <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { s: 'TikTok High-Retention Views', p: '$24.99', st: 'Delivering', color: 'text-blue-500' },
            { s: 'Instagram VIP Followers', p: '$12.00', st: 'Completed', color: 'text-green-500' },
            { s: 'Facebook Post Engagement', p: '$5.50', st: 'Partial', color: 'text-yellow-500' }
          ].map((o, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-white/5 group hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm"><Zap size={18} /></div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{o.s}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Order ID: #4829{i}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 dark:text-white text-sm">{o.p}</p>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/5 ${o.color}`}>{o.st}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
        <h3 className="text-xl font-black mb-8 tracking-tight">Express Deployment</h3>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Select Service</label>
            <select className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-2xl py-4 px-4 text-sm font-bold focus:border-blue-500 outline-none">
              <option>TikTok Real Views [Instant]</option>
              <option>Instagram Followers [Global]</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Target URL</label>
            <input className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-2xl py-4 px-4 text-sm font-bold focus:border-blue-500 outline-none" placeholder="https://..." />
          </div>
          <button className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Launch Order</button>
        </div>
      </div>
    </div>
  </div>
);

const ServicesView = ({ services, loading, onRefresh }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Fix: Explicitly type categories as string array to resolve 'unknown' type errors in the list rendering
  const categories = useMemo<string[]>(() => {
    const cats = ['All', ...Array.from(new Set(services.map((s: any) => String(s.category))))];
    return cats;
  }, [services]);

  const filteredServices = services.filter((s: any) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.service.toString().includes(searchTerm);
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Service Directory</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{services.length} Protocols Active</p>
        </div>
        <button onClick={onRefresh} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 text-slate-500 hover:text-blue-500 transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
           {categories.slice(0, 5).map(cat => (
             <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white dark:bg-slate-900/50 text-slate-500 border-slate-200 dark:border-white/5 hover:border-blue-500'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol Name</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rate/1k</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Limits</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="mx-auto animate-spin text-blue-600 mb-4" size={32} />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fetching Node Services...</p>
                  </td>
                </tr>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service: any) => (
                  <tr key={service.service} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 font-black text-blue-600 text-xs">{service.service}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{service.name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{service.category}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900 dark:text-white text-sm">${service.rate}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase">{service.min} - {service.max}</span>
                    </td>
                    <td className="px-8 py-6">
                       <button className="bg-slate-100 dark:bg-white/5 p-2 rounded-xl text-slate-400 hover:text-blue-500 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                         <PlusCircle size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">No Protocols Found Matching Filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage({ user }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [services, setServices] = useState([]);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    setLoading(true);
    try {
      // Fetch Balance
      const balanceRes = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ key: API_KEY, action: 'balance' })
      });
      const balanceData = await balanceRes.json();
      setBalance(balanceData.balance);

      // Fetch Services
      const servicesRes = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ key: API_KEY, action: 'services' })
      });
      const servicesData = await servicesRes.json();
      if (Array.isArray(servicesData)) {
        setServices(servicesData as any);
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

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
      
      {/* Dynamic Sidebar */}
      <aside className={`relative z-40 bg-white dark:bg-[#050b1a] border-r border-slate-200 dark:border-white/5 transition-all duration-500 ease-in-out flex flex-col ${sidebarOpen ? 'w-80' : 'w-24'}`}>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 top-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-all z-50"
        >
          {sidebarOpen ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
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
              
              {sidebarOpen && (
                <span className={`font-black uppercase tracking-widest text-[10px] transition-all duration-300 opacity-100 whitespace-nowrap`}>
                  {item.label}
                </span>
              )}

              {/* Tooltip for compact mode */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-2xl">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5">
           <div className={`bg-blue-600/10 rounded-2xl p-4 transition-all overflow-hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
             <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Live Credit</p>
             <div className="flex justify-between items-center">
                <p className="text-xl font-black text-slate-900 dark:text-white">${balance || '0.00'}</p>
                <button className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg"><PlusCircle size={14} /></button>
             </div>
           </div>
           {!sidebarOpen && (
              <div className="flex justify-center py-4 text-blue-500 animate-pulse">
                <Zap size={20} fill="currentColor" />
              </div>
           )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-12 relative">
        {/* Decorative Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {activeTab === 'home' && <DashboardHome user={user} balance={balance} loading={loading} />}
          {activeTab === 'services' && <ServicesView services={services} loading={loading} onRefresh={fetchApiData} />}
          
          {/* Placeholder for other views */}
          {(activeTab !== 'home' && activeTab !== 'services') && (
            <div className="h-96 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-400 mb-6">
                <Settings size={32} className="animate-spin-slow" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2">Node Initializing</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">The {activeTab} protocol is being calibrated for your account.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
