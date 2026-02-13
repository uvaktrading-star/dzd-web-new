import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Headphones,
  MessageCircle,
  BookOpen,
  Clock,
  Mail,
  Phone,
  ChevronRight,
  Search,
  ArrowLeft,
} from 'lucide-react';

// Reuse the same article data (or import from a central file)
const articles = [
  // Getting Started articles
  {
    slug: 'create-your-account',
    title: 'Create your account',
    description: 'Step‑by‑step guide to setting up your profile and preferences.',
    icon: <BookOpen size={22} />,
    color: 'bg-blue-600',
    readTime: '3 min',
    level: 'Beginner',
    category: 'getting-started',
  },
  {
    slug: 'your-first-order',
    title: 'Your first order',
    description: 'How to place, track, and manage your very first order.',
    icon: <Clock size={22} />,
    color: 'bg-green-600',
    readTime: '5 min',
    level: 'Beginner',
    category: 'getting-started',
  },
  {
    slug: 'understanding-billing',
    title: 'Understanding billing',
    description: 'Overview of invoices, payment methods, and subscription plans.',
    icon: <Mail size={22} />,
    color: 'bg-purple-600',
    readTime: '4 min',
    level: 'Intermediate',
    category: 'getting-started',
  },
  // Orders & Delivery articles
  {
    slug: 'track-order',
    title: 'Track your order',
    description: 'Real‑time tracking and delivery updates.',
    icon: <Clock size={22} />,
    color: 'bg-green-600',
    readTime: '3 min',
    level: 'Beginner',
    category: 'orders-delivery',
  },
  // ... add more articles for each category
];

// Category metadata (for header)
const categoryInfo: Record<string, { title: string; description: string }> = {
  'getting-started': {
    title: 'Getting Started',
    description: 'New to our platform? These guides will help you get up and running.',
  },
  'orders-delivery': {
    title: 'Orders & Delivery',
    description: 'Track orders, manage delays, and understand delivery statuses.',
  },
  // ... add all categories
};

export default function CategoryView() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = categoryInfo[categorySlug || ''];
  const categoryArticles = articles.filter(a => a.category === categorySlug);

  if (!category) {
    return (
      <div className="animate-fade-in space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Category not found</h1>
          <Link to="/support" className="mt-4 text-blue-600 hover:underline block">
            Back to Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Back button */}
      <div className="flex items-center gap-4">
        <Link
          to="/support"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-black uppercase tracking-widest">All topics</span>
        </Link>
      </div>

      {/* Category header */}
      <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          {category.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {category.description}
        </p>
      </div>

      {/* Articles grid */}
      <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400">
            {categoryArticles.length} articles
          </h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search in this category..."
              className="w-64 pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f172a]/40 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-white"
            />
          </div>
        </div>

        {categoryArticles.length === 0 ? (
          <p className="text-slate-500 text-center py-12">No articles yet in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryArticles.map((article) => (
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
        )}
      </div>

      {/* Still need help? CTA (same as support page) */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-[3rem] text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-2">Still need help?</h3>
            <p className="text-white/80 text-sm font-medium max-w-xl">
              Can't find what you're looking for? Our support team is ready to assist.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
            <MessageCircle size={18} /> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}