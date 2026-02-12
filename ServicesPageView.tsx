
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, RefreshCw, PlusCircle, Filter, Smartphone, Globe, ChevronRight } from 'lucide-react';
import { fetchSmmApi } from './DashboardPage';

export default function ServicesPageView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSmmApi({ action: 'services' });
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        setError('Invalid response from server.');
      }
    } catch (err) {
      console.error(err);
      setError('CORS Protocol error: Unable to fetch services via proxy.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(services.map(s => String(s.category))))];
    return cats.slice(0, 10); // Limit to top 10 categories for cleaner UI
  }, [services]);

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.service.toString().includes(searchTerm);
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Protocol Directory</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 tracking-[0.2em]">{services.length} Units Online</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadServices} className="flex items-center gap-2 p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-500 hover:text-blue-500 transition-all hover:scale-105">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Resync Node</span>
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Protocol ID or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[1.5rem] py-5 pl-14 pr-6 font-bold text-sm focus:border-blue-600 outline-none transition-all shadow-sm text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-right lg:max-w-md">
           {categories.map(cat => (
             <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30' : 'bg-white dark:bg-slate-900/50 text-slate-500 border-slate-200 dark:border-white/5 hover:border-blue-500'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Desktop View Table */}
      <div className="hidden md:block bg-white dark:bg-[#0f172a]/40 rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rate/1k</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Payload Limits</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <Loader2 className="mx-auto animate-spin text-blue-600 mb-6" size={40} />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Accessing Global Node Matrix...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="bg-red-500/10 text-red-500 p-6 rounded-3xl border border-red-500/20 max-w-sm mx-auto">
                      <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service: any) => (
                  <tr key={service.service} className="hover:bg-blue-600/5 transition-all group cursor-default">
                    <td className="px-8 py-6 font-black text-blue-600 text-xs">#{service.service}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-500 transition-colors">{service.name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md inline-block">{service.category}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900 dark:text-white text-sm">${service.rate}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase">{service.min} - {service.max} Units</span>
                    </td>
                    <td className="px-8 py-6">
                       <button className="bg-slate-100 dark:bg-white/5 p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-blue-600 transition-all active:scale-90">
                         <PlusCircle size={20} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">No protocols detected in sector "{activeCategory}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View List */}
      <div className="md:hidden space-y-4">
        {loading ? (
           <div className="py-20 text-center">
             <Loader2 className="mx-auto animate-spin text-blue-600 mb-4" />
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loading Node...</p>
           </div>
        ) : filteredServices.slice(0, 20).map((service: any) => (
          <div key={service.service} className="bg-white dark:bg-[#0f172a]/40 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 active:scale-[0.98] transition-all">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <span className="text-[9px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-1 rounded-md mb-2 inline-block">ID: #{service.service}</span>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm leading-tight">{service.name}</h4>
               </div>
               <button className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                 <PlusCircle size={18} />
               </button>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-slate-100 dark:border-white/5">
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rate</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">${service.rate}</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Limits</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase">{service.min}-{service.max}</p>
               </div>
            </div>
          </div>
        ))}
        {!loading && filteredServices.length > 20 && (
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-6">Showing first 20 protocols...</p>
        )}
      </div>
    </div>
  );
}
