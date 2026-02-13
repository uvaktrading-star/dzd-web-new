import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ThumbsUp,
  Share2,
  Bookmark,
} from 'lucide-react';

// Mock article data – replace with your CMS or API call
const articles = {
  // Getting Started articles
  'create-your-account': {
    title: 'Create your account',
    description: 'Step‑by‑step guide to setting up your profile and preferences.',
    readTime: '3 min',
    level: 'Beginner',
    content: `
      <h2>Getting started</h2>
      <p>Welcome to our platform! Creating an account is the first step to accessing all features...</p>
      <h3>1. Visit the signup page</h3>
      <p>Click the "Sign Up" button...</p>
      <!-- more content -->
    `,
    related: ['your-first-order', 'understanding-billing', 'secure-your-account'],
  },
  'your-first-order': {
    title: 'Your first order',
    description: 'How to place, track, and manage your very first order.',
    readTime: '5 min',
    level: 'Beginner',
    content: `<p>Content for your first order...</p>`,
    related: [],
  },
  'understanding-billing': {
    title: 'Understanding billing',
    description: 'Overview of invoices, payment methods, and subscription plans.',
    readTime: '4 min',
    level: 'Intermediate',
    content: `<p>Billing content...</p>`,
    related: [],
  },
  'api-quickstart': {
    title: 'API quickstart',
    description: 'Get your first API call running in under 10 minutes.',
    readTime: '8 min',
    level: 'Advanced',
    content: `<p>API content...</p>`,
    related: [],
  },
  'secure-your-account': {
    title: 'Secure your account',
    description: 'Enable 2FA, set a strong password, and manage trusted devices.',
    readTime: '3 min',
    level: 'Beginner',
    content: `<p>Security content...</p>`,
    related: [],
  },
  'troubleshooting-common-issues': {
    title: 'Troubleshooting common issues',
    description: 'Quick fixes for problems you might encounter right after signup.',
    readTime: '6 min',
    level: 'Intermediate',
    content: `<p>Troubleshooting content...</p>`,
    related: [],
  },

  // How‑to articles
  'customize-dashboard': {
    title: 'Customize your dashboard',
    description: 'Arrange widgets, set default views, and personalise your workspace.',
    readTime: '4 min',
    level: 'Beginner',
    content: `<p>Content for customizing dashboard...</p>`,
    related: [],
  },
  'invite-team-members': {
    title: 'Invite team members',
    description: 'Add colleagues, assign roles, and manage permissions.',
    readTime: '3 min',
    level: 'Intermediate',
    content: `<p>Content for inviting team members...</p>`,
    related: [],
  },
  'generate-reports': {
    title: 'Generate custom reports',
    description: 'Create, schedule, and export reports with the data you need.',
    readTime: '7 min',
    level: 'Advanced',
    content: `<p>Content for generating reports...</p>`,
    related: [],
  },
  'integrate-slack': {
    title: 'Integrate with Slack',
    description: 'Receive notifications and interact with our platform directly from Slack.',
    readTime: '5 min',
    level: 'Intermediate',
    content: `<p>Content for Slack integration...</p>`,
    related: [],
  },
  'manage-billing': {
    title: 'Manage billing & subscriptions',
    description: 'Update payment methods, view invoices, and change plans.',
    readTime: '4 min',
    level: 'Beginner',
    content: `<p>Content for managing billing...</p>`,
    related: [],
  },
  'use-api-keys': {
    title: 'Use API keys securely',
    description: 'Create, rotate, and revoke API keys for integrations.',
    readTime: '6 min',
    level: 'Advanced',
    content: `<p>Content for using API keys...</p>`,
    related: [],
  },
};

export default function ArticleView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = articles[slug as keyof typeof articles];

  if (!article) {
    return (
      <div className="animate-fade-in space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Article not found</h1>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-black uppercase tracking-widest">Back</span>
        </button>
      </div>

      {/* Article header */}
      <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {article.readTime} read
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                {article.level}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {article.description}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-3 rounded-2xl border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Share2 size={20} className="text-slate-500" />
            </button>
            <button className="p-3 rounded-2xl border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bookmark size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Article body */}
        <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Feedback */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
          <p className="text-sm font-medium text-slate-500 mb-4">Was this article helpful?</p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-black text-xs uppercase tracking-widest hover:bg-green-200 transition">
              <ThumbsUp size={14} /> Yes
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-200 transition">
              <ThumbsUp size={14} className="rotate-180" /> No
            </button>
          </div>
        </div>
      </div>

      {/* Related articles */}
      {article.related && article.related.length > 0 && (
        <div className="bg-white dark:bg-[#0f172a]/40 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5">
          <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400 mb-6">
            Related articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {article.related.map((relatedSlug) => {
              const relatedArticle = articles[relatedSlug as keyof typeof articles];
              if (!relatedArticle) return null;
              return (
                <Link
                  key={relatedSlug}
                  to={`/support/article/${relatedSlug}`}
                  className="group block bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-blue-600/5 transition-all"
                >
                  <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest line-clamp-2">
                    {relatedArticle.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}