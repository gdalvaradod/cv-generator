import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, FileCheck, Sparkles, ArrowRight, Globe, Moon, Sun } from 'lucide-react';
import { translations } from './translations';

export default function Landing() {
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'es');
  const t = translations[lang];
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'dark');

  useEffect(() => { localStorage.setItem('appLang', lang); }, [lang]);

  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-indigo-500/30">
      
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">My Free CV</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-full p-1 shadow-sm">
            <button onClick={toggleLang} className="p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 transition-colors rounded-full"><Globe className="w-4 h-4" /></button>
            <button onClick={toggleTheme} className="p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 transition-colors rounded-full">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-widest mb-8 border border-indigo-100 dark:border-indigo-500/20">
          <Sparkles className="w-4 h-4" /> v0.9.0 Beta
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]">
          {t.landingHeroTitle.split(' ').slice(0, -2).join(' ')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
            {t.landingHeroTitle.split(' ').slice(-2).join(' ')}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          {t.landingHeroSub}
        </p>

        <Link to="/app" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold px-8 py-4 rounded-full transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1">
          {t.landingCta} <ArrowRight className="w-5 h-5" />
        </Link>
      </main>

      {/* FEATURES SECTION */}
      <section className="bg-white dark:bg-[#111111] py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white">{t.landingFeatTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0a0a0a] border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{t.landingFeat1Title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{t.landingFeat1Desc}</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0a0a0a] border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{t.landingFeat2Title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{t.landingFeat2Desc}</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0a0a0a] border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{t.landingFeat3Title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{t.landingFeat3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-12 bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t.footerDev} • v0.9.0 Beta
          </p>
          <a href="mailto:geovanny.alvaradod@gmail.com" className="text-xs text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
            {t.footerContact} geovanny.alvaradod@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}