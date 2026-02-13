import React from 'react';
import { Link } from 'react-router-dom'; // <-- import Link
import {
  Headphones,
  MessageCircle,
  BookOpen,
  Clock,
  Mail,
  Phone,
  ChevronRight,
  AlertCircle,
  ThumbsUp,
  Search,
  Settings,
  Users,
  BarChart,
} from 'lucide-react';

// Original categories (unchanged)
const helpCategories = [
  {
    title: 'Getting Started',
    description: 'New to our platform? Start here.',
    icon: <BookOpen size={22} />,
    color: 'bg-blue-600',
    articles: 8,
  },
  {
    title: 'Orders & Delivery',
    description: 'Track orders, delays, and statuses.',
    icon: <Clock size={22} />,
    color: 'bg-green-600',
    articles: 12,
  },
  {
    title: 'Payments & Billing',
    description: 'Invoices, refunds, and payment methods.',
    icon: <Mail size={22} />,
    color: 'bg-purple-600',
    articles: 6,
  },
  {
    title: 'API & Integrations',
    description: 'Documentation and troubleshooting.',
    icon: <Headphones size={22} />,
    color: 'bg-orange-600',
    articles: 15,
  },
  {
    title: 'Account Security',
    description: '2FA, passwords, and privacy.',
    icon: <AlertCircle size={22} />,
    color: 'bg-pink-600',
    articles: 5,
  },
  {
    title: 'Troubleshooting',
    description: 'Common issues and fixes.',
    icon: <ThumbsUp size={22} />,
    color: 'bg-amber-600',
    articles: 10,
  },
];

// Featured "How to Use" articles (first 3)
const featuredHowTo = [
  {
    slug: 'customize-dashboard',
    title: 'Customize your dashboard',
    description: 'Arrange widgets, set default views, and personalise your workspace.',
    icon: <Settings size={22} />,
    color: 'bg-blue-600',
    readTime: '4 min',
    level: 'Beginner',
  },
  {
    slug: 'invite-team-members',
    title: 'Invite team members',
    description: 'Add colleagues, assign roles, and manage permissions.',
    icon: <Users size={22} />,
    color: 'bg-green-600',
    readTime: '3 min',
    level: 'Intermediate',
  },
  {
    slug: 'generate-reports',
    title: 'Generate custom reports',
    description: 'Create, schedule, and export reports with the data you need.',
    icon: <BarChart size={22} />,
    color: 'bg-purple-600',
    readTime: '7 min',
    level: 'Advanced',
  },
];

// Support channels (unchanged)
const supportChannels = [
  {
    name: 'Live Chat',
    availability: 'Online 24/7',
    icon: <MessageCircle size={20} />,
    action: 'Start chat',
    color: 'text-green-500',
  },
  {
    name: 'Email Support',
    availability: 'Response within 4h',
    icon: <Mail size={20} />,
    action: 'support@yourpanel.com',
    color: 'text-blue-500',
  },
  {
    name: 'Phone Support',
    availability: 'Mon-Fri 9am-6pm',
    icon: <Phone size={20} />,
    action: '+1 (800) 123-4567',
    color: 'text-purple-500',
  },
];

export default function SupportView({ user }: any) {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Header (unchanged) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Help & Support
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            How can we help you today? • {user?.fullName || user?.email || 'Guest'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full md:w-64 pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f172a]/40 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 text-sm hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
            <Headphones size={18} /> Contact Us
          </button>
        </div>
      </div>

      {/* Quick Stats (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Response Time', value: '< 2h', icon: <Clock />, color: 'bg-blue-600', trend: 'Live' },
          { label: 'Satisfaction Rate', value: '98%', icon: <ThumbsUp />, color: 'bg-green-600', trend: 'Positive' },
          { label: 'Open Tickets', value: '4', icon: <MessageCircle />, color: 'bg-amber-600', trend: '2 urgent' },
          { label: 'Help Articles', value: '56', icon: <BookOpen />, color: 'bg-purple-600', trend: 'Updated' },
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

      {/* Original Help Categories (unchanged) */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400">
              Browse Help Topics
            </h3>
            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">
              View All Articles
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((cat, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-blue-600/5 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${cat.color} shadow-lg shrink-0`}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">
                      {cat.title}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full">
                        {cat.articles} articles
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-slate-300 group-hover:text-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: How to Use Section with featured articles */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400">
              📖 How to Use
            </h3>
            <Link
              to="/support/how-to-use"
              className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline"
            >
              View all guides
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHowTo.map((article) => (
              <Link
                key={article.slug}
                to={`/support/article/${article.slug}`}
                className="group block bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${article.color} shadow-lg shrink-0`}
                    >
                      {article.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-base text-slate-900 dark:text-white mb-1 truncate">
                        {article.title}
                      </h4>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className="text-[9px] font-black text-slate-400 bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full">
                            {article.readTime}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full">
                            {article.level}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-blue-500 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                          Read <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Support Channels (unchanged) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {supportChannels.map((channel, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#0f172a]/40 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors flex items-start gap-4"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-opacity-10 ${channel.color.replace(
                'text',
                'bg'
              )}/10 ${channel.color}`}
            >
              {React.cloneElement(channel.icon as any, { size: 22 })}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm text-slate-900 dark:text-white mb-0.5">
                {channel.name}
              </h4>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                {channel.availability}
              </p>
              <p className={`text-[10px] font-black ${channel.color}`}>{channel.action}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA (unchanged) */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-[3rem] text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-2">Still need help?</h3>
            <p className="text-white/80 text-sm font-medium max-w-xl">
              Our support team is ready to assist you with any issues. Open a ticket and we'll get back to you within 2 hours.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
            <MessageCircle size={18} /> Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
