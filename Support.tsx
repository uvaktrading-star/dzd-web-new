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
  ChevronUp,
  Search,
  BookOpen,
  Video,
  HelpCircle,
  MessageCircle,
  FileText,
  LifeBuoy
} from 'lucide-react';
import Footer from './Footer';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Reusable reveal on scroll component
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

// FAQ Item Component
const FaqItem: React.FC<{ question: string; answer: string; isOpen: boolean; toggle: () => void }> = ({
  question,
  answer,
  isOpen,
  toggle
}) => (
  <div className="border-b border-slate-200 dark:border-white/5 last:border-0">
    <button
      onClick={toggle}
      className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
    >
      <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pr-8">{question}</span>
      <ChevronRight
        size={20}
        className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${
          isOpen ? 'rotate-90' : ''
        }`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 pb-5' : 'max-h-0'
      }`}
    >
      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">{answer}</p>
    </div>
  </div>
);

export default function SupporView({ onSignupClick }: { onSignupClick?: () => void }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Sample knowledge base articles
  const articles = [
    {
      title: 'Getting Started – Your First Order',
      description: 'Learn how to create an account, add funds, and place your first order in under 5 minutes.',
      icon: <Rocket size={24} />,
      color: 'blue',
      readTime: '4 min read'
    },
    {
      title: 'How to Add Funds (Crypto, PayPal, USDT)',
      description: 'Step-by-step guide to depositing funds securely using all available payment methods.',
      icon: <Wallet size={24} />,
      color: 'purple',
      readTime: '3 min read'
    },
    {
      title: 'Understanding Service Categories',
      description: 'An overview of our Instagram, TikTok, YouTube, and other services with tips on choosing the right one.',
      icon: <LayoutGrid size={24} />,
      color: 'green',
      readTime: '5 min read'
    },
    {
      title: 'API Integration Guide',
      description: 'For developers: how to integrate our API to automate orders and check balance.',
      icon: <Database size={24} />,
      color: 'amber',
      readTime: '7 min read'
    },
    {
      title: 'Order Delivery Times & Statuses',
      description: 'What to expect after placing an order – from "Pending" to "Completed".',
      icon: <Clock size={24} />,
      color: 'pink',
      readTime: '2 min read'
    },
    {
      title: 'Reseller Program & Whitelabel',
      description: 'Maximize your profits with our reseller discounts and white-label dashboard.',
      icon: <Users size={24} />,
      color: 'indigo',
      readTime: '6 min read'
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: 'How fast are orders delivered?',
      answer: 'Most orders start within seconds. Delivery speed depends on the service and quantity, but we are the fastest in the industry – typically 0–5 minutes for small orders, up to 24 hours for very large orders.'
    },
    {
      question: 'Do I need to provide my password?',
      answer: 'No, never! You only need to provide your username or post link. We never ask for your password, and all orders are processed through public APIs only.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept PayPal, credit/debit cards (via Stripe), Bitcoin, USDT (TRC20/ERC20), and bank transfers. All payments are processed securely.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'We offer refunds if an order cannot be delivered. For delivered orders, refunds are handled on a case-by-case basis. Please contact support within 7 days.'
    },
    {
      question: 'How do I contact support?',
      answer: 'We offer 24/7 live chat, email (support@dzdmarketing.com), and WhatsApp. The quickest way is the live chat widget in the bottom right corner.'
    },
    {
      question: 'Do you have a reseller program?',
      answer: 'Yes! We offer tiered discounts for high-volume users. You can also get a white-label dashboard with your own branding – contact us for details.'
    }
  ];

  // Toggle FAQ
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Filter articles based on search (simple)
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate handlers
  const handleContact = () => {
    if (user) {
      navigate('/contact');
    } else {
      onSignupClick?.();
    }
  };

  const handleOpenChat = () => {
    // Placeholder for live chat integration
    alert('Live chat would open here. For now, please email support@dzdmarketing.com');
  };

  return (
    <div className="bg-slate-50 dark:bg-[#020617] min-h-screen selection:bg-blue-600/30">

      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-28 sm:pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="mesh-bg opacity-40">
          <div className="blob -top-20 -left-20 animate-pulse-slow bg-blue-600/20"></div>
          <div className="blob top-1/2 -right-20 animate-float bg-indigo-600/10" style={{ animationDelay: '2s' }}></div>
          <div className="blob -bottom-40 left-1/4 animate-pulse-slow bg-cyan-600/10" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 dark:bg-blue-500/20 border border-blue-600/30 px-4 py-2 rounded-full mb-6">
                <LifeBuoy size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-blue-600 dark:text-blue-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em]">24/7 SUPPORT CENTER</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tighter">
                How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Help You?</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 font-medium">
                Search our knowledge base, browse tutorials, or get in touch with our support team.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for articles, guides, FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-lg"
                />
              </div>

              {/* Popular topics quick links */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 py-2">Popular:</span>
                <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">
                  Add Funds
                </button>
                <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">
                  First Order
                </button>
                <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">
                  API Guide
                </button>
                <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">
                  Reseller Program
                </button>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ========== KNOWLEDGE BASE ARTICLES ========== */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
              <div className="flex items-center justify-center gap-2 text-blue-500 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] mb-3 lg:mb-4">
                <BookOpen size={12} /> KNOWLEDGE BASE
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 lg:mb-4 tracking-tighter">
                Step-by-<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Step Guides</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base font-medium">
                Everything you need to know to get the most out of our platform.
              </p>
            </div>
          </RevealSection>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredArticles.map((article, idx) => (
              <RevealSection key={idx}>
                <div className="group bg-slate-50 dark:bg-[#0a0f1c] p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/50 hover:shadow-xl transition-all h-full flex flex-col">
                  <div className={`w-12 h-12 rounded-xl bg-${article.color}-600/10 flex items-center justify-center text-${article.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                    {article.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{article.readTime}</span>
                    <button className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                      Read more <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No articles match your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* ========== VIDEO TUTORIALS TEASER ========== */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-[#050b1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <RevealSection>
              <div>
                <div className="flex items-center gap-2 text-blue-500 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] mb-4">
                  <Video size={12} /> VIDEO TUTORIALS
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                  Watch & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Learn</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base mb-6 max-w-lg">
                  Prefer visual learning? Check out our step-by-step video guides covering everything from account setup to advanced API usage.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1">
                  Watch Tutorials <Youtube size={16} />
                </button>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="relative group">
                <div className="glass p-3 rounded-3xl shadow-2xl">
                  <div className="bg-[#050b1a] rounded-2xl overflow-hidden aspect-video relative">
                    <img
                      src="https://res.cloudinary.com/dbn1nlna6/image/upload/v1770881139/hero-img_mmnvnn.jpg"
                      alt="Video tutorial thumbnail"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50">
                        <Youtube size={32} className="text-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ========== FREQUENTLY ASKED QUESTIONS ========== */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#020617]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
              <div className="flex items-center justify-center gap-2 text-blue-500 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] mb-3 lg:mb-4">
                <HelpCircle size={12} /> FAQ
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 lg:mb-4 tracking-tighter">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Questions</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base font-medium">
                Quick answers to common queries.
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="bg-slate-50 dark:bg-[#0a0f1c] rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-white/5">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaqIndex === index}
                  toggle={() => toggleFaq(index)}
                />
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ========== STILL NEED HELP? CTA ========== */}
      <section className="py-16 lg:py-24 px-4">
        <RevealSection>
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl lg:rounded-[3rem] p-8 lg:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>

            <div className="relative z-10 text-white">
              <LifeBuoy size={48} className="mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tighter">
                Still Need Assistance?
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-6 max-w-2xl mx-auto">
                Our support team is available 24/7. Reach out via live chat, email, or WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleOpenChat}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all"
                >
                  <MessageCircle size={16} /> Start Live Chat
                </button>
                <button
                  onClick={handleContact}
                  className="bg-white/10 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                >
                  <Mail size={16} /> Email Support
                </button>
              </div>
              <p className="text-white/60 text-xs mt-6">
                Average response time: &lt; 5 minutes
              </p>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}
