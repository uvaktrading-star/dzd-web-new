import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Clock,
  Users,
  CreditCard,
  RefreshCw,
  Ban,
  Scale,
  Gavel,
  Eye,
  Zap,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  DollarSign,
  HeadphonesIcon,
  ChevronRight
} from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Social Icons (simplified versions)
const FacebookIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function TermsOfServicePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Table of Contents data
  const tocItems = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'eligibility', title: '2. Eligibility' },
    { id: 'services', title: '3. Services Description' },
    { id: 'account', title: '4. Account Registration' },
    { id: 'payments', title: '5. Payments & Refunds' },
    { id: 'prohibited', title: '6. Prohibited Activities' },
    { id: 'intellectual', title: '7. Intellectual Property' },
    { id: 'termination', title: '8. Termination' },
    { id: 'disclaimers', title: '9. Disclaimers' },
    { id: 'limitation', title: '10. Limitation of Liability' },
    { id: 'indemnification', title: '11. Indemnification' },
    { id: 'governing', title: '12. Governing Law' },
    { id: 'changes', title: '13. Changes to Terms' },
    { id: 'contact', title: '14. Contact Information' }
  ];

  // Last updated date
  const lastUpdated = "February 15, 2026";

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#020617]">
      {/* ========== NAVBAR (Copy your Navbar component here) ========== */}
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-[#050b1a] border-b border-slate-200 dark:border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <Zap size={16} className="lg:w-5 lg:h-5" fill="white" />
              </div>
              <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                DzD <span className="text-blue-600">Marketing</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => navigate('/')} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-colors">
                Home
              </button>
              <button onClick={() => navigate('/about')} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-colors">
                About
              </button>
              <button onClick={() => navigate('/terms')} className="px-4 py-2 text-blue-600 dark:text-blue-400 text-sm font-bold border-b-2 border-blue-600">
                Terms
              </button>
              <button onClick={() => navigate('/contact')} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-colors">
                Contact
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/30"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')}
                    className="hidden md:block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/30"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20"></div>

      {/* Hero Section */}
      <div className="relative pt-20 lg:pt-24 pb-12 lg:pb-16 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
              <Scale size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Legal Agreement
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Service</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-6">
              Please read these terms carefully before using our SMM panel services.
            </p>
            
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Clock size={16} />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Table of Contents - Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white dark:bg-[#0f172a]/40 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-blue-600" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Contents
                </h3>
              </div>
              
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={`#${item.id}`}
                      className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors block py-1"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-xl">
                  <AlertCircle size={16} />
                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Legal Document
                  </p>
                </div>
              </div>

              {/* User Status Badge */}
              {user && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl">
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                      Signed in as
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Terms Content */}
          <div className="lg:w-3/4">
            <div className="bg-white dark:bg-[#0f172a]/40 rounded-3xl border border-slate-200 dark:border-white/5 p-6 lg:p-10 shadow-sm">
              
              {/* Introduction */}
              <div className="mb-10 pb-10 border-b border-slate-200 dark:border-white/5">
                <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white mb-4">
                  Welcome to DzD Marketing
                </h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  These Terms of Service ("Terms") govern your access to and use of the DzD Marketing website, 
                  API, and services (collectively, the "Services"). By accessing or using our Services, 
                  you agree to be bound by these Terms. If you do not agree to these Terms, you may not 
                  access or use the Services.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  DzD Marketing provides SMM (Social Media Marketing) panel services that allow users to 
                  purchase social media engagement services. We reserve the right to update these Terms 
                  at any time without prior notice.
                </p>
              </div>
              
              {/* Terms Sections */}
              <div className="space-y-10">
                
                {/* 1. Agreement to Terms */}
                <section id="agreement" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">1</span>
                    Agreement to Terms
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    By creating an account, making a purchase, or using any of our Services, you acknowledge 
                    that you have read, understood, and agree to be bound by these Terms. If you are using 
                    our Services on behalf of an organization, you represent and warrant that you have the 
                    authority to bind that organization to these Terms.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl mt-3">
                    <p className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                      <Shield size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Your use of our Services constitutes acceptance of these Terms and any future modifications.</span>
                    </p>
                  </div>
                </section>
                
                {/* 2. Eligibility */}
                <section id="eligibility" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">2</span>
                    Eligibility
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    You must be at least 18 years old to use our Services. By using our Services, you 
                    represent and warrant that:
                  </p>
                  <ul className="list-disc pl-5 text-slate-500 dark:text-slate-400 space-y-2">
                    <li>You are 18 years of age or older</li>
                    <li>You have the legal capacity to enter into a binding agreement</li>
                    <li>You are not located in a country that is subject to a U.S. government embargo</li>
                    <li>You will not use our Services for any illegal or unauthorized purpose</li>
                  </ul>
                </section>
                
                {/* 3. Services Description */}
                <section id="services" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">3</span>
                    Services Description
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    DzD Marketing provides a platform for purchasing social media engagement services, including 
                    but not limited to followers, likes, views, and comments across various social media platforms.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={16} className="text-emerald-600" />
                        <h4 className="text-sm font-black text-emerald-600 uppercase tracking-wider">What We Provide</h4>
                      </div>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>• Social media engagement services</li>
                        <li>• API access for automation</li>
                        <li>• 24/7 customer support</li>
                        <li>• Real-time order tracking</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle size={16} className="text-amber-600" />
                        <h4 className="text-sm font-black text-amber-600 uppercase tracking-wider">What We Don't Guarantee</h4>
                      </div>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <li>• Specific delivery times</li>
                        <li>• Viral results or guaranteed success</li>
                        <li>• Platform algorithm changes</li>
                      </ul>
                    </div>
                  </div>
                </section>
                
                {/* 4. Account Registration */}
                <section id="account" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">4</span>
                    Account Registration
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    To access certain features of our Services, you must register for an account. You agree to:
                  </p>
                  <ul className="list-disc pl-5 text-slate-500 dark:text-slate-400 space-y-2 mb-4">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your account information</li>
                    <li>Keep your password secure and confidential</li>
                    <li>Notify us immediately of any unauthorized access</li>
                  </ul>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    You are solely responsible for all activities that occur under your account. We are not 
                    liable for any loss or damage arising from your failure to maintain account security.
                  </p>
                </section>
                
                {/* 5. Payments & Refunds */}
                <section id="payments" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">5</span>
                    Payments & Refunds
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <CreditCard size={14} className="text-blue-600" />
                        Payment Terms
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        All payments must be made in advance through available payment methods. Prices are 
                        subject to change without notice. You are responsible for all fees and taxes associated 
                        with your use of our Services.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <RefreshCw size={14} className="text-blue-600" />
                        Refund Policy
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                        Refunds are issued at our discretion in the following circumstances:
                      </p>
                      <ul className="list-disc pl-5 text-slate-500 dark:text-slate-400 space-y-1">
                        <li>Order not started within 72 hours</li>
                        <li>Technical errors on our end</li>
                        <li>Duplicate charges</li>
                      </ul>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
                        Note: Refunds are not issued for completed orders or orders in progress.
                      </p>
                    </div>
                    
                    <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-xl">
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                        <Ban size={16} className="flex-shrink-0 mt-0.5" />
                        <span>No refunds will be issued for violation of our Terms or prohibited activities.</span>
                      </p>
                    </div>
                  </div>
                </section>
                
                {/* 6. Prohibited Activities */}
                <section id="prohibited" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">6</span>
                    Prohibited Activities
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    You may not use our Services for any illegal or unauthorized purpose. Prohibited activities include:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Reselling without authorization',
                      'Using bots or automated scripts',
                      'Manipulating social media algorithms',
                      'Promoting illegal content',
                      'Harassment or spam',
                      'Intellectual property infringement',
                      'Fraudulent transactions',
                      'Interfering with platform operations'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <XCircle size={14} className="text-red-500 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
                
                {/* 7. Intellectual Property */}
                <section id="intellectual" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">7</span>
                    Intellectual Property
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    The Services, including all content, features, and functionality, are owned by DzD Marketing 
                    and are protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    You may not copy, modify, distribute, sell, or lease any part of our Services without our 
                    prior written consent. The DzD Marketing name and logo are trademarks of DzD Marketing.
                  </p>
                </section>
                
                {/* 8. Termination */}
                <section id="termination" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">8</span>
                    Termination
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    We reserve the right to suspend or terminate your account and access to our Services at our 
                    sole discretion, without notice, for conduct that we believe violates these Terms or is harmful 
                    to other users or our business interests.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Upon termination, your right to use the Services will immediately cease. All provisions of 
                    these Terms that by their nature should survive termination shall survive.
                  </p>
                </section>
                
                {/* 9. Disclaimers */}
                <section id="disclaimers" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">9</span>
                    Disclaimers
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                    EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
                  </p>
                  <ul className="list-disc pl-5 text-slate-500 dark:text-slate-400 space-y-2 mb-3">
                    <li>The Services will meet your specific requirements</li>
                    <li>The Services will be uninterrupted, timely, secure, or error-free</li>
                    <li>The results from using the Services will be accurate or reliable</li>
                    <li>Quality of any products or services will meet your expectations</li>
                  </ul>
                  <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-xl">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Social Media Platforms:</span> We are not affiliated with, endorsed by, or connected to any social media platform (Instagram, TikTok, Facebook, YouTube, etc.). All trademarks belong to their respective owners.
                    </p>
                  </div>
                </section>
                
                {/* 10. Limitation of Liability */}
                <section id="limitation" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">10</span>
                    Limitation of Liability
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL DZD MARKETING BE LIABLE FOR ANY 
                    INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT 
                    LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING 
                    FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
                  </p>
                </section>
                
                {/* 11. Indemnification */}
                <section id="indemnification" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">11</span>
                    Indemnification
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    You agree to indemnify, defend, and hold harmless DzD Marketing, its officers, directors, 
                    employees, and agents from and against any claims, liabilities, damages, losses, and expenses, 
                    including reasonable attorneys' fees, arising out of or in any way connected with your access 
                    to or use of the Services or your violation of these Terms.
                  </p>
                </section>
                
                {/* 12. Governing Law */}
                <section id="governing" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">12</span>
                    Governing Law
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    These Terms shall be governed by the laws of the United States without regard to its conflict 
                    of law provisions. Any disputes arising under these Terms shall be resolved exclusively in the 
                    courts located in the United States.
                  </p>
                </section>
                
                {/* 13. Changes to Terms */}
                <section id="changes" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">13</span>
                    Changes to Terms
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    We reserve the right to modify these Terms at any time. We will provide notice of material 
                    changes by posting the updated Terms on our website and updating the "Last Updated" date. 
                    Your continued use of the Services after any such changes constitutes your acceptance of 
                    the new Terms.
                  </p>
                </section>
                
                {/* 14. Contact Information */}
                <section id="contact" className="scroll-mt-24">
                  <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">14</span>
                    Contact Information
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    If you have any questions about these Terms, please contact us:
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Mail size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">legal@dzdmarketing.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Phone size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">+1 (800) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <MapPin size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Address</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">123 SMM Street, Digital City, DC 12345</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              
              {/* Acceptance Bar */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
                <div className="bg-blue-600/5 rounded-2xl p-6 text-center">
                  <Gavel size={24} className="mx-auto text-blue-600 mb-3" />
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                    By continuing to use DzD Marketing, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Last Updated: {lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
              <div className="flex items-center gap-2 mb-4 lg:mb-5 cursor-pointer" onClick={() => navigate('/')}>
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
                <a href="#" className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <FacebookIcon size={16} className="lg:w-[18px] lg:h-[18px]" />
                </a>
                <a href="#" className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <TwitterIcon size={16} className="lg:w-[18px] lg:h-[18px]" />
                </a>
                <a href="#" className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <InstagramIcon size={16} className="lg:w-[18px] lg:h-[18px]" />
                </a>
                <a href="#" className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
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
                <li><button onClick={() => navigate('/')} className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Home</button></li>
                <li><button onClick={() => navigate('/services')} className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Services</button></li>
                <li><button onClick={() => navigate('/pricing')} className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Pricing</button></li>
                <li><button onClick={() => navigate('/dashboard')} className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Dashboard</button></li>
                <li><button onClick={() => navigate('/api-docs')} className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">API Docs</button></li>
              </ul>
            </div>
            
            {/* Support */}
            <div className="lg:col-span-2">
              <h3 className="text-sm lg:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 lg:mb-5">Support</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li><button onClick={() => navigate('/help')} className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/contact')} className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Contact Us</button></li>
                <li><button onClick={() => navigate('/terms')} className="text-blue-600 dark:text-blue-400 text-sm lg:text-base">Terms of Service</button></li>
                <li><button onClick={() => navigate('/privacy')} className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/refund')} className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Refund Policy</button></li>
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
    </div>
  );
}
