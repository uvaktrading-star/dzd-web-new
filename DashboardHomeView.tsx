import React, { useState, useEffect } from 'react';
import { PlusCircle, Wallet, History, Mail, Zap, ListOrderedIcon, Loader } from 'lucide-react';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export default function DashboardHomeView({ user, setActiveTab }: any) {
    const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const [userBalance, setUserBalance] = useState("0.00");
  const [orderStats, setOrderStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    recentCount: 0
  });
  const [ticketCount, setTicketCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    balance: false,
    orders: false,
    tickets: false
  });

  // Fetch balance from API
  const fetchBalance = async (uid: string) => {
    setLoading(prev => ({ ...prev, balance: true }));
    try {
      const response = await fetch(`${WORKER_URL}/get-balance?userId=${uid}`);
      const data = await response.json();
      setUserBalance(parseFloat(data.total_balance || 0).toFixed(2));
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  };

  // Fetch orders from Firestore
  const fetchOrders = async (uid: string) => {
    setLoading(prev => ({ ...prev, orders: true }));
    try {
      const ordersRef = collection(db, 'users', uid, 'orders');
      const q = query(
        ordersRef,
        orderBy('date', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      
      const orders: any[] = [];
      let totalCount = 0;
      let activeCount = 0;
      let completedCount = 0;

      // Get total count (without limit)
      const countQuery = query(ordersRef);
      const countSnapshot = await getDocs(countQuery);
      totalCount = countSnapshot.size;

      countSnapshot.forEach(doc => {
        const order = doc.data();
        const status = order.status?.toLowerCase() || '';
        
        if (status.includes('completed') || status.includes('success')) {
          completedCount++;
        } else if (status.includes('pending') || status.includes('processing') || status.includes('progress')) {
          activeCount++;
        }
      });

      // Get recent orders for display
      querySnapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      setOrderStats({
        total: totalCount,
        active: activeCount,
        completed: completedCount,
        recentCount: orders.length
      });

      setRecentOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Fetch tickets from localStorage (since we're using localStorage for tickets)
  const fetchTickets = (uid: string) => {
    try {
      const savedTickets = localStorage.getItem(`supportTickets_${uid}`);
      if (savedTickets) {
        const tickets = JSON.parse(savedTickets);
        setTicketCount(tickets.length);
      } else {
        setTicketCount(0);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTicketCount(0);
    }
  };

  // Load all data when user changes
  useEffect(() => {
    if (user?.uid) {
      fetchBalance(user.uid);
      fetchOrders(user.uid);
      fetchTickets(user.uid);
      
      // Auto-refresh balance every 30 seconds
      const balanceInterval = setInterval(() => fetchBalance(user.uid), 30000);
      
      // Auto-refresh orders every 60 seconds
      const ordersInterval = setInterval(() => fetchOrders(user.uid), 60000);
      
      return () => {
        clearInterval(balanceInterval);
        clearInterval(ordersInterval);
      };
    }
  }, [user]);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const lower = status?.toLowerCase() || '';
    if (lower.includes('completed') || lower.includes('success')) {
      return 'text-green-500 bg-green-500/10';
    }
    if (lower.includes('processing') || lower.includes('progress')) {
      return 'text-blue-500 bg-blue-500/10';
    }
    if (lower.includes('pending')) {
      return 'text-amber-500 bg-amber-500/10';
    }
    if (lower.includes('cancel') || lower.includes('failed')) {
      return 'text-red-500 bg-red-500/10';
    }
    return 'text-slate-500 bg-slate-500/10';
  };

  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            System Overview
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] sm:text-[10px] mt-1">
            Commanding: {user?.fullName || user?.displayName || user?.email}
          </p>
        </div>
        
        <button 
          onClick={() => handleNavigation('/dashboard/orders')} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all"
        >
          <PlusCircle size={16} className="sm:w-[18px] sm:h-[18px]" /> 
          <span>New Order</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Balance Card */}
        <div className="bg-white dark:bg-[#0f172a]/40 p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white bg-blue-600 shadow-lg">
              <Wallet size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap">
              {loading.balance ? 'Syncing...' : 'Live Sync'}
            </span>
          </div>
          <p className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1">
            Available Balance
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
            LKR {userBalance}
          </h3>
        </div>

        {/* Order History Card */}
        <div className="bg-white dark:bg-[#0f172a]/40 p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white bg-pink-600 shadow-lg">
              <History size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-pink-500 bg-pink-500/10 px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap">
              {loading.orders ? 'Loading...' : `+${orderStats.recentCount} New`}
            </span>
          </div>
          <p className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1">
            Order History
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
            {orderStats.total}
          </h3>
          <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-1">
            {orderStats.completed} completed • {orderStats.active} active
          </p>
        </div>

        {/* Active Orders Card */}
        <div className="bg-white dark:bg-[#0f172a]/40 p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white bg-green-600 shadow-lg">
              <ListOrderedIcon size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap">
              In Progress
            </span>
          </div>
          <p className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1">
            Active Orders
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
            {orderStats.active}
          </h3>
          <p className="text-[8px] sm:text-[9px] font-bold text-green-500 mt-1">
            {((orderStats.active / (orderStats.total || 1)) * 100).toFixed(0)}% of total
          </p>
        </div>

        {/* Tickets Card */}
        <div className="bg-white dark:bg-[#0f172a]/40 p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white bg-orange-600 shadow-lg">
              <Mail size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap">
              {ticketCount === 0 ? 'Clear' : 'Active'}
            </span>
          </div>
          <p className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1">
            System Tickets
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
            {ticketCount}
          </h3>
          <button 
            onClick={() => handleNavigation('/dashboard/tickets')} 
            className="text-[8px] sm:text-[9px] font-bold text-orange-500 hover:text-orange-600 mt-1 flex items-center gap-1"
          >
            View Tickets <PlusCircle size={10} />
          </button>
        </div>
      </div>

      {/* Execution History / Recent Orders */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <div className="bg-white dark:bg-[#0f172a]/40 p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-slate-200 dark:border-white/5">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <h3 className="text-base sm:text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400">
                Execution History
              </h3>
              {loading.orders && (
                <Loader size={12} className="animate-spin text-blue-500" />
              )}
            </div>
            <button 
              onClick={() => handleNavigation('/dashboard/orders')} 
              className="text-[8px] sm:text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline flex items-center gap-1"
            >
              Full Log <PlusCircle size={12} />
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {recentOrders.map((order, i) => {
                const statusBadge = getStatusColor(order.status);
                return (
                  <div 
                    key={order.id || i} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 group hover:bg-white dark:hover:bg-blue-600/5 transition-all gap-3 sm:gap-0"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm border border-slate-100 dark:border-white/5 flex-shrink-0">
                        <Zap size={16} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                          {order.serviceName || `Order #${order.orderId}`}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                          <span className="text-[8px] sm:text-[9px] font-black text-slate-400">
                            #{order.orderId}
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-black text-slate-400">•</span>
                          <span className="text-[8px] sm:text-[9px] font-black text-slate-400">
                            {order.quantity?.toLocaleString()} qty
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-black text-slate-400">•</span>
                          <span className="text-[8px] sm:text-[9px] font-black text-slate-400">
                            {formatDate(order.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pl-13 sm:pl-0">
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${statusBadge}`}>
                        {order.status || 'Pending'}
                      </span>
                      <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white whitespace-nowrap">
                        LKR {parseFloat(order.charge || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-slate-100 dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-slate-400 mb-3 sm:mb-4">
                <History size={24} className="sm:w-8 sm:h-8" />
              </div>
              <p className="text-slate-500 font-black text-xs sm:text-sm uppercase tracking-widest">
                No Orders Yet
              </p>
              <p className="text-slate-400 text-[8px] sm:text-[10px] font-bold mt-1 px-4">
                Deploy your first mission to get started
              </p>
              <button 
                onClick={() => handleNavigation('/dashboard/orders')} 
                className="mt-4 sm:mt-6 flex items-center gap-2 mx-auto bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-[10px] sm:text-xs hover:scale-105 transition-all"
              >
                <PlusCircle size={12} className="sm:w-[14px] sm:h-[14px]" />
                Create Your First Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
