
import React from 'react';
import { PlusCircle, Wallet, PieChart, CreditCard, Mail, Zap, TrendingUp } from 'lucide-react';

export default function DashboardHomeView({ user, balance }: any) {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 tracking-[0.2em]">Commanding: {user?.fullName || user?.email}</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 text-sm hover:scale-105 active:scale-95 transition-all">
          <PlusCircle size={18} /> New Deployment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Available Balance', value: `$${balance || '0.00'}`, icon: <Wallet />, color: 'bg-blue-600', trend: 'Live Sync' },
          { label: 'Active Tasks', value: '12', icon: <PieChart />, color: 'bg-pink-600', trend: '+4 New' },
          { label: 'Total Volume', value: '$1,890', icon: <CreditCard />, color: 'bg-green-600', trend: 'Verified' },
          { label: 'System Tickets', value: '0', icon: <Mail />, color: 'bg-orange-600', trend: 'Clear' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0f172a]/40 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-inherit/20`}>
                {React.cloneElement(stat.icon as any, { size: 22 })}
              </div>
              <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400">Execution History</h3>
             <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Full Log</button>
          </div>
          <div className="space-y-4">
            {[
              { s: 'TikTok Viral Retention', p: '$24.99', st: 'Delivering', color: 'text-blue-500' },
              { s: 'Instagram HQ Profiles', p: '$12.00', st: 'Completed', color: 'text-green-500' },
              { s: 'Facebook Meta Feed', p: '$5.50', st: 'Pending', color: 'text-amber-500' }
            ].map((o, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 group hover:bg-white dark:hover:bg-blue-600/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm border border-slate-100 dark:border-white/5"><Zap size={20} /></div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{o.s}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Node: 0x4829{i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 dark:text-white text-sm">{o.p}</p>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${o.color}`}>{o.st}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 flex flex-col">
          <h3 className="text-xl font-black mb-8 tracking-tight uppercase tracking-widest text-xs text-slate-400">Quick Deploy</h3>
          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Protocol Type</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl py-4 px-4 text-sm font-bold focus:border-blue-500 outline-none text-slate-900 dark:text-white">
                <option>TikTok Real Engagement</option>
                <option>Instagram Verified Look</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Target Path (URL)</label>
              <input className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl py-4 px-4 text-sm font-bold focus:border-blue-500 outline-none text-slate-900 dark:text-white" placeholder="https://..." />
            </div>
            <div className="mt-auto">
              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                 Activate <TrendingUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
