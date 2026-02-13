import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'; // 👈 Add useLocation
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import DashboardPage from './DashboardPage';
import OnboardingPage from './OnboardingPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import SupportView from './Support';
import HowToUseView from './HowToUseView';
import ArticleView from './ArticleView';
import CategoryView from './CategoryView';
import WalletPage from './wallet/BillingPageView';

// 👇 Add ScrollToTop component here
// 👇 Update ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    // Also scroll all possible scroll containers
    setTimeout(() => {
      // Try to find and scroll the main content container
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }
      
      // Scroll any element with overflow-y auto
      document.querySelectorAll('.overflow-y-auto, .no-scrollbar').forEach(el => {
        el.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      });
    }, 50);
  }, [pathname]);

  return null;
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
        } else {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (showLogin || showSignup) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showLogin, showSignup]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleAuth = (u: any) => {
    setUser(u);
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const handleOnboardingComplete = (data: any) => {
    const updatedUser = { ...user, ...data, onboarded: true };
    setUser(updatedUser);
  };

  const openLogin = () => { setShowLogin(true); setShowSignup(false); };
  const openSignup = () => { setShowSignup(true); setShowLogin(false); };
  const closeModals = () => { setShowLogin(false); setShowSignup(false); };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop /> {/* 👈 Add it here */}
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark bg-dark' : 'bg-slate-50'}`}>
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={user} 
          onLogout={handleLogout}
          onLoginClick={openLogin}
          onSignupClick={openSignup}
        />
        
        <main className={`selection-blue transition-all duration-300 ${(showLogin || showSignup) ? 'blur-[8px] scale-[0.99] opacity-50 pointer-events-none' : ''}`}>
          <Routes>
            <Route path="/" element={<LandingPage onSignupClick={openSignup} />} />
            <Route path="/onboarding" element={<OnboardingPage user={user} onComplete={handleOnboardingComplete} />} />
            <Route path="/dashboard/*" element={<DashboardPage user={user} />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/support" element={<SupportView />} />
            <Route path="/support/how-to-use" element={<HowToUseView />} />
            <Route path="/support/article/:slug" element={<ArticleView />} />
            <Route path="/support/category/:categorySlug" element={<CategoryView />} />
            <Route path="/wallet" element={<WalletPage user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Modals Overlays */}
        {showLogin && (
          <LoginPage 
            onLogin={handleAuth} 
            onClose={closeModals} 
            onSwitchToSignup={openSignup}
          />
        )}
        {showSignup && (
          <SignupPage 
            onSignup={handleAuth} 
            onClose={closeModals} 
            onSwitchToLogin={openLogin}
          />
        )}
      </div>
    </BrowserRouter>
  );
}
