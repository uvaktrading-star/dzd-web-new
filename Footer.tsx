import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  DollarSign,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

// Social Icons (using Lucide React icons)
const FacebookIcon = Facebook;
const TwitterIcon = Twitter;
const InstagramIcon = Instagram;
const YoutubeIcon = Youtube;

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-white dark:bg-[#050b1a] border-t border-slate-200 dark:border-white/5 pt-12 lg:pt-16 pb-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/10 dark:to-transparent"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div 
              className="flex items-center gap-2 mb-4 lg:mb-5 cursor-pointer" 
              onClick={() => handleNavigation('/')}
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                <Zap size={20} className="lg:w-6 lg:h-6" fill="white" />
              </div>
              <span className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                DzD <span className="text-blue-600">Marketing</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed max-w-md">
              The world's fastest and most reliable SMM panel. Trusted by 50,000+ resellers and agencies worldwide.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                <FacebookIcon size={16} className="lg:w-[18px] lg:h-[18px]" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                <TwitterIcon size={16} className="lg:w-[18px] lg:h-[18px]" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                <InstagramIcon size={16} className="lg:w-[18px] lg:h-[18px]" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                <YoutubeIcon size={16} className="lg:w-[18px] lg:h-[18px]" />
              </a>
            </div>
            
            {/* Trust Badge */}
            <div className="mt-6 lg:mt-8 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-xl">
              <ShieldCheck size={16} className="text-blue-600" />
              <span className="text-[10px] lg:text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">SSL Secure & Verified</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm lg:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 lg:mb-5">Quick Links</h3>
            <ul className="space-y-2 lg:space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/')} 
                  className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/dashboard/services')} 
                  className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/pricing')} 
                  className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/dashboard')} 
                  className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="text-sm lg:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 lg:mb-5">Support</h3>
            <ul className="space-y-2 lg:space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/support')} 
                  className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/terms-of-service')} 
                  className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
          
          {/* Contact & Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="text-sm lg:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 lg:mb-5">Stay Updated</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-base mb-4 leading-relaxed">
              Subscribe to our newsletter for exclusive offers and service updates.
            </p>
            
            {/* Newsletter Form */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full h-11 lg:h-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 lg:h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <Mail size={16} className="flex-shrink-0" />
                <span className="text-sm lg:text-base">support@dzdmarketing.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <Phone size={16} className="flex-shrink-0" />
                <span className="text-sm lg:text-base">+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <MapPin size={16} className="flex-shrink-0" />
                <span className="text-sm lg:text-base">24/7 Global Support</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 lg:pt-8 mt-6 lg:mt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 order-2 md:order-1">
            © 2026 DzD Marketing. All rights reserved. | Designed for scale
          </p>
          <div className="flex items-center gap-4 order-1 md:order-2">
            <span className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-wider">v2.0.0</span>
            <span className="text-[10px] lg:text-xs text-slate-400">|</span>
            <div className="flex items-center gap-1">
              <DollarSign size={12} className="text-slate-400" />
              <span className="text-[10px] lg:text-xs font-black text-slate-400">USD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
