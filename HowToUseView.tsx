import React from 'react';
import { Link } from 'react-router-dom';
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

const allHowToArticles = [
  // ... include all 6 articles from the previous example
  {
    slug: 'customize-dashboard',
    title: 'Customize your dashboard',
    description: 'Arrange widgets, set default views, and personalise your workspace.',
    icon: <Settings size={22} />,
    color: 'bg-blue-600',
    readTime: '4 min',
    level: 'Beginner',
  },
  // ... add the rest
];

const supportChannels = [ /* same as before */ ];

export default function HowToUseView({ user }: any) {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How to Use
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            All practical guides • {user?.fullName || user?.email || 'Guest'}
          </p>
        </div>
        {/* Search and contact button (same as before) */}
      </div>

      {/* Stats Cards (optional) */}
      {/* ... */}

      {/* All articles grid */}
      <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
        <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400 mb-8">
          🛠️ All how‑to guides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allHowToArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/support/article/${article.slug}`}
              className="group block bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all duration-200 overflow-hidden"
            >
              {/* Same card design as before */}
            </Link>
          ))}
        </div>
      </div>

      {/* Support Channels & Footer CTA (same) */}
    </div>
  );
}