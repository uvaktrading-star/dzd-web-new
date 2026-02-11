
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, UserPlus, Wallet, ShoppingCart, Smartphone, LayoutGrid, TrendingUp } from 'lucide-react';
import Footer from './Footer';

export default function LandingPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const content = {
    all: { title: "One Place for Everything", desc: "We help you grow across all major social apps. Pick a platform on the right to see details.", points: ["Real growth for all accounts", "Fast results you can see", "Over 500 services"] },
    tiktok: { title: "Become TikTok Famous", desc: "Want more views and followers on your videos? We make it easy to get noticed and go viral.", points: ["Real video views and likes", "High-quality followers fast", "Get on the FYP"] },
    instagram: { title: "Grow Your Instagram", desc: "Make your photos and reels look popular instantly. We help you get more real followers.", points: ["Active-looking followers", "Likes on all new posts", "Boost Reels and Stories"] },
    facebook: { title: "Boost Your Facebook", desc: "Great for business pages. Get more page likes and post engagement to show you're the real deal.", points: ["Real Page likes", "Engagement on posts", "Safe for all pages"] }
  };
  const current = content[selectedPlatform as keyof typeof content];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50 dark:bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-blue-600 text-xs font-black uppercase tracking-widest">Next-Gen SMM Panel</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 animate-slide-up">
                Elevate Your <br />
                <span className="text-blue-600">Social Reach</span> <br />
                Effortlessly
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-medium">
                Premium services for TikTok, Instagram, and Facebook growth. Trusted by creators and businesses worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30">
                  Get Started Now <ArrowRight size={20} />
                </Link>
                <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg">
                  View Services
                </button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative z-10 bg-white dark:bg-darkSecondary p-4 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000" alt="SMM" className="rounded-[1.8rem] w-full h-auto opacity-90" />
              </div>
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/20 blur-[120px] -z-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-white dark:bg-dark border-y border-slate-200 dark:border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Orders", value: "1.2M+" },
            { label: "Users", value: "50K+" },
            { label: "Uptime", value: "99.9%" },
            { label: "Support", value: "24/7" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-blue-500 mb-2">{s.value}</h3>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MultiPlatform */}
      <section className="py-24 bg-white dark:bg-darkSecondary">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8">{current.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xl mb-12">{current.desc}</p>
            <div className="space-y-6">
              {current.points.map((text, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {['tiktok', 'instagram', 'facebook', 'all'].map(p => (
              <div key={p} onClick={() => setSelectedPlatform(p)} className={`p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 transition-all cursor-pointer border ${selectedPlatform === p ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selectedPlatform === p ? 'bg-white/20' : 'bg-blue-600/10 text-blue-600'}`}>
                  {p === 'all' ? <LayoutGrid size={32} /> : <Smartphone size={32} />}
                </div>
                <span className="font-black text-lg capitalize">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-dark">
        <div className="max-w-6xl mx-auto bg-blue-600 rounded-[4rem] p-12 md:p-28 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 text-white">
            <h2 className="text-4xl md:text-7xl font-black mb-8">Ready to Dominate?</h2>
            <button className="bg-white text-blue-600 px-12 py-6 rounded-[2rem] font-black text-2xl hover:scale-105 transition-all">Start Now</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
