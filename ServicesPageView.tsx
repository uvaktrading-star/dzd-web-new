import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Loader2, 
  RefreshCw, 
  PlusCircle, 
  Globe, 
  Activity, 
  Zap, 
  ArrowRight,
  ChevronUp
} from 'lucide-react';
import { fetchSmmApi } from './DashboardPage';
import { useNavigate } from 'react-router-dom'; // 👈 Add this import

// Helper to extract keywords from service names for badges
const getStatusBadges = (name: string) => {
  const lower = name.toLowerCase();
  const badges = [];
  if (lower.includes('real') || lower.includes('hq')) badges.push({ text: 'HQ', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' });
  if (lower.includes('instant') || lower.includes('fast')) badges.push({ text: 'FAST', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' });
  if (lower.includes('no refill') || lower.includes('drop')) badges.push({ text: 'STABLE', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' });
  if (lower.includes('new') || lower.includes('update')) badges.push({ text: 'NEW', color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' });
  return badges.slice(0, 2);
};

export default function ServicesPageView({ scrollContainerRef }: any) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(25);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 40;

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSmmApi({ action: 'services' });
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        setError('Communication error: Node structure mismatch.');
      }
    } catch (err) {
      setError('Protocol timeout: Server node unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setCategoriesOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(services.map(s => String(s.category))))];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.service.toString().includes(searchTerm);
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, activeCategory]);

  const visibleServices = useMemo(() => {
    return filteredServices.slice(0, visibleCount);
  }, [filteredServices, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

const scrollToTop = () => {
  if (scrollContainerRef?.current) {
    scrollContainerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  setShowHeader(true);
  setLastScrollY(0);
};

    const handleAddToOrder = (service: any) => {
    // Navigate to orders page with service data in state
    navigate('/dashboard/orders', { 
      state: { 
        selectedService: {
          id: service.service.toString(),
          name: service.name,
          rate: service.rate,
          min: service.min,
          max: service.max
        }
      }
    });
  };

  return (
    <div className="relative animate-fade-in pb-32">
      {/* Invisible anchor at very top for scroll reference */}
      <div ref={topRef} className="absolute top-0 left-0 w-0 h-0" />
      
      {/* Main Header - No sticky, just normal flow with transform hide/show */}
      <div 
        className={`-mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 pt-6 md:pt-8 pb-6 bg-[#fcfdfe] dark:bg-[#020617] border-b border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300 ${
          showHeader ? 'translate-y-0 opacity-100 relative' : '-translate-y-full opacity-0 pointer-events-none absolute'
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Protocol Directory</h1>
              <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] text-[9px] mt-1.5 flex items-center gap-2">
                <Activity size={10} className="text-blue-500 animate-pulse" />
                {filteredServices.length} Active Entry Nodes
              </p>
            </div>
            
            <button 
              onClick={loadServices} 
              disabled={loading}
              className="hidden md:flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-blue-500 transition-all shadow-sm active:scale-95"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="text-[9px] font-black uppercase tracking-widest">Resync Node</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search Protocol ID or Name..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(25); }}
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-6 font-bold text-sm focus:border-blue-600 outline-none transition-all shadow-inner text-slate-900 dark:text-white"
              />
            </div>
            
<div className="relative flex flex-col lg:flex-row gap-3">
  {/* Categories Menu Button */}
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={() => setCategoriesOpen(!categoriesOpen)}
      className="flex items-center justify-between w-40 px-5 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-sm shadow-md hover:shadow-xl transition-all hover:bg-blue-50 dark:hover:bg-slate-800 focus:outline-none"
    >
      Categories
      <ChevronUp
        className={`w-4 h-4 transform transition-transform duration-300 ${
          categoriesOpen ? 'rotate-180' : ''
        }`}
      />
    </button>

{/* Dropdown Menu */}
{categoriesOpen && (
  <div className="absolute z-50 mt-2 w-60 max-h-72 overflow-y-auto bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-2 backdrop-blur-sm">

    <div className="space-y-1">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => {
            setActiveCategory(cat);
            setVisibleCount(25);
            setCategoriesOpen(false);
          }}
          className={`group w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-between ${
            activeCategory === cat
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>{cat}</span>

          {/* Small indicator dot */}
          {activeCategory === cat && (
            <span className="w-2 h-2 bg-white rounded-full"></span>
          )}
        </button>
      ))}
    </div>

  </div>
)}

  </div>
</div>

          </div>
        </div>
      </div>

      {/* Sticky Mini Header - Only appears when main header is hidden - COMPLETELY REMOVED FROM LAYOUT WHEN HIDDEN */}
      {!showHeader && (
        <div className="sticky top-0 z-40 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-3 bg-[#fcfdfe]/95 dark:bg-[#020617]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search protocols..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(25); }}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-4 font-bold text-xs focus:border-blue-600 outline-none transition-all"
                />
              </div>
              
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5 md:max-w-md">
                {categories.slice(0, 8).map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => { setActiveCategory(cat); setVisibleCount(25); }}
                    className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all border flex-shrink-0 ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid - NO MARGIN/PADDING AT ALL */}
      <div className="mt-1.5 pt-1.5">
        {/* Desktop Data Grid */}
        <div className="hidden md:block bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">ID</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Protocol Details</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Rate / 1k</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Payload Limits</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 className="mx-auto animate-spin text-blue-600 mb-4" size={32} />
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em]">Establishing Matrix Link...</p>
                  </td>
                </tr>
              ) : visibleServices.length > 0 ? (
                visibleServices.map((service: any) => (
                  <tr key={service.service} className="hover:bg-blue-600/5 transition-all group cursor-default">
                    <td className="px-8 py-6 font-black text-blue-600 text-xs">#{service.service}</td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2 mb-2">
                        {getStatusBadges(service.name).map((b, idx) => (
                          <span key={idx} className={`${b.color} border text-[7px] font-black px-1.5 py-0.5 rounded-md`}>{b.text}</span>
                        ))}
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-blue-500 transition-colors">{service.name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 opacity-60">
                        <Globe size={10} /> {service.category}
                      </p>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 dark:text-white text-base">${service.rate}</td>
                    <td className="px-8 py-6">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter bg-slate-100 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                        {service.min.toLocaleString()} - {service.max.toLocaleString()}
                      </span>
                    </td>
<td className="px-8 py-6 text-center">
  <button 
    onClick={() => handleAddToOrder(service)}
    className="bg-blue-600 text-white p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
  >
    <PlusCircle size={18} />
  </button>
</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol mismatch: Sector empty</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Grid Layout - Dynamic Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
             <div className="py-16 text-center"><Loader2 className="mx-auto animate-spin text-blue-600" /></div>
          ) : visibleServices.map((service: any) => (
            <div key={service.service} className="bg-white dark:bg-white/5 p-5 rounded-[1.8rem] border border-slate-200 dark:border-white/10 shadow-sm active:scale-[0.98] transition-all">
              <div className="flex justify-between items-start gap-4 mb-4">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[8px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-0.5 rounded-md">ID: {service.service}</span>
                      {getStatusBadges(service.name).map((b, idx) => (
                        <span key={idx} className={`${b.color} border text-[7px] font-black px-1.5 py-0.5 rounded-md`}>{b.text}</span>
                      ))}
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm leading-tight tracking-tight">{service.name}</h4>
                 </div>
<button 
  onClick={() => handleAddToOrder(service)}
  className="shrink-0 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20"
>
  <PlusCircle size={20} />
</button>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/5">
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Rate / 1k</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">${service.rate}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Payload range</p>
                    <p className="text-[10px] font-black text-slate-500 tracking-tighter">{service.min.toLocaleString()} - {service.max.toLocaleString()}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Scroll Interface */}
      {!loading && filteredServices.length > visibleCount && (
        <div className="flex flex-col items-center gap-6 mt-12 mb-10">
          <div className="h-1.5 w-32 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-600 transition-all duration-500" 
               style={{ width: `${(visibleCount / filteredServices.length) * 100}%` }}
             ></div>
          </div>
          <button 
            onClick={handleLoadMore}
            className="group flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-8 py-4 rounded-2xl font-black text-xs text-slate-900 dark:text-white hover:border-blue-500 hover:text-blue-500 transition-all shadow-xl shadow-black/5 active:scale-95"
          >
            Load More Protocols <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Floating Scroll To Top for Mobile UX - FIXED WITH DIRECT FUNCTION CALL */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 md:right-10 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-blue-600 shadow-2xl border border-slate-200 dark:border-white/10 z-50 md:hidden active:scale-90 transition-transform hover:bg-blue-600 hover:text-white"
      >
        <ChevronUp size={24} />
      </button>

      {/* Success/Error States */}
      {error && !loading && (
        <div className="py-20 text-center">
          <div className="bg-red-500/10 text-red-500 p-8 rounded-[2rem] border border-red-500/20 max-w-sm mx-auto inline-block">
             <Zap size={24} className="mx-auto mb-3" />
             <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
             <button onClick={loadServices} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase">Force Re-Entry</button>
          </div>
        </div>
      )}
    </div>
  );
}
