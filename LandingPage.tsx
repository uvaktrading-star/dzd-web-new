import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  LayoutGrid, 
  Award, 
  ShieldCheck, 
  Globe, 
  Rocket, 
  Database, 
  Users, 
  Clock, 
  TrendingUp,
  Instagram,
  Youtube,
  Music2,
  Facebook,
  Twitter,
  Send,
  Linkedin,
  Pin,
  HeadphonesIcon,
  DollarSign,
  BarChart3,
  Sparkles,
  Star,
  ChevronRight,
  ChevronLeft,
  Wallet,
  Repeat,
  Activity,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Youtube as YoutubeIcon,
  ChevronUp
} from 'lucide-react';
import Footer from './Footer';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const RevealSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${isActive ? 'active' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default function LandingPage({ onSignupClick }: { onSignupClick?: () => void }) {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [user, setUser] = useState<any>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // STATS DATA
  const stats = [
    { value: '10M+', label: 'Orders Completed', icon: <Activity size={20} />, color: 'blue' },
    { value: '50K+', label: 'Happy Clients', icon: <Users size={20} />, color: 'green' },
    { value: '1.2K+', label: 'Services Active', icon: <Sparkles size={20} />, color: 'purple' },
    { value: '99.9%', label: 'Uptime Status', icon: <ShieldCheck size={20} />, color: 'amber' }
  ];

  // SERVICES DATA
  const services = [
    { 
      name: 'Instagram', 
      icon: <Instagram size={24} />, 
      color: 'from-pink-500 to-purple-600',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-500',
      features: [
        { label: 'Followers', value: '50-50K' },
        { label: 'Likes', value: '50-50K' },
        { label: 'Views', value: '100-100K' },
        { label: 'Stories', value: '50-25K' }
      ],
      rate: '$0.99',
      per: '1k',
      min: '50',
      max: '50K',
      popular: true
    },
    { 
      name: 'TikTok', 
      icon: <Music2 size={24} />, 
      color: 'from-black to-gray-800',
      bgColor: 'bg-gray-800/10',
      textColor: 'text-gray-900 dark:text-gray-100',
      features: [
        { label: 'Followers', value: '100-100K' },
        { label: 'Likes', value: '100-100K' },
        { label: 'Views', value: '200-500K' },
        { label: 'Comments', value: '50-25K' }
      ],
      rate: '$1.49',
      per: '1k',
      min: '100',
      max: '100K',
      popular: false
    },
    { 
      name: 'YouTube', 
      icon: <Youtube size={24} />, 
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-500',
      features: [
        { label: 'Subscribers', value: '50-25K' },
        { label: 'Watch Hours', value: '100-10K' },
        { label: 'Likes', value: '50-50K' },
        { label: 'Views', value: '100-500K' }
      ],
      rate: '$2.99',
      per: '1k',
      min: '50',
      max: '25K',
      popular: true
    },
    { 
      name: 'Facebook', 
      icon: <Facebook size={24} />, 
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-600/10',
      textColor: 'text-blue-600',
      features: [
        { label: 'Page Likes', value: '100-100K' },
        { label: 'Post Reactions', value: '50-50K' },
        { label: 'Followers', value: '100-100K' },
        { label: 'Views', value: '200-500K' }
      ],
      rate: '$0.79',
      per: '1k',
      min: '100',
      max: '100K',
      popular: false
    },
    { 
      name: 'Twitter (X)', 
      icon: <Twitter size={24} />, 
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-400/10',
      textColor: 'text-blue-400',
      features: [
        { label: 'Followers', value: '50-50K' },
        { label: 'Retweets', value: '50-25K' },
        { label: 'Likes', value: '50-50K' },
        { label: 'Impressions', value: '100-500K' }
      ],
      rate: '$0.89',
      per: '1k',
      min: '50',
      max: '50K',
      popular: false
    },
    { 
      name: 'Telegram', 
      icon: <Send size={24} />, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
      features: [
        { label: 'Channel Members', value: '100-200K' },
        { label: 'Post Views', value: '100-500K' },
        { label: 'Reactions', value: '50-25K' }
      ],
      rate: '$0.59',
      per: '1k',
      min: '100',
      max: '200K',
      popular: false
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin size={24} />, 
      color: 'from-blue-700 to-blue-900',
      bgColor: 'bg-blue-700/10',
      textColor: 'text-blue-700',
      features: [
        { label: 'Profile Followers', value: '50-10K' },
        { label: 'Post Likes', value: '50-10K' },
        { label: 'Connections', value: '50-10K' }
      ],
      rate: '$1.99',
      per: '1k',
      min: '50',
      max: '10K',
      popular: false
    },
    { 
      name: 'Pinterest', 
      icon: <Pin size={24} />, 
      color: 'from-red-600 to-red-800',
      bgColor: 'bg-red-600/10',
      textColor: 'text-red-600',
      features: [
        { label: 'Followers', value: '50-25K' },
        { label: 'Pins', value: '50-25K' },
        { label: 'Repins', value: '50-25K' }
      ],
      rate: '$0.69',
      per: '1k',
      min: '50',
      max: '25K',
      popular: false
    },
    { 
      name: 'Spotify', 
      icon: <HeadphonesIcon size={24} />, 
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-500',
      features: [
        { label: 'Track Plays', value: '100-10K' },
        { label: 'Artist Followers', value: '50-10K' },
        { label: 'Listeners', value: '100-10K' }
      ],
      rate: '$3.99',
      per: '1k',
      min: '100',
      max: '10K',
      popular: false
    }
  ];

  // STEPS DATA
  const steps = [
    {
      step: "01",
      title: "Register Account",
      desc: "Create your free account in 30 seconds. No credit card required.",
      icon: <Users />,
      color: "blue"
    },
    {
      step: "02",
      title: "Add Funds",
      desc: "Secure payments via Crypto, PayPal, USDT, or Bank Transfer.",
      icon: <Wallet />,
      color: "purple"
    },
    {
      step: "03",
      title: "Place Order",
      desc: "Select service, enter link, and watch your metrics explode.",
      icon: <Zap />,
      color: "green"
    }
  ];

  // TESTIMONIALS
  const testimonials = [
    {
      name: 'Alex Morgan',
      handle: '@alexmorgan',
      avatar: 'AM',
      content: 'Best SMM panel I\'ve used. Orders start in seconds and support is 24/7. Increased engagement by 300%.',
      rating: 5,
      platform: 'Instagram'
    },
    {
      name: 'Sarah Chen',
      handle: '@sarahchen',
      avatar: 'SC',
      content: 'DzD Marketing is a game changer. Cheapest rates for TikTok and delivery is instant. Highly recommend!',
      rating: 5,
      platform: 'TikTok'
    },
    {
      name: 'Marcus Williams',
      handle: '@marcusw',
      avatar: 'MW',
      content: 'Been using for 6 months. API is rock solid, balance updates instantly, and customer service actually responds.',
      rating: 5,
      platform: 'YouTube'
    },
    {
      name: 'Priya Patel',
      handle: '@priyap',
      avatar: 'PP',
      content: 'Switched from another panel and saved 40%. Dashboard is clean and orders are processed immediately.',
      rating: 5,
      platform: 'Instagram'
    }
  ];

  // Slider functions
  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev + 1 >= services.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev - 1 < 0 ? services.length - 1 : prev - 1
    );
  };

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, autoplay]);

  // Responsive slide calculation
  const [slideWidth, setSlideWidth] = useState(100);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(4);
        setSlideWidth(25);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2.5);
        setSlideWidth(40);
      } else {
        setSlidesPerView(1.2);
        setSlideWidth(83.333);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle button clicks based on auth state
  const handleViewServices = () => {
    if (user) {
      navigate('/dashboard'); // Replace with your actual services route
    } else {
      onSignupClick?.();
    }
  };

  const handleCreateAccount = () => {
    if (user) {
      navigate('/dashboard'); // Replace with your dashboard route
    } else {
      onSignupClick?.();
    }
  };

  const handleViewRates = () => {
    if (user) {
      navigate('/services'); // Replace with your services route
    } else {
      onSignupClick?.();
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#020617] min-h-screen selection:bg-blue-600/30">
      {/* ========== HERO SECTION - MOBILE OPTIMIZED ========== */}
      <section className="relative pt-24 sm:pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="mesh-bg opacity-40">
          <div className="blob -top-20 -left-20 animate-pulse-slow bg-blue-600/20"></div>
          <div className="blob top-1/2 -right-20 animate-float bg-indigo-600/10" style={{ animationDelay: '2s' }}></div>
          <div className="blob -bottom-40 left-1/4 animate-pulse-slow bg-cyan-600/10" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
            
            {/* Left Content - Mobile First (Text) */}
            <div className="text-left order-1 lg:order-1">
              <RevealSection>
                <div className="inline-flex items-center gap-2 bg-blue-600/10 dark:bg-blue-500/20 border border-blue-600/30 px-4 py-2 rounded-full mb-4 sm:mb-6">
                  <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-600 dark:text-blue-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em]">#1 Rated SMM Panel 2024</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4 sm:mb-6 tracking-tighter">
                  Scale Your Social <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Presence Instantly.</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg mb-6 sm:mb-8 font-medium leading-relaxed">
                  The fastest and cheapest SMM panel for all your social media needs. 
                  <span className="font-black text-blue-600 dark:text-blue-400 block sm:inline mt-1 sm:mt-0"> High quality, instant delivery, and 24/7 expert support.</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button 
                    onClick={handleViewServices}
                    className="group bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95"
                  >
                    View Services <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                    <HeadphonesIcon size={14} className="sm:w-4 sm:h-4" /> 24/7 Support
                  </button>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200 dark:border-white/5">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] sm:text-[10px] font-black text-white">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Trusted by 50K+ resellers</p>
                    <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-wider">★ 4.98/5 from 2.4K reviews</p>
                  </div>
                </div>
              </RevealSection>
            </div>

            {/* Right Content - Dashboard Image */}
            <div className="relative order-2 lg:order-2">
              <RevealSection className="lg:pl-10">
                <div className="relative group px-2 sm:px-0">
                  {/* Main Dashboard Image */}
                  <div className="glass p-2 sm:p-3 rounded-3xl sm:rounded-[3.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] lg:shadow-[0_50px_100px_-15px_rgba(0,0,0,0.6)] animate-float border-white/10 relative overflow-hidden group-hover:rotate-1 transition-transform duration-700">
                    <div className="bg-[#050b1a] rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden aspect-[4/3] relative border border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.2),transparent)] z-10 pointer-events-none"></div>
                      
                      <img 
                        src="https://res.cloudinary.com/dbn1nlna6/image/upload/v1770881139/hero-img_mmnvnn.jpg" 
                        alt="SMM Dashboard Interface"
                        className="w-full h-full object-cover object-center opacity-90 transition-transform duration-[20s] group-hover:scale-110"
                      />
                      
                      <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 border border-blue-500/20 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 border border-indigo-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Orders Today Card */}
                  <div className="absolute -bottom-6 sm:-bottom-8 lg:-bottom-10 -left-2 sm:-left-4 lg:-left-6 bg-white dark:bg-[#0f172a] p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl shadow-xl lg:shadow-2xl border border-blue-600/20 animate-float flex items-center gap-2 sm:gap-3 lg:gap-4 z-30" style={{ animationDelay: '0.5s' }}>
                    <div className="w-8 h-8 sm:w-10 lg:w-12 sm:h-10 lg:h-12 rounded-lg sm:rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                      <Activity size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Orders Today</p>
                      <p className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white">24.8K+</p>
                    </div>
                  </div>

                  {/* Avg Delivery Card */}
                  <div className="absolute -top-4 sm:-top-5 lg:-top-6 -right-2 sm:-right-4 lg:-right-6 bg-white dark:bg-[#0f172a] p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl shadow-xl lg:shadow-2xl border border-purple-600/20 animate-float flex items-center gap-2 sm:gap-3 lg:gap-4 z-30" style={{ animationDelay: '1.5s' }}>
                    <div className="w-8 h-8 sm:w-10 lg:w-12 sm:h-10 lg:h-12 rounded-lg sm:rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                      <Zap size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Delivery</p>
                      <p className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white">2.4s</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS BANNER ========== */}
      <RevealSection className="py-10 border-y border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center md:items-center gap-3 text-center md:text-left group cursor-default">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-600/10 flex items-center justify-center text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all duration-300`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ========== TOP SERVICES SLIDER ========== */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-slate-50 to-transparent dark:from-[#020617] dark:to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 lg:mb-16">
            <div>
              <RevealSection>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[9px] mb-3">
                  <Sparkles size={12} /> PREMIUM SERVICES
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                  Our Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Services</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl mt-3 lg:mt-4 font-medium">
                  Comprehensive social media marketing solutions across all major networks. Choose your platform and boost your growth.
                </p>
              </RevealSection>
            </div>
            
            {/* Slider Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={prevSlide}
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                <ChevronLeft size={18} className="lg:w-5 lg:h-5" />
              </button>
              <button 
                onClick={nextSlide}
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                <ChevronRight size={18} className="lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>

          {/* Services Slider */}
          <div className="relative">
            <div 
              ref={sliderRef}
              className="overflow-hidden"
            >
              <div 
                className="flex transition-transform duration-500 ease-out gap-4 lg:gap-6"
                style={{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }}
              >
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0"
                    style={{ flexBasis: `calc(${100 / slidesPerView}% - ${slidesPerView > 1 ? 16 : 0}px)` }}
                  >
                    <div className={`
                      relative bg-white dark:bg-[#0a0f1c] rounded-2xl lg:rounded-3xl border h-full 
                      ${service.popular 
                        ? 'border-2 border-blue-500/50 shadow-xl shadow-blue-600/20 dark:shadow-blue-600/10' 
                        : 'border border-slate-200 dark:border-white/10 hover:border-blue-500/30'
                      } 
                      p-5 sm:p-6 lg:p-7 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 lg:hover:-translate-y-2 group
                    `}>
                      
                      {/* POPULAR BADGE */}
                      {service.popular && (
                        <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-50">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[8px] lg:text-[9px] font-black px-3 lg:px-4 py-1.5 lg:py-2 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/30 whitespace-nowrap flex items-center gap-1.5">
                            <Sparkles size={10} className="lg:w-3 lg:h-3" />
                            MOST POPULAR
                          </div>
                        </div>
                      )}
                      
                      {/* Platform Header */}
                      <div className="flex items-center gap-3 mb-5 lg:mb-6">
                        <div className={`
                          w-12 h-12 lg:w-14 lg:h-14 rounded-2xl lg:rounded-2xl 
                          ${service.bgColor} flex items-center justify-center 
                          ${service.textColor} flex-shrink-0
                          group-hover:scale-110 transition-transform duration-300
                          shadow-lg ${service.popular ? 'shadow-blue-600/20' : ''}
                        `}>
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {service.name}
                          </h3>
                          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
                            {service.features.length} SERVICES
                          </p>
                        </div>
                      </div>
                      
                      {/* Features Grid */}
                      <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-5 lg:mb-6">
                        {service.features.slice(0, 4).map((feature, i) => (
                          <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-xl p-2 lg:p-3">
                            <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                              {feature.label}
                            </p>
                            <p className="text-xs lg:text-sm font-black text-slate-900 dark:text-white">
                              {feature.value}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Price & Min/Max */}
                      <div className="flex items-center justify-between pt-4 lg:pt-5 border-t border-slate-100 dark:border-white/5 mt-auto">
                        <div>
                          <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                            STARTING AT
                          </p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl lg:text-2xl font-black text-blue-600 dark:text-blue-400">
                              {service.rate}
                            </span>
                            <span className="text-[10px] lg:text-xs font-bold text-slate-500">
                              /{service.per}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                            MIN/MAX
                          </p>
                          <p className="text-xs lg:text-sm font-black text-slate-900 dark:text-white">
                            {service.min} - {service.max}
                          </p>
                        </div>
                      </div>
                      
                      {/* View Rates Button */}
                      <button 
                        onClick={handleViewRates}
                        className="w-full mt-4 lg:mt-5 py-3 lg:py-3.5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/10 hover:from-blue-600 hover:to-blue-700 text-slate-700 dark:text-slate-300 hover:text-white rounded-xl lg:rounded-2xl text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-slate-200 dark:border-white/10 hover:border-transparent shadow-sm hover:shadow-lg"
                      >
                        <span>VIEW RATES</span>
                        <ArrowRight size={12} className="lg:w-3 lg:h-3 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Slider Dots */}
          <div className="flex justify-center gap-2 mt-10 lg:mt-12">
            {Array.from({ length: Math.ceil(services.length / slidesPerView) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i * slidesPerView)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentSlide / slidesPerView) === i 
                    ? 'w-8 lg:w-10 bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-blue-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-[#050b1a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <RevealSection>
              <div className="text-blue-500 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] mb-3 lg:mb-4 flex items-center justify-center gap-2">
                <Zap size={12} className="fill-blue-500" /> SIMPLE 3-STEP PROCESS
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 lg:mb-4 tracking-tighter">
                Start Growing in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Seconds</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-medium px-4">
                Simple three-step process to skyrocket your social media presence.
              </p>
            </RevealSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            {steps.map((s, i) => (
              <RevealSection key={i}>
                <div className="relative p-6 lg:p-8 bg-white dark:bg-[#0a0f1c] rounded-2xl lg:rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm group hover:border-blue-500 transition-all hover:-translate-y-1 lg:hover:-translate-y-2 duration-300 h-full flex flex-col">
                  <div className="absolute top-4 lg:top-6 right-4 lg:right-6 text-2xl lg:text-3xl font-black text-slate-100 dark:text-white/5 group-hover:text-blue-500/20 transition-colors">{s.step}</div>
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 bg-${s.color}-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white mb-4 lg:mb-6 shadow-xl shadow-${s.color}-600/20 group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(s.icon as React.ReactElement<any>, { size: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 28 : 24 })}
                  </div>
                  <h4 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-2 lg:mb-3 tracking-tight">{s.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm font-medium leading-relaxed flex-1">{s.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#020617] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <RevealSection>
              <div className="flex items-center justify-center gap-2 text-blue-500 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] mb-3 lg:mb-4">
                <Star size={12} className="fill-blue-500" /> SOCIAL PROOF
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 lg:mb-4 tracking-tighter">
                What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Clients Say</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base font-medium px-4">
                Thousands of our clients have seen a 100% increase in engagement and conversions.
              </p>
            </RevealSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {testimonials.map((t, i) => (
              <RevealSection key={i}>
                <div className="bg-slate-50 dark:bg-[#0a0f1c] p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-slate-200 dark:border-white/5 hover:shadow-xl transition-all hover:-translate-y-1 duration-300 h-full">
                  <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-sm lg:text-lg flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-slate-900 dark:text-white text-xs lg:text-sm truncate">{t.name}</p>
                      <p className="text-[9px] lg:text-[10px] text-slate-500 truncate">{t.handle} · {t.platform}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs lg:text-sm mb-3 lg:mb-4 leading-relaxed line-clamp-3">"{t.content}"</p>
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={12} lg:size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA SECTION ========== */}
      <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
        <RevealSection>
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl lg:rounded-[3rem] p-8 lg:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
            
            <div className="relative z-10 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 lg:mb-6 tracking-tighter leading-tight">
                Ready to Dominate <br className="hidden sm:block" />Social Media?
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-6 lg:mb-8 max-w-2xl mx-auto font-medium px-4">
                Join 50,000+ users who are scaling their accounts faster than ever before. Sign up for free today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
                <button 
                  onClick={handleCreateAccount}
                  className="bg-white text-blue-600 px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm hover:scale-105 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 lg:gap-3"
                >
                  Create Free Account <ArrowRight size={14} className="lg:w-4 lg:h-4" />
                </button>
                <button className="bg-white/10 backdrop-blur-md text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2 lg:gap-3">
                  <HeadphonesIcon size={14} className="lg:w-4 lg:h-4" /> Contact Sales
                </button>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ========== FOOTER ========== */}
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
              <div className="flex items-center gap-2 mb-4 lg:mb-5">
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
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Home</a></li>
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Services</a></li>
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div className="lg:col-span-2">
              <h3 className="text-sm lg:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 lg:mb-5">Support</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm lg:text-base hover:text-blue-600 transition-colors">Refund Policy</a></li>
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
              © 2024 DzD Marketing. All rights reserved. | Designed for scale
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