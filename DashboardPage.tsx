
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Bell, ShoppingCart, Wallet, PieChart, CreditCard, Mail, Zap } from 'lucide-react';

export default function DashboardPage({ user }: any) {
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-dark transition-colors animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Hey, {user.name}! 👋</h1>
            <p className="text-slate-500 font-semibold">Welcome to your marketing command center.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-xl font-bold"><Bell size={18} /> Alerts</button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black shadow-lg"><ShoppingCart size={18} /> New Order</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Wallet', value: '$124.50', icon: <Wallet />, color: 'bg-blue-600' },
            { label: 'Active', value: '12', icon: <PieChart />, color: 'bg-pink-600' },
            { label: 'Spent', value: '$1,890', icon: <CreditCard />, color: 'bg-green-600' },
            { label: 'Tickets', value: '0', icon: <Mail />, color: 'bg-orange-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white ${stat.color}`}>
                {React.cloneElement(stat.icon as any, { size: 24 })}
              </div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-[3rem]">
            <h3 className="text-2xl font-black mb-8">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { s: 'TikTok Boost', p: '$24.99', st: 'In Progress' },
                { s: 'IG Followers', p: '$12.00', st: 'Completed' }
              ].map((o, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center"><Zap size={18} /></div>
                    <p className="font-bold">{o.s}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black">{o.p}</p>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">{o.st}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-8 rounded-[3rem]">
            <h3 className="text-2xl font-black mb-8">Quick Link</h3>
            <div className="space-y-4">
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4">
                <option>TikTok Views</option>
                <option>Instagram Reels</option>
              </select>
              <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4" placeholder="Link..." />
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black mt-4">Order Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
