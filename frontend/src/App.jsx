import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Scale, BookOpen, MessageSquare } from 'lucide-react';
import FamilyDashboard from './pages/FamilyDashboard';
import Courtroom from './pages/Courtroom';
import ProductListing from './pages/ProductListing';
import EarningDashboard from './components/EarningDashboard';
import ChatbotWidget from './components/ChatbotWidget';
import GrievancePortal from './pages/GrievancePortal';
import AdminDashboard from './pages/AdminDashboard';
import './i18n/config'; // Init i18n
import { FamilyLayout, KioskLayout } from './components/Layouts';

function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      {/* Navbar */}
      <nav className="glass fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Scale className="text-lexora-gold w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight text-lexora-justice">LEXORA</h1>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link to="/hearing/demo-room" className="hover:text-lexora-justice transition-colors">{t('nav.ecourts')}</Link>
          <Link to="/dashboard/family/earnings" className="hover:text-lexora-justice transition-colors">{t('nav.skills')}</Link>
          <Link to="/dashboard/family" className="hover:text-lexora-justice transition-colors">{t('nav.legal')}</Link>
          <Link to="/grievance" className="hover:text-lexora-justice transition-colors">{t('nav.grievance')}</Link>
        </div>
        <button 
          onClick={() => navigate('/admin')}
          className="bg-lexora-justice text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-lg"
        >
          {t('nav.login')}
        </button>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-lexora-justice to-blue-600 bg-clip-text text-transparent">
            {t('welcome')}.
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero_desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/hearing/demo-room')}
              className="bg-lexora-gold text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform"
            >
              Explore E-Courts
            </button>
            <button 
              onClick={() => navigate('/dashboard/family')}
              className="border-2 border-lexora-justice text-lexora-justice px-8 py-4 rounded-xl font-bold text-lg hover:bg-lexora-justice hover:text-white transition-all"
            >
              Family Portal
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
          {[
            { icon: <Scale />, title: "E-Courts", desc: "Seamless virtual hearings via WebRTC.", link: "/hearing/demo-room" },
            { icon: <BookOpen />, title: "Skill Earning", desc: "Learn and earn while you wait for justice.", link: "/dashboard/family/earnings" },
            { icon: <Shield />, title: "Legal Aid", desc: "AI-powered connectivity with pro-bono lawyers.", link: "/dashboard/family" },
            { icon: <MessageSquare />, title: "Redressal", desc: "Tamper-proof grievance filing system.", link: "/grievance" }
          ].map((feature, i) => (
            <div 
              key={i} 
              onClick={() => navigate(feature.link)}
              className="glass p-8 rounded-3xl hover:shadow-2xl transition-all border border-slate-100 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-lexora-justice group-hover:bg-lexora-justice group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Family Portal */}
        <Route element={<FamilyLayout />}>
          <Route path="/dashboard/family" element={<FamilyDashboard />} />
          <Route path="/dashboard/family/earnings" element={<EarningDashboard />} />
          <Route path="/shop" element={<ProductListing />} />
          <Route path="/grievance" element={<GrievancePortal />} />
        </Route>

        {/* Prisoner Kiosk / E-Court */}
        <Route element={<KioskLayout />}>
          <Route path="/hearing/:roomId" element={<Courtroom />} />
        </Route>

        {/* Admin Center */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <ChatbotWidget />
    </Router>
  );
}

export default App;
