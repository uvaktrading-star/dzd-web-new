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

export default function ServicesPageView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(25);
  const [hideHeader, setHideHeader] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const PAGE_SIZE = 40;

  // Simple scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide header when scrolling down, show when at top
      if (currentScrollY > 50) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      
      // Show scroll button when scrolled down
      setShowScrollTop(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative animate-fade-in pb-32">
      {/* Protocol Directory Header - ALWAYS VISIBLE AT TOP, hides when scrolling down */}
      <div className={`
        fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-12
        pt-4 pb-4 bg-[#fcfdfe] dark:bg-[#020617] border-b border-slate-200 dark:border-white/5
        transition-transform duration-300
        ${hideHeader ? '-translate-y-full' : 'translate-y-0'}
      `}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                  Protocol Directory
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] mt-1 flex items-center gap-1">
                  <Activity size={8} className="text-blue-500" />
                  {filteredServices.length} ACTIVE ENTRY NODES
                </p>
              </div>
              <button 
                onClick={loadServices} 
                disabled={loading}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 hover:text-blue-600 text-[9px] font-black uppercase tracking-widest"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                Resync
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Protocol ID or Name..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(25); }}
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-sm focus:border-blue-500 outline-none"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.slice(0, 15).map(cat => (
                <button 
                  key={cat} 
                  onClick={() => { setActiveCategory(cat); setVisibleCount(25); }}
                  className={`
                    px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap border
                    ${activeCategory === cat 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-blue-500'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer - Pushes content below fixed header */}
      <div className="h-[140px] md:h-[160px]" />

      {/* Services Content */}
      <div className="px-4 md:px-8 lg:px-12">
        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-[#0f172a]/40 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-left">ID</th>
                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-left">Protocol Details</th>
                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-left">Rate / 1k</th>
                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-left">Payload Limits</th>
                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleServices.map((service: any) => (
                <tr key={service.service} className="border-t border-slate-100 dark:border-white/5 hover:bg-blue-50/50 dark:hover:bg-blue-950/20">
                  <td className="px-6 py-5 font-bold text-blue-600 text-xs">#{service.service}</td>
                  <td className="px-6 py-5">
                    <div className="flex gap-1 mb-2 flex-wrap">
                      {getStatusBadges(service.name).map((b, idx) => (
                        <span key={idx} className={`${b.color} border text-[6px] font-black px-1.5 py-0.5 rounded`}>{b.text}</span>
                      ))}
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{service.name}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{service.category}</p>
                  </td>
                  <td className="px-6 py-5 font-black text-slate-900 dark:text-white">${service.rate}</td>
                  <td className="px-6 py-5">
                    <span className="text-[8px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-1 rounded">
                      {service.min.toLocaleString()} - {service.max.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <PlusCircle size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Full Service Names */}
        <div className="md:hidden space-y-3">
          {visibleServices.map((service: any) => (
            <div key={service.service} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                    <span className="text-[7px] font-black text-blue-600 uppercase bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
                      ID: {service.service}
                    </span>
                    {getStatusBadges(service.name).map((b, idx) => (
                      <span key={idx} className={`${b.color} border text-[6px] font-black px-1.5 py-0.5 rounded`}>
                        {b.text}
                      </span>
                    ))}
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm leading-relaxed break-words">
                    {service.name}
                  </h4>
                </div>
                <button className="shrink-0 w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <PlusCircle size={18} />
                </button>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5">
                <div>
                  <p className="text-[6px] font-black text-slate-400 uppercase tracking-wider">Rate / 1k</p>
                  <p className="text-base font-black text-slate-900 dark:text-white">${service.rate}</p>
                </div>
                <div className="text-right">
                  <p className="text-[6px] font-black text-slate-400 uppercase tracking-wider">Payload range</p>
                  <p className="text-[9px] font-black text-slate-600 dark:text-slate-400">
                    {service.min.toLocaleString()} - {service.max.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      {!loading && filteredServices.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleLoadMore}
            className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-xl text-xs font-black hover:border-blue-500 transition-colors"
          >
            Load More Protocols <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg z-50"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}
