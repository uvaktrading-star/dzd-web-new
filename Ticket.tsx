import React from 'react';
import {
  Ticket,
  MessageCircle,
  CheckCircle,
  Clock,
  PlusCircle,
  Mail,
  AlertCircle,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

// Dummy ticket data – replace with real data later
const tickets = [
  {
    id: 'TKT-4829',
    subject: 'TikTok order #1234 not delivered',
    status: 'Open',
    priority: 'High',
    lastUpdate: '2 hours ago',
    messages: 3,
  },
  {
    id: 'TKT-4830',
    subject: 'Need to cancel Instagram order',
    status: 'Pending',
    priority: 'Medium',
    lastUpdate: 'Yesterday',
    messages: 2,
  },
  {
    id: 'TKT-4831',
    subject: 'Payment verification failed',
    status: 'Awaiting Reply',
    priority: 'Urgent',
    lastUpdate: '5 hours ago',
    messages: 5,
  },
  {
    id: 'TKT-4832',
    subject: 'API key not working',
    status: 'Resolved',
    priority: 'Low',
    lastUpdate: '3 days ago',
    messages: 4,
  },
  {
    id: 'TKT-4833',
    subject: 'Wrong amount charged',
    status: 'Closed',
    priority: 'Medium',
    lastUpdate: '1 week ago',
    messages: 6,
  },
];

// Status badge color mapping
const statusColors: Record<string, string> = {
  Open: 'text-blue-500 bg-blue-500/10',
  Pending: 'text-amber-500 bg-amber-500/10',
  'Awaiting Reply': 'text-orange-500 bg-orange-500/10',
  Resolved: 'text-green-500 bg-green-500/10',
  Closed: 'text-slate-500 bg-slate-500/10',
};

// Priority badge color mapping
const priorityColors: Record<string, string> = {
  Low: 'text-slate-500 bg-slate-500/10',
  Medium: 'text-blue-500 bg-blue-500/10',
  High: 'text-orange-500 bg-orange-500/10',
  Urgent: 'text-red-500 bg-red-500/10',
};

export default function TicketsView({ user }: any) {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Header with CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Support Tickets
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            Customer Support • {user?.fullName || user?.email || 'User'}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 text-sm hover:scale-105 active:scale-95 transition-all">
          <PlusCircle size={18} /> Create Ticket
        </button>
      </div>

      {/* Stats Cards – same design as dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Open Tickets',
            value: '4',
            icon: <Ticket />,
            color: 'bg-blue-600',
            trend: '+2 new',
          },
          {
            label: 'Awaiting Response',
            value: '2',
            icon: <MessageCircle />,
            color: 'bg-amber-600',
            trend: 'Urgent',
          },
          {
            label: 'Resolved Today',
            value: '7',
            icon: <CheckCircle />,
            color: 'bg-green-600',
            trend: '+5',
          },
          {
            label: 'Total Tickets',
            value: '24',
            icon: <Clock />,
            color: 'bg-purple-600',
            trend: 'All time',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#0f172a]/40 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-inherit/20`}
              >
                {React.cloneElement(stat.icon as any, { size: 22 })}
              </div>
              <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Tickets List – styled exactly like "Execution History" */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
          {/* Header with filter */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400">
              All Tickets
            </h3>
            <div className="flex gap-3">
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1">
                <Filter size={14} /> Filter
              </button>
              <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* Ticket rows */}
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 group hover:bg-white dark:hover:bg-blue-600/5 transition-all cursor-pointer"
              >
                {/* Left side – icon + details */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm border border-slate-100 dark:border-white/5">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {ticket.subject}
                      </p>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          statusColors[ticket.status]
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          priorityColors[ticket.priority]
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                      <span>#{ticket.id}</span>
                      <span>•</span>
                      <span>Updated {ticket.lastUpdate}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} /> {ticket.messages}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side – subtle chevron (optional) */}
                <ArrowUpRight
                  size={18}
                  className="text-slate-300 group-hover:text-blue-500 transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Quick note / empty state hint (if needed) */}
          {tickets.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
                <Mail size={32} />
              </div>
              <p className="text-slate-500 font-black text-sm uppercase tracking-widest">
                No tickets yet
              </p>
              <p className="text-slate-400 text-[10px] font-bold mt-1">
                Create your first support ticket
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}