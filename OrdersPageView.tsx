import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Loader2, 
  RefreshCw, 
  PlusCircle, 
  Activity, 
  Zap, 
  ArrowRight,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Calendar,
  ShoppingCart,
  Link2,
  DollarSign,
  Hash,
  Send,
  Copy,
  Wallet
} from 'lucide-react';
import { fetchSmmApi } from './DashboardPage';
import { auth, db } from './firebase';
import { 
  saveOrderToFirestore, 
  getUserOrders, 
  updateOrderStatus
} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

// Exchange rate API
const EXCHANGE_API = "https://v6.exchangerate-api.com/v6/be291495375008a1e603a49a/latest/USD";
const WORKER_URL = "https://dzd-billing-api.sitewasd2026.workers.dev";
const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000;

// Order status badge component
const getOrderStatusBadge = (status: string) => {
  const lower = status?.toLowerCase() || '';
  
  if (lower.includes('completed') || lower.includes('done') || lower.includes('success')) {
    return { text: 'COMPLETED', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle };
  }
  if (lower.includes('processing') || lower.includes('in progress')) {
    return { text: 'PROCESSING', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Clock };
  }
  if (lower.includes('pending') || lower.includes('waiting')) {
    return { text: 'PENDING', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: AlertCircle };
  }
  if (lower.includes('cancel') || lower.includes('failed') || lower.includes('error')) {
    return { text: 'CANCELED', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle };
  }
  if (lower.includes('partial')) {
    return { text: 'PARTIAL', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: AlertCircle };
  }
  if (lower.includes('refund')) {
    return { text: 'REFUNDED', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: XCircle };
  }
  return { text: status?.toUpperCase() || 'UNKNOWN', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20', icon: AlertCircle };
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// LKR to USD conversion helper
const convertLkrToUsd = (lkrAmount: number, rate: number): number => {
  return lkrAmount / rate;
};

// USD to LKR conversion helper
const convertUsdToLkr = (usdAmount: number, rate: number): number => {
  return usdAmount * rate;
};

// Calculate price with 50 LKR profit
const calculatePriceWithProfit = (usdRate: number, quantity: number, serviceRate: number): { usd: number, lkr: number } => {
  // Calculate base price in USD (rate per 1000)
  const baseUsdPrice = (quantity / 1000) * serviceRate;
  
  // Convert to LKR
  const baseLkrPrice = convertUsdToLkr(baseUsdPrice, usdRate);
  
  // Add 50 LKR profit
  const lkrWithProfit = baseLkrPrice + 50;
  
  // Convert back to USD for display
  const usdWithProfit = convertLkrToUsd(lkrWithProfit, usdRate);
  
  return {
    usd: usdWithProfit,
    lkr: lkrWithProfit
  };
};

export default function OrdersPageView({ scrollContainerRef }: any) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Refs
  const dropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const topRef = useRef<HTMLDivElement>(null);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // UI State
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [activeView, setActiveView] = useState<'orders' | 'new'>('orders');
  
  // Data State
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [refreshing, setRefreshing] = useState(false);
  
  // Order Form State
  const [selectedService, setSelectedService] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [serviceDetails, setServiceDetails] = useState<any>(null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customComments, setCustomComments] = useState('');
  const [usernames, setUsernames] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [orderError, setOrderError] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [navigationLoading, setNavigationLoading] = useState(false);
  
  // Wallet Balance State
  const [userBalance, setUserBalance] = useState({ total_balance: "0.00", pending_balance: "0.00" });
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  
  // USD Rate State
  const [usdRate, setUsdRate] = useState(310); // Default rate

  const PAGE_SIZE = 30;

  // ============================================
  // FETCH USD EXCHANGE RATE (Every 6 Hours)
  // ============================================
  useEffect(() => {
    const fetchUsdRate = async () => {
      try {
        const res = await fetch(EXCHANGE_API);
        const data = await res.json();
        if (data.result === "success") {
          setUsdRate(data.conversion_rates.LKR);
          console.log(`Rate Updated: 1 USD = ${data.conversion_rates.LKR} LKR`);
        }
      } catch (err) {
        console.error("Exchange API failed, using default 310", err);
      }
    };

    fetchUsdRate();
    const interval = setInterval(fetchUsdRate, SIX_HOURS_IN_MS);
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // FETCH USER BALANCE
  // ============================================
  const fetchUserBalance = async (uid: string) => {
    try {
      const WORKER_URL = "https://dzd-billing-api.sitewasd2026.workers.dev";
      const response = await fetch(`${WORKER_URL}/get-balance?userId=${uid}`);
      const data = await response.json();
      setUserBalance({
        total_balance: parseFloat(data.total_balance || 0).toFixed(2),
        pending_balance: parseFloat(data.pending_balance || 0).toFixed(2)
      });
    } catch (error) { 
      console.error("Balance fetch error:", error); 
    }
  };

  // ============================================
  // AUTH STATE LISTENER
  // ============================================
  useEffect(() => {
    const state = location.state as any;
    if (state?.selectedService) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setNavigationLoading(true);
      setActiveView('new');
      
      const { id, name, rate, min, max } = state.selectedService;
      
      setSelectedService(name);
      setSelectedServiceId(id);
      
      setTimeout(() => {
        setServiceDetails({
          service: parseInt(id),
          name: name,
          rate: rate,
          min: min,
          max: max
        });
        setQuantity(min.toString());
        setNavigationLoading(false);
      }, 500);
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserBalance(user.uid);
      } else {
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // ============================================
  // LOAD SERVICES FROM SMM API
  // ============================================
  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const data = await fetchSmmApi({ action: 'services' });
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  // ============================================
  // LOAD USER ORDERS FROM FIRESTORE
  // ============================================
  const loadUserOrders = async () => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userOrders = await getUserOrders(currentUser.uid);
      setOrders(userOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // REFRESH ORDER STATUSES FROM SMM API
  // ============================================
  const refreshOrderStatuses = async () => {
    if (!orders.length || !currentUser) return;
    
    setRefreshing(true);
    
    try {
      const updatedOrders = await Promise.all(
        orders.map(async (order) => {
          try {
            const statusData = await fetchSmmApi({
              action: 'status',
              order: order.orderId
            });
            
            await updateOrderStatus(order.id, statusData);
            
            return {
              ...order,
              status: statusData.status,
              remains: statusData.remains,
              charge: statusData.charge,
              start_count: statusData.start_count,
              currency: statusData.currency
            };
          } catch (err) {
            console.error(`Failed to update order ${order.orderId}:`, err);
            return order;
          }
        })
      );
      
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Status refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // ============================================
  // INITIAL LOADS
  // ============================================
  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (currentUser && activeView === 'orders') {
      loadUserOrders();
    }
  }, [currentUser, activeView]);

  useEffect(() => {
    if (!currentUser || activeView !== 'orders' || !orders.length) return;
    
    refreshOrderStatuses();
    const interval = setInterval(refreshOrderStatuses, 30000);
    
    return () => clearInterval(interval);
  }, [currentUser, activeView, orders.length]);

  // ============================================
  // CHECK BALANCE WHEN QUANTITY OR SERVICE CHANGES
  // ============================================
  useEffect(() => {
    if (serviceDetails && quantity && currentUser) {
      const totalPrice = calculatePriceWithProfit(
        usdRate,
        parseInt(quantity) || 0,
        parseFloat(serviceDetails.rate)
      );
      
      const balance = parseFloat(userBalance.total_balance);
      setInsufficientBalance(totalPrice.lkr > balance);
    }
  }, [serviceDetails, quantity, userBalance, usdRate, currentUser]);

  // ============================================
  // SCROLL HANDLERS
  // ============================================
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // ============================================
  // CLICK OUTSIDE HANDLERS
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setFilterOpen(false);
      }
      if (dateDropdownRef.current && !(dateDropdownRef.current as any).contains(event.target)) {
        setDateFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================
  // SERVICE SELECTION HANDLER
  // ============================================
  useEffect(() => {
    if (selectedServiceId) {
      const service = services.find(s => s.service.toString() === selectedServiceId);
      setServiceDetails(service || null);
      if (service) {
        setQuantity(service.min.toString());
      }
    } else {
      setServiceDetails(null);
    }
  }, [selectedServiceId, services]);

  // ============================================
  // FILTERS
  // ============================================
  const statusFilters = useMemo(() => {
    return ['All', 'Pending', 'Processing', 'In progress', 'Completed', 'Partial', 'Canceled', 'Refunded'];
  }, []);

  const dateFilters = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'This month', 'All time'];

  // Filter orders based on search, status, and date
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.orderId?.toString().includes(searchTerm) || 
        order.serviceId?.toString().includes(searchTerm) ||
        (order.link && order.link.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.serviceName && order.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = activeStatus === 'All' || 
        order.status?.toLowerCase() === activeStatus.toLowerCase() ||
        order.status?.toLowerCase().includes(activeStatus.toLowerCase());
      
      let matchesDate = true;
      if (dateRange !== 'All time' && order.date) {
        const orderDate = new Date(order.date);
        const today = new Date();
        
        if (dateRange === 'Today') {
          matchesDate = orderDate.toDateString() === today.toDateString();
        } else if (dateRange === 'Yesterday') {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDate = orderDate.toDateString() === yesterday.toDateString();
        } else if (dateRange === 'Last 7 days') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = orderDate >= weekAgo;
        } else if (dateRange === 'Last 30 days') {
          const monthAgo = new Date(today);
          monthAgo.setDate(monthAgo.getDate() - 30);
          matchesDate = orderDate >= monthAgo;
        } else if (dateRange === 'This month') {
          matchesDate = orderDate.getMonth() === today.getMonth() && 
                       orderDate.getFullYear() === today.getFullYear();
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  }, [orders, searchTerm, activeStatus, dateRange]);

  const visibleOrders = useMemo(() => {
    return filteredOrders.slice(0, visibleCount);
  }, [filteredOrders, visibleCount]);

  // Filter services for dropdown
  const filteredServices = useMemo(() => {
    return services.filter(s => 
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.service.toString().includes(serviceSearch) ||
      (s.category && s.category.toLowerCase().includes(serviceSearch.toLowerCase()))
    ).slice(0, 20);
  }, [services, serviceSearch]);

  // ============================================
  // ORDER STATS (with profit included in charges)
  // ============================================
  const orderStats = useMemo(() => {
    const total = filteredOrders.length;
    const completed = filteredOrders.filter(o => 
      o.status?.toLowerCase().includes('completed') || 
      o.status?.toLowerCase().includes('success')
    ).length;
    const pending = filteredOrders.filter(o => 
      o.status?.toLowerCase().includes('pending')
    ).length;
    const processing = filteredOrders.filter(o => 
      o.status?.toLowerCase().includes('processing') || 
      o.status?.toLowerCase().includes('progress')
    ).length;
    
    // Calculate total spent including profit
    const totalSpentLkr = filteredOrders.reduce((sum, order) => {
      const charge = parseFloat(order.charge || 0);
      return sum + (isNaN(charge) ? 0 : charge);
    }, 0);
    
    const totalSpentUsd = convertLkrToUsd(totalSpentLkr, usdRate);
    
    return { 
      total, 
      completed, 
      pending, 
      processing, 
      totalSpentLkr: totalSpentLkr.toFixed(2),
      totalSpentUsd: totalSpentUsd.toFixed(2)
    };
  }, [filteredOrders, usdRate]);

// ============================================
// PLACE ORDER - WITH WALLET DEDUCTION
// ============================================
const placeOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!currentUser) {
    setOrderError('You must be logged in to place an order');
    return;
  }

  if (!selectedServiceId || !link || !quantity) {
    setOrderError('Service, link, and quantity are required');
    return;
  }

  // Calculate price with profit
  const priceWithProfit = calculatePriceWithProfit(
    usdRate,
    parseInt(quantity) || 0,
    parseFloat(serviceDetails?.rate || 0)
  );

  // Check if user has sufficient balance
  if (priceWithProfit.lkr > parseFloat(userBalance.total_balance)) {
    setOrderError(`Insufficient balance. You need LKR ${priceWithProfit.lkr.toFixed(2)} but have LKR ${userBalance.total_balance}`);
    return;
  }

  setOrderLoading(true);
  setOrderError('');
  setOrderSuccess(null);

  try {
    // Prepare API parameters
    const params: Record<string, string> = {
      action: 'add',
      service: selectedServiceId,
      link: link,
      quantity: quantity
    };

    if (customComments) params.comments = customComments;
    if (usernames) params.usernames = usernames;

    // 1. Call SMM API to place order
    const data = await fetchSmmApi(params);
    
    if (data && data.order) {
      // 2. Deduct amount from wallet using the worker endpoint
      const deductionResponse = await fetch(`${WORKER_URL}/deduct-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          amount: priceWithProfit.lkr,
          description: `Order #${data.order} - ${serviceDetails?.name || 'SMM Order'}`
        }),
      });

      const deductionResult = await deductionResponse.json();

      if (!deductionResult.success) {
        throw new Error(deductionResult.error || 'Failed to deduct from wallet. Order cancelled.');
      }

      // 3. Save order to Firestore with user ID (store the LKR amount with profit)
      const orderData = {
        orderId: data.order,
        serviceId: selectedServiceId,
        serviceName: serviceDetails?.name || `Service #${selectedServiceId}`,
        link: link,
        quantity: parseInt(quantity),
        charge: priceWithProfit.lkr.toFixed(2), // Store LKR amount with profit
        chargeUsd: priceWithProfit.usd.toFixed(2), // Store USD equivalent
        status: 'Pending',
        remains: parseInt(quantity),
        date: new Date().toISOString()
      };

      await saveOrderToFirestore(currentUser.uid, orderData);
      
      // 4. Refresh balance
      await fetchUserBalance(currentUser.uid);
      
      // 5. Show success message
      setOrderSuccess({
        order: data.order,
        message: 'Order placed successfully!',
        price: {
          lkr: priceWithProfit.lkr.toFixed(2),
          usd: priceWithProfit.usd.toFixed(2)
        }
      });
      
      // 6. Reset form
      setSelectedService('');
      setSelectedServiceId('');
      setServiceDetails(null);
      setLink('');
      setQuantity('');
      setCustomComments('');
      setUsernames('');
      setServiceSearch('');
      setShowServiceDropdown(false);
      
      // 7. Reload orders
      await loadUserOrders();
      
      // 8. Switch to orders view after 2 seconds
      setTimeout(() => {
        setActiveView('orders');
        setOrderSuccess(null);
      }, 2000);
    } else if (data && data.error) {
      setOrderError(data.error);
    } else {
      setOrderError('Failed to place order. Unknown response.');
    }
  } catch (err: any) {
    setOrderError(err.message || 'Order placement failed. Please try again.');
  } finally {
    setOrderLoading(false);
  }
};

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.toString());
  };

  const handleManualRefresh = async () => {
    await loadUserOrders();
    await refreshOrderStatuses();
    if (currentUser) {
      await fetchUserBalance(currentUser.uid);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="relative animate-fade-in pb-32">
      {/* Invisible anchor at very top for scroll reference */}
      <div ref={topRef} className="absolute top-0 left-0 w-0 h-0" />
      
      {/* Main Header */}
      <div 
        className={`-mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 pt-6 md:pt-8 pb-6 bg-[#fcfdfe] dark:bg-[#020617] border-b border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300 ${
          showHeader ? 'translate-y-0 opacity-100 relative' : '-translate-y-full opacity-0 pointer-events-none absolute'
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                {activeView === 'orders' ? 'Mission Logs' : 'New Mission'}
              </h1>
              <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] text-[9px] mt-1.5 flex items-center gap-2">
                <Activity size={10} className="text-blue-500 animate-pulse" />
                {activeView === 'orders' 
                  ? currentUser 
                    ? `${filteredOrders.length} Active Transactions` 
                    : 'Sign in to view orders'
                  : 'Deploy New Order'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Balance Display - NEW */}
              {currentUser && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
                  <Wallet size={14} />
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black uppercase tracking-wider opacity-80">Balance</span>
                    <span className="text-xs font-black">LKR {userBalance.total_balance}</span>
                  </div>
                </div>
              )}

              {/* View toggle buttons */}
              <button
                onClick={() => {
                  setActiveView('orders');
                  setOrderSuccess(null);
                  setOrderError('');
                }}
                className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                  activeView === 'orders'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/5 hover:border-blue-500'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => {
                  if (!currentUser) {
                    setOrderError('Please sign in to place an order');
                    return;
                  }
                  setActiveView('new');
                  setOrderSuccess(null);
                  setOrderError('');
                }}
                className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                  activeView === 'new'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/5 hover:border-blue-500'
                }`}
              >
                <PlusCircle size={14} />
                New Order
              </button>
              
              {currentUser && activeView === 'orders' && (
                <button 
                  onClick={handleManualRefresh} 
                  disabled={loading || refreshing}
                  className="hidden md:flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-blue-500 transition-all shadow-sm active:scale-95"
                >
                  <RefreshCw size={14} className={(loading || refreshing) ? 'animate-spin' : ''} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Sync</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards - Desktop - UPDATED with LKR/USD */}
          {activeView === 'orders' && currentUser && (
            <div className="hidden md:grid grid-cols-4 gap-4 pt-2">
              <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-4">
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Total Orders</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{orderStats.total}</p>
              </div>
              <div className="bg-emerald-500/5 rounded-2xl border border-emerald-500/20 p-4">
                <p className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Completed</p>
                <p className="text-2xl font-black text-emerald-500">{orderStats.completed}</p>
              </div>
              <div className="bg-amber-500/5 rounded-2xl border border-amber-500/20 p-4">
                <p className="text-[8px] font-black uppercase text-amber-500 tracking-widest">In Progress</p>
                <p className="text-2xl font-black text-amber-500">{orderStats.processing + orderStats.pending}</p>
              </div>
              <div className="bg-blue-500/5 rounded-2xl border border-blue-500/20 p-4">
                <p className="text-[8px] font-black uppercase text-blue-500 tracking-widest">Total Spent</p>
                <div>
                  <p className="text-2xl font-black text-blue-500">LKR {orderStats.totalSpentLkr}</p>
                  <p className="text-[8px] font-bold text-blue-400/70">≈ ${orderStats.totalSpentUsd}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mini Header - Only appears when main header is hidden */}
      {!showHeader && activeView === 'orders' && currentUser && (
        <div className="sticky top-0 z-40 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-3 bg-[#fcfdfe]/95 dark:bg-[#020617]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search order ID, service, link..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(20); }}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-4 font-bold text-xs focus:border-blue-600 outline-none transition-all"
                />
              </div>
              
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {statusFilters.slice(0, 4).map(status => (
                  <button 
                    key={status} 
                    onClick={() => { setActiveStatus(status); setVisibleCount(20); }}
                    className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all border flex-shrink-0 ${
                      activeStatus === status 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Mini Balance - Mobile */}
              <div className="flex items-center gap-2 bg-blue-600/10 px-3 py-1.5 rounded-lg md:hidden">
                <Wallet size={12} className="text-blue-600" />
                <span className="text-[8px] font-black text-blue-600">LKR {userBalance.total_balance}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mini Header for New Order */}
      {!showHeader && activeView === 'new' && (
        <div className="sticky top-0 z-40 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-3 bg-[#fcfdfe]/95 dark:bg-[#020617]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <ShoppingCart size={16} className="text-blue-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Deploy New Mission
              </p>
              {currentUser && (
                <div className="ml-auto flex items-center gap-1 bg-blue-600/10 px-2 py-1 rounded-lg">
                  <Wallet size={10} className="text-blue-600" />
                  <span className="text-[7px] font-black text-blue-600">LKR {userBalance.total_balance}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="mt-1.5 pt-1.5">
         {/* Not logged in state */}
        {!currentUser ? (         
          <div className="max-w-3xl mx-auto py-20 text-center">
            <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-12">
              <Activity size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Sign In Required</h3>
              <p className="text-sm text-slate-500 mb-6">Please sign in to view your orders and place new missions</p>
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">
                Sign In
              </button>
            </div>
          </div>
        ) : activeView === 'orders' ? (
          /* ORDERS VIEW */
          <>
            {/* Desktop Orders Table */}
            <div className="hidden md:block bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
              {/* Filters Bar */}
              <div className="p-5 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Status Filter Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setFilterOpen(!filterOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-blue-500 transition-all"
                    >
                      <Filter size={12} />
                      {activeStatus}
                    </button>
                    {filterOpen && (
                      <div className="absolute z-50 mt-2 w-48 bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-2">
                        {statusFilters.map(status => (
                          <button
                            key={status}
                            onClick={() => {
                              setActiveStatus(status);
                              setFilterOpen(false);
                              setVisibleCount(20);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                              activeStatus === status
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date Filter Dropdown */}
                  <div className="relative" ref={dateDropdownRef}>
                    <button
                      onClick={() => setDateFilterOpen(!dateFilterOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-blue-500 transition-all"
                    >
                      <Calendar size={12} />
                      {dateRange}
                    </button>
                    {dateFilterOpen && (
                      <div className="absolute z-50 mt-2 w-48 bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-2">
                        {dateFilters.map(date => (
                          <button
                            key={date}
                            onClick={() => {
                              setDateRange(date);
                              setDateFilterOpen(false);
                              setVisibleCount(20);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                              dateRange === date
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {date}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Manual refresh button for mobile/desktop */}
                  <button 
                    onClick={handleManualRefresh} 
                    disabled={loading || refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-blue-500 transition-all md:hidden"
                  >
                    <RefreshCw size={12} className={(loading || refreshing) ? 'animate-spin' : ''} />
                    Sync
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {(refreshing) && (
                    <span className="text-[9px] font-bold text-blue-500 flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" />
                      Updating...
                    </span>
                  )}
                  <span className="text-[9px] font-bold text-slate-400">
                    Showing {visibleOrders.length} of {filteredOrders.length}
                  </span>
                </div>
              </div>

              {/* Orders Table */}
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Service</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Link</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Quantity</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Charge</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Remains</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-24 text-center">
                        <Loader2 className="mx-auto animate-spin text-blue-600 mb-4" size={32} />
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em]">Loading Mission Logs...</p>
                      </td>
                    </tr>
                  ) : visibleOrders.length > 0 ? (
                    visibleOrders.map((order: any) => {
                      const statusBadge = getOrderStatusBadge(order.status || 'Pending');
                      const StatusIcon = statusBadge.icon;
                      
                      return (
                        <tr key={order.id} className="hover:bg-blue-600/5 transition-all group cursor-default">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-blue-600 text-xs">#{order.orderId}</span>
                              <button 
                                onClick={() => copyToClipboard(order.orderId)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Copy size={12} className="text-slate-400 hover:text-blue-500" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-bold text-slate-900 dark:text-white text-xs">
                              {order.serviceName}
                            </p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                              ID: {order.serviceId}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            {order.link ? (
                              <a 
                                href={order.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:underline max-w-[150px] truncate"
                              >
                                <Link2 size={10} />
                                {order.link.replace(/^https?:\/\//, '').substring(0, 20)}...
                              </a>
                            ) : (
                              <span className="text-[9px] text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-5 font-bold text-slate-900 dark:text-white text-sm">
                            {order.quantity?.toLocaleString()}
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-black text-slate-900 dark:text-white text-sm">
                              LKR {parseFloat(order.charge || 0).toFixed(2)}
                            </div>
                            {order.chargeUsd && (
                              <div className="text-[8px] font-bold text-slate-400">
                                ≈ ${order.chargeUsd}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <span className={`${statusBadge.color} border text-[8px] font-black px-2 py-1 rounded-md flex items-center gap-1 w-fit`}>
                              <StatusIcon size={10} />
                              {statusBadge.text}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-[10px] font-medium text-slate-500">
                            {order.date ? formatDate(order.date) : '—'}
                          </td>
                          <td className="px-6 py-5 text-center font-bold text-slate-900 dark:text-white">
                            {order.remains?.toLocaleString() || '0'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-20 text-center">
                        <div className="flex flex-col items-center">
                          <AlertCircle size={32} className="text-slate-400 mb-3" />
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No orders found</p>
                          <button 
                            onClick={() => setActiveView('new')}
                            className="mt-4 px-5 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                          >
                            <PlusCircle size={14} />
                            Place First Order
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Orders Cards */}
            <div className="md:hidden space-y-3">
              {/* Mobile Filters */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
                  >
                    <Filter size={12} />
                    {activeStatus}
                  </button>
                  {filterOpen && (
                    <div className="absolute z-50 mt-2 w-40 bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-2">
                      {statusFilters.map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            setActiveStatus(status);
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-bold uppercase ${
                            activeStatus === status
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative" ref={dateDropdownRef}>
                  <button
                    onClick={() => setDateFilterOpen(!dateFilterOpen)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
                  >
                    <Calendar size={12} />
                    {dateRange === 'All time' ? 'All' : dateRange}
                  </button>
                  {dateFilterOpen && (
                    <div className="absolute z-50 mt-2 w-40 bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-2">
                      {dateFilters.map(date => (
                        <button
                          key={date}
                          onClick={() => {
                            setDateRange(date);
                            setDateFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-bold uppercase ${
                            dateRange === date
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleManualRefresh} 
                  disabled={loading || refreshing}
                  className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl"
                >
                  <RefreshCw size={14} className={(loading || refreshing) ? 'animate-spin' : ''} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(20); }}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-9 pr-4 font-bold text-xs focus:border-blue-600 outline-none transition-all"
                />
              </div>

              {/* Order Cards */}
              {loading ? (
                <div className="py-16 text-center">
                  <Loader2 className="mx-auto animate-spin text-blue-600" size={32} />
                  <p className="text-[9px] font-black uppercase text-slate-400 mt-3">Loading orders...</p>
                </div>
              ) : visibleOrders.length > 0 ? (
                visibleOrders.map((order: any) => {
                  const statusBadge = getOrderStatusBadge(order.status || 'Pending');
                  const StatusIcon = statusBadge.icon;
                  
                  return (
                    <div 
                      key={order.id} 
                      className="bg-white dark:bg-white/5 p-5 rounded-[1.8rem] border border-slate-200 dark:border-white/10 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-1 rounded-md">
                            #{order.orderId}
                          </span>
                          <span className={`${statusBadge.color} border text-[8px] font-black px-2 py-1 rounded-md flex items-center gap-1`}>
                            <StatusIcon size={10} />
                            {statusBadge.text}
                          </span>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(order.orderId)}
                          className="p-2 text-slate-500 hover:text-blue-600"
                        >
                          <Copy size={14} />
                        </button>
                      </div>

                      <h4 className="font-black text-slate-900 dark:text-white text-sm mb-2">
                        {order.serviceName}
                      </h4>

                      {order.link && (
                        <a 
                          href={order.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] font-medium text-blue-600 mb-3 truncate"
                        >
                          <Link2 size={10} />
                          {order.link.substring(0, 40)}...
                        </a>
                      )}

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Quantity</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            {order.quantity?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Charge</p>
                          <div>
                            <p className="text-sm font-black text-blue-600">
                              LKR {parseFloat(order.charge || 0).toFixed(2)}
                            </p>
                            {order.chargeUsd && (
                              <p className="text-[7px] font-bold text-slate-400">
                                ≈ ${order.chargeUsd}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                          <p className="text-[9px] font-medium text-slate-500">
                            {order.date ? formatDate(order.date) : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Remains</p>
                          <p className="text-[9px] font-medium text-slate-500">
                            {order.remains?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10">
                  <AlertCircle size={32} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-[10px] font-black uppercase text-slate-400">No orders found</p>
                  <button 
                    onClick={() => setActiveView('new')}
                    className="mt-4 px-5 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2"
                  >
                    <PlusCircle size={14} />
                    Place Order
                  </button>
                </div>
              )}

              {/* Load More - Mobile */}
              {!loading && filteredOrders.length > visibleCount && (
                <button 
                  onClick={handleLoadMore}
                  className="w-full py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-black text-xs text-slate-900 dark:text-white flex items-center justify-center gap-2"
                >
                  Load More <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Desktop Load More */}
            {!loading && filteredOrders.length > visibleCount && (
              <div className="hidden md:flex flex-col items-center gap-6 mt-12 mb-10">
                <div className="h-1.5 w-32 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500" 
                    style={{ width: `${(visibleCount / filteredOrders.length) * 100}%` }}
                  ></div>
                </div>
                <button 
                  onClick={handleLoadMore}
                  className="group flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-8 py-4 rounded-2xl font-black text-xs text-slate-900 dark:text-white hover:border-blue-500 hover:text-blue-500 transition-all shadow-xl active:scale-95"
                >
                  Load More Orders <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* NEW ORDER FORM VIEW */
          <div className="max-w-3xl mx-auto">
            {/* Success Message - UPDATED with LKR/USD */}
            {orderSuccess && (
              <div className="mb-6 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-emerald-500">Order Placed Successfully!</p>
                    <p className="text-[10px] font-bold text-emerald-600/70">Order ID: #{orderSuccess.order}</p>
                    <p className="text-[8px] font-bold text-emerald-600/50">
                      Charged: LKR {orderSuccess.price?.lkr} (${orderSuccess.price?.usd})
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setActiveView('orders');
                    setOrderSuccess(null);
                  }}
                  className="px-4 py-2 bg-emerald-500/20 rounded-xl text-[9px] font-black uppercase text-emerald-500"
                >
                  View Orders
                </button>
              </div>
            )}

            {/* Error Message */}
            {orderError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                <XCircle size={16} className="text-red-500" />
                <p className="text-[10px] font-bold text-red-500">{orderError}</p>
              </div>
            )}

            {/* Insufficient Balance Warning */}
            {insufficientBalance && serviceDetails && quantity && !orderError && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                <AlertCircle size={16} className="text-amber-500" />
                <p className="text-[9px] font-bold text-amber-500">
                  ⚠️ Insufficient funds. You need LKR {
                    calculatePriceWithProfit(
                      usdRate, 
                      parseInt(quantity) || 0, 
                      parseFloat(serviceDetails.rate)
                    ).lkr.toFixed(2)
                  } but have LKR {userBalance.total_balance}
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-slate-200 dark:border-white/5">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
                  <ShoppingCart size={24} className="text-blue-600" />
                  Deploy New Order
                </h2>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                  Fill the form below to start your mission
                </p>
              </div>

              <form onSubmit={placeOrder} className="p-6 md:p-8 space-y-6">
                {/* Service Selection */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Hash size={12} />
                    Select Service <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                      disabled={navigationLoading}
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-left flex justify-between items-center hover:border-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div>
                        {navigationLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <div>
                              <p className="text-sm font-medium text-slate-400">Loading service details...</p>
                              <p className="text-[8px] font-bold text-blue-500/70 mt-0.5">Preparing order form</p>
                            </div>
                          </div>
                        ) : serviceDetails ? (
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">
                              {serviceDetails.name}
                            </p>
                            <p className="text-[8px] font-bold text-slate-500 mt-0.5">
                              ID: {serviceDetails.service} | Min: {serviceDetails.min?.toLocaleString()} | Max: {serviceDetails.max?.toLocaleString()} | Rate: ${serviceDetails.rate}/1k
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400">Choose a service to deploy</p>
                        )}
                      </div>
                      {!navigationLoading && (
                        <ChevronUp size={16} className={`transform transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {showServiceDropdown && !navigationLoading && (
                      <div className="absolute z-50 mt-2 w-full bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-3 max-h-96 overflow-y-auto">
                        <div className="mb-3">
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search services..."
                              value={serviceSearch}
                              onChange={(e) => setServiceSearch(e.target.value)}
                              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-xs focus:border-blue-600 outline-none"
                              autoFocus
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {loadingServices ? (
                            <div className="py-8 text-center">
                              <Loader2 size={20} className="mx-auto animate-spin text-blue-600" />
                              <p className="text-[9px] font-black uppercase text-slate-400 mt-2">Loading services...</p>
                            </div>
                          ) : filteredServices.length > 0 ? (
                            filteredServices.map(service => (
                              <button
                                key={service.service}
                                type="button"
                                onClick={() => {
                                  setSelectedService(service.name);
                                  setSelectedServiceId(service.service.toString());
                                  setServiceSearch('');
                                  setShowServiceDropdown(false);
                                }}
                                className="w-full text-left px-3 py-3 rounded-lg hover:bg-blue-600/10 transition-all"
                              >
                                <p className="font-bold text-slate-900 dark:text-white text-xs">
                                  {service.name}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[8px] font-black text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                    ID: {service.service}
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-500">
                                    ${service.rate}/1k
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-500">
                                    {service.min}-{service.max}
                                  </span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <p className="py-4 text-center text-[10px] text-slate-500">No services found</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Link/Username Input */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Link2 size={12} />
                    Link / Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter profile URL or username"
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 font-bold text-sm focus:border-blue-600 outline-none transition-all"
                    required
                  />
                  <p className="text-[8px] text-slate-400 mt-1">
                    Enter the link to your video/profile or username
                  </p>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <DollarSign size={12} />
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder={serviceDetails ? `Min: ${serviceDetails.min} - Max: ${serviceDetails.max}` : 'Enter quantity'}
                    min={serviceDetails?.min || 10}
                    max={serviceDetails?.max || 1000000}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 font-bold text-sm focus:border-blue-600 outline-none transition-all"
                    required
                  />
                  
{/* Price Display - Final Price Only */}
{serviceDetails && quantity && (
  <div className="mt-2 p-3 bg-blue-600/5 rounded-xl border border-blue-600/20">
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-black uppercase text-slate-500">Total Price:</span>
      <div className="text-right">
        <span className="text-lg font-black text-blue-600">
          LKR {calculatePriceWithProfit(
            usdRate,
            parseInt(quantity),
            parseFloat(serviceDetails.rate)
          ).lkr.toFixed(2)}
        </span>
        <p className="text-[8px] font-bold text-slate-400">
          ≈ ${calculatePriceWithProfit(
            usdRate,
            parseInt(quantity),
            parseFloat(serviceDetails.rate)
          ).usd.toFixed(2)} USD
        </p>
      </div>
      </div>
    </div>
    
)}
                  </div>

                {/* Optional Fields - Custom Comments */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    Custom Comments (Optional)
                  </label>
                  <textarea
                    value={customComments}
                    onChange={(e) => setCustomComments(e.target.value)}
                    placeholder="Enter custom comments"
                    rows={3}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 font-bold text-sm focus:border-blue-600 outline-none transition-all resize-none"
                  />
                </div>

                {/* Optional Fields - Usernames */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    Usernames (Optional)
                  </label>
                  <textarea
                    value={usernames}
                    onChange={(e) => setUsernames(e.target.value)}
                    placeholder="Enter usernames"
                    rows={3}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 font-bold text-sm focus:border-blue-600 outline-none transition-all resize-none"
                  />
                </div>

                {/* Current Balance Display */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-2">
                    <Wallet size={12} />
                    Your Balance:
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      LKR {userBalance.total_balance}
                    </span>
                    <p className="text-[7px] font-bold text-slate-400">
                      ≈ ${convertLkrToUsd(parseFloat(userBalance.total_balance), usdRate).toFixed(2)} USD
                    </p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col md:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={orderLoading || !selectedServiceId || !link || !quantity || !currentUser || insufficientBalance}
                    className="flex-1 bg-blue-600 text-white p-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {orderLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : insufficientBalance ? (
                      <>
                        <AlertCircle size={16} />
                        Insufficient Funds
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Place Order
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('orders')}
                    className="px-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll To Top for Mobile */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 md:right-10 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-blue-600 shadow-2xl border border-slate-200 dark:border-white/10 z-50 md:hidden active:scale-90 transition-transform hover:bg-blue-600 hover:text-white"
      >
        <ChevronUp size={24} />
      </button>

      {/* Error State */}
      {error && !loading && activeView === 'orders' && currentUser && (
        <div className="py-20 text-center">
          <div className="bg-red-500/10 text-red-500 p-8 rounded-[2rem] border border-red-500/20 max-w-sm mx-auto inline-block">
            <Zap size={24} className="mx-auto mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
            <button onClick={handleManualRefresh} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase">
              Force Re-Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
