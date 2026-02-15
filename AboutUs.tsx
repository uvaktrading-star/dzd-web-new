import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  Award, 
  Globe, 
  Clock, 
  Shield, 
  Rocket, 
  Heart, 
  Star, 
  CheckCircle,
  Target,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Sparkles,
  HeadphonesIcon,
  BarChart3,
  Lock,
  RefreshCw,
  ThumbsUp,
  Eye
} from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Footer from './Footer';

// Social Icons
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

const LinkedinIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Team Member Card Component
const TeamMember = ({ name, role, image, social }: { name: string; role: string; image: string; social?: any }) => (
  <div className="group relative">
    {/* Glow effect on hover */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
    
    {/* Main card */}
    <div className="relative bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden group-hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-xl">
      
      {/* Colored top bar */}
      <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      
      <div className="p-6 text-center">
        {/* Avatar with ring */}
        <div className="relative mb-4 inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
          <div className="relative w-24 h-24 mx-auto rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          {/* Online status indicator (optional) */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
        </div>
        
        {/* Name and role */}
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{name}</h3>
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full inline-block mb-4">
          {role}
        </p>
        
        {/* Social links - redesigned */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {social?.linkedin && (
          <a 
            href={social.linkedin} 
            className="w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-sm shadow-sm flex items-center justify-center text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all border border-white/20"
            title="LinkedIn"
          >
            <LinkedinIcon size={15} />
          </a>
        )}
        {social?.twitter && (
          <a 
            href={social.twitter} 
            className="w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-sm shadow-sm flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all border border-white/20"
            title="Twitter"
          >
            <TwitterIcon size={15} />
          </a>
        )}
        {social?.instagram && (
          <a 
            href={social.instagram} 
            className="w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-sm shadow-sm flex items-center justify-center text-[#E4405F] hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCAF45] hover:text-white transition-all border border-white/20"
            title="Instagram"
          >
            <InstagramIcon size={15} />
          </a>
        )}
      </div>
      </div>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ number, label, icon: Icon }: { number: string; label: string; icon: any }) => (
  <div className="bg-white dark:bg-[#0f172a]/40 p-6 rounded-2xl border border-slate-200 dark:border-white/5 text-center group hover:border-blue-500 transition-all">
    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-1">{number}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
  </div>
);

// Value Card Component
const ValueCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
  <div className="bg-white dark:bg-[#0f172a]/40 p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500 transition-all group">
    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

// Timeline Item Component
const TimelineItem = ({ year, title, description, isLast }: { year: string; title: string; description: string; isLast?: boolean }) => (
  <div className="relative flex gap-6">
    <div className="flex flex-col items-center">
      <div className="w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-600/20 z-10"></div>
      {!isLast && <div className="w-0.5 h-full bg-gradient-to-b from-blue-600 to-transparent absolute top-4"></div>}
    </div>
    <div className="pb-8">
      <span className="text-sm font-black text-blue-600 dark:text-blue-400 mb-1 block">{year}</span>
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  </div>
);
export default function AboutPage({ onSignupClick }: { onSignupClick?: () => void }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateAccount = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onSignupClick?.();
    }
  };

  const handleViewServices = () => {
    if (user) {
      navigate('/dashboard/services');
    } else {
      onSignupClick?.();
    }
  };

  // Stats data
  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: Users },
    { number: '10M+', label: 'Orders Completed', icon: CheckCircle },
    { number: '99.9%', label: 'Uptime', icon: Shield },
    { number: '24/7', label: 'Support', icon: HeadphonesIcon }
  ];

  // Values data
  const values = [
    {
      title: 'Reliability',
      description: 'We ensure 99.9% uptime and consistent service delivery for all our customers.',
      icon: Shield
    },
    {
      title: 'Speed',
      description: 'Lightning-fast order processing with instant start times for most services.',
      icon: Rocket
    },
    {
      title: 'Transparency',
      description: 'Clear pricing, real-time updates, and honest communication at all times.',
      icon: Eye
    },
    {
      title: 'Innovation',
      description: 'Constantly updating our services to match the latest social media trends.',
      icon: TrendingUp
    }
  ];

  // Timeline data
  const timeline = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'DzD Marketing was founded with a vision to revolutionize the SMM panel industry.'
    },
    {
      year: '2021',
      title: 'First 10K Customers',
      description: 'Reached 10,000 satisfied customers within our first year of operation.'
    },
    {
      year: '2022',
      title: 'Global Expansion',
      description: 'Expanded services to support customers in over 50 countries worldwide.'
    },
    {
      year: '2023',
      title: '1M Orders Milestone',
      description: 'Processed over 1 million orders with 99.9% customer satisfaction rate.'
    },
    {
      year: '2024',
      title: 'API Launch',
      description: 'Launched our powerful API for resellers and automation needs.'
    },
    {
      year: '2025',
      title: 'Today',
      description: 'Trusted by 50,000+ resellers and agencies globally.',
      isLast: true
    }
  ];

  // Team data - Updated with your actual team members
  const team = [
    {
      name: 'Danuka Dissanayake',
      role: 'Admin Team',
      image: 'https://i.pravatar.cc/150?img=8',
      social: { twitter: '#', linkedin: '#', instagram: '#' }
    },
    {
      name: 'Aadil Mohomade',
      role: 'Admin Team',
      image: 'https://i.pravatar.cc/150?img=5',
      social: { twitter: '#', linkedin: '#', instagram: '#' }
    },
    {
      name: 'Akash ',
      role: 'Admin Team',
      image: 'https://i.pravatar.cc/150?img=7',
      social: { twitter: '#', linkedin: '#', instagram: '#' }
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#020617]">
      {/* Navbar */}
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
              <button onClick={() => navigate('/about')} className="px-4 py-2 text-blue-600 dark:text-blue-400 text-sm font-bold border-b-2 border-blue-600">
                About
              </button>
              <button onClick={() => navigate('/services')} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-colors">
                Services
              </button>
              <button onClick={() => navigate('/terms')} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-colors">
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
      <section className="relative pt-20 lg:pt-24 pb-16 lg:pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
              <Users size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                About Us
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
              We're on a Mission to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Revolutionize
              </span>{' '}
              SMM
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 mb-8">
              Founded in 2020, DzD Marketing has grown from a small team to a global SMM panel trusted by over 50,000 customers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-white dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Story</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg leading-relaxed mb-4">
                DzD Marketing started with a simple idea: make social media growth accessible, affordable, and reliable for everyone. What began as a small operation run by Danuka Dissanayake has grown into a global platform serving thousands of customers daily.
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg leading-relaxed mb-6">
                Today, our team of three core members works tirelessly to ensure every order is processed smoothly, every customer is supported, and every service meets the highest quality standards.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {team.map((member, index) => (
                    <div key={index} className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-black text-slate-900 dark:text-white">3</span> dedicated team members
                </span>
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-[#0f172a]/40 p-8 rounded-3xl border border-slate-200 dark:border-white/5">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Target size={20} className="text-blue-600" />
                Our Journey
              </h3>
              <div className="space-y-2">
                {timeline.map((item, index) => (
                  <TimelineItem key={index} {...item} isLast={index === timeline.length - 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
              What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Stand For</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg">
              Our core values guide every decision we make and every service we provide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

{/* Team Section - Redesigned Premium */}
<section className="py-16 lg:py-24 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-[#0a0f1c]/30">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Section Header - Minimalist Premium */}
    <div className="text-center max-w-2xl mx-auto mb-12">
      <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full mb-4 border border-slate-200 dark:border-white/10">
        <Users size={14} className="text-slate-500 dark:text-slate-400" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          The Team
        </span>
      </div>
      <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
        Meet the <span className="text-slate-500 dark:text-slate-400">Core Team</span>
      </h2>
      <p className="text-slate-400 dark:text-slate-500 text-base lg:text-lg max-w-xl mx-auto font-light">
        Three dedicated professionals working hard to make DzD Marketing the best SMM panel.
      </p>
      {/* Minimal decorative line */}
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent mx-auto mt-6"></div>
    </div>
    
    {/* Team Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
      {team.map((member, index) => (
        <TeamMember key={index} {...member} />
      ))}
    </div>

    {/* Team Message - Completely Redesigned Premium */}
    <div className="mt-24 text-center max-w-3xl mx-auto relative">
      {/* Premium background layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-200/30 to-slate-300/30 dark:from-white/5 dark:to-white/0 rounded-[2.5rem] blur-2xl"></div>
      <div className="absolute inset-0 bg-white/50 dark:bg-[#0a0f1c]/50 rounded-[2.5rem] backdrop-blur-sm"></div>
      
      {/* Main card */}
      <div className="relative bg-white dark:bg-[#0a0f1c] p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl">
        
        {/* Top decorative line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-slate-400 dark:via-white/20 to-transparent"></div>
        
        {/* Premium badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-white dark:bg-[#0a0f1c] text-slate-500 dark:text-slate-400 px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-white/10 rounded-full">
            Founder's Note
          </span>
        </div>

        {/* Minimal icon */}
        <div className="mb-6 opacity-10">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-slate-500 dark:text-white">
            <path d="M20 12H4M12 4v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Quote */}
        <p className="text-xl lg:text-2xl text-slate-700 dark:text-slate-300 font-light leading-relaxed mb-8 max-w-2xl mx-auto px-4">
          <span className="text-slate-400 dark:text-slate-500 text-2xl mr-2">"</span>
          We're not just a team, we're a family. 
          <span className="block mt-3 text-slate-900 dark:text-white font-medium">
            Every customer who trusts us becomes part of our story.
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-2xl ml-2">"</span>
        </p>

        {/* Founder info with social buttons */}
        <div className="flex flex-col items-center gap-4">
          {/* Avatar and name */}
          <div className="flex items-center gap-4">
            {/* Avatar with premium border */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-500 dark:from-white/20 dark:to-white/5 rounded-full blur-sm opacity-50"></div>
              <div className="relative w-14 h-14 rounded-full bg-white dark:bg-[#0f172a] p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src="https://i.pravatar.cc/150?img=8" 
                    alt="Danuka Dissanayake" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Name and title */}
            <div className="text-left">
              <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Danuka Dissanayake
              </p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                Founder & CEO
              </p>
            </div>
          </div>

          {/* Social buttons - EXACTLY as you wanted */}
          <div className="flex items-center justify-center gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-white/5 w-full max-w-xs mx-auto">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4 lg:w-[18px] lg:h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4 lg:w-[18px] lg:h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4 lg:w-[18px] lg:h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4 lg:w-[18px] lg:h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-slate-400 dark:via-white/20 to-transparent"></div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border border-slate-200 dark:border-white/10"></div>
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tighter">
            Ready to Grow Your Social Media?
          </h2>
          <p className="text-lg lg:text-xl text-white/90 mb-8">
            Join 50,000+ satisfied customers who trust us for their social media growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
<button 
  onClick={handleCreateAccount}
  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
>
  Get Started Today
</button>

<button 
  onClick={handleViewServices}
  className="border-2 border-white text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
>
  View Services
</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
