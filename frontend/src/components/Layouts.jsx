import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mic, Globe, LogOut, Shield } from 'lucide-react';
import useVoiceCommand from '../hooks/useVoiceCommand';

// 1. Kiosk Layout (Restricted, for Prisoners)
export const KioskLayout = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col h-screen overflow-hidden">
      <header className="p-6 bg-lexora-justice border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="text-lexora-gold" />
          <h1 className="font-bold tracking-widest uppercase">Jail Kiosk Mode</h1>
        </div>
        <div className="text-xs font-mono text-slate-400">Terminal ID: TX-01</div>
      </header>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
      <footer className="p-8 bg-lexora-justice border-t border-white/10 flex justify-center gap-12">
        <button className="flex flex-col items-center gap-2 text-blue-200 hover:text-white">
          <div className="bg-white/10 p-4 rounded-2xl"><Globe size={24} /></div>
          <span className="text-xs font-bold">Language</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-blue-200 hover:text-white">
          <div className="bg-white/10 p-4 rounded-2xl"><Mic size={24} /></div>
          <span className="text-xs font-bold">Voice Help</span>
        </button>
      </footer>
    </div>
  );
};

// 2. Family Layout (Standard with Sidebar/Topnav)
export const FamilyLayout = () => {
  const { t, i18n } = useTranslation();
  const { isListening, startListening } = useVoiceCommand();
  const navigate = useNavigate();

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="glass fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-lexora-justice p-2 rounded-xl text-white"><Shield size={20} /></div>
          <h1 className="text-xl font-black text-lexora-justice tracking-tighter">LEXORA</h1>
        </Link>
        
        <div className="flex items-center gap-6">
          <button onClick={toggleLang} className="flex items-center gap-2 font-bold text-sm text-slate-600 hover:text-lexora-justice">
            <Globe size={18} /> {i18n.language.toUpperCase()}
          </button>
          <button 
            onClick={startListening}
            className={`flex items-center gap-2 font-bold text-sm ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}
          >
            <Mic size={18} /> {isListening ? t('voice.listening') : 'Voice'}
          </button>
          <Link to="/logout" className="bg-slate-100 p-3 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </Link>
        </div>
      </nav>
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  );
};
