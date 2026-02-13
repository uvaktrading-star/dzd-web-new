
import React from 'react';
import { Zap, Facebook, Instagram, Twitter, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark pt-28 pb-12 border-t border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
             <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">DzD <span className="text-blue-600">Marketing</span></span>
             <p className="mt-6 text-slate-500 font-medium">The world's premium SMM marketplace. Reliable, high-speed growth.</p>
             <div className="flex gap-4 mt-8">
               {[Facebook, Instagram, Twitter].map((Icon, i) => (
                 <div key={i} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                   <Icon size={18} />
                 </div>
               ))}
             </div>
          </div>
          <div><h4 className="font-black mb-6 uppercase text-xs tracking-widest text-slate-400">Platform</h4><ul className="space-y-4 text-slate-500 font-bold"><li>Services</li><li>API</li><li>Pricing</li></ul></div>
          <div><h4 className="font-black mb-6 uppercase text-xs tracking-widest text-slate-400">Support</h4><ul className="space-y-4 text-slate-500 font-bold"><li>Help Center</li><li>Tickets</li><li>FAQ</li></ul></div>
          <div><h4 className="font-black mb-6 uppercase text-xs tracking-widest text-slate-400">Newsletter</h4><div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-white/5"><input className="bg-transparent px-4 py-2 outline-none w-full text-sm" placeholder="Email" /><button className="bg-blue-600 p-2 rounded-lg text-white"><Send size={18} /></button></div></div>
        </div>
        <div className="pt-10 border-t border-slate-200 dark:border-white/5 text-center text-slate-400 text-xs font-black uppercase">© 2026 DzD Marketing. Global Scale Solutions.</div>
      </div>
    </footer>
  );
}
