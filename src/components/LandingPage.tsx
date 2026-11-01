import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Users, 
  Wallet, 
  MessageCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Sun, 
  Moon, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  X,
  Clock,
  ShieldCheck,
  Star,
  FileCheck
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface LandingPageProps {
  lang: Language;
  onToggleLang: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenPlanner: (tab?: string) => void;
  onPlanEvent: () => void;
  onOpenTests?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  onOpenPlanner,
  onPlanEvent,
  onOpenTests,
}) => {
  const t = TRANSLATIONS[lang];
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<number | null>(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding',
    date: '',
    notes: '',
  });

  const stories = [
    {
      id: 1,
      quote: lang === 'hi'
        ? "होस्टमेट ने हमारे 600 मेहमानों की शादी को बजट के भीतर रखा बिना किसी समझौते के। कैटरर को लाइव वेजिटेरियन व जैन हेडकाउंट डैशबोर्ड बेहद पसंद आया!"
        : "HostMate kept our 600-guest wedding strictly on budget without cutting corners. The caterer was thrilled with the live vegetarian & Jain headcount dashboard!",
      author: "Aarav & Priya Sharma",
      event: lang === 'hi' ? "रॉयल वेडिंग, नई दिल्ली" : "Royal Wedding, New Delhi",
      stats: lang === 'hi' ? "₹24 लाख बजट • 600 मेहमान" : "₹24L Budget • 600 Guests",
      rating: 5,
      avatarInitials: "AP",
    },
    {
      id: 2,
      quote: lang === 'hi'
        ? "दिन-वार रन शीट ने हमारे पूरे परिवार को तनावमुक्त कर दिया। हर वेंडर और समन्वयक को ठीक से पता था कि कब क्या करना है।"
        : "The chronological day-of run sheet saved our sanity. Every coordinator and vendor knew exactly when to arrive and what to execute.",
      author: "Mehra Family",
      event: lang === 'hi' ? "25वीं वर्षगांठ जुबली, मुंबई" : "25th Silver Jubilee Anniversary, Mumbai",
      stats: lang === 'hi' ? "₹8.5 लाख बजट • 180 मेहमान" : "₹8.5L Budget • 180 Guests",
      rating: 5,
      avatarInitials: "MF",
    },
    {
      id: 3,
      quote: lang === 'hi'
        ? "व्हाट्सएप RSVP लिंक से हमें 48 घंटों में 95% मेहमानों की पुष्टि मिल गई। और एआई बजट सलाह ने साउंड और स्टेज सेटअप पर ₹1.8 लाख बचाए!"
        : "The WhatsApp RSVP link gave us 95% confirmed guest responses in 48 hours. And the AI budget advice saved us ₹1.8 Lakhs on sound & stage setup.",
      author: "Neha & Karan Singhania",
      event: lang === 'hi' ? "संगीत व कॉकटेल उत्सव, जयपुर" : "Sangeet & Cocktail Gala, Jaipur",
      stats: lang === 'hi' ? "₹16 लाख बजट • 350 मेहमान" : "₹16L Budget • 350 Guests",
      rating: 5,
      avatarInitials: "NK",
    },
  ];

  const galleryItems = [
    {
      id: 1,
      title: lang === 'hi' ? "रॉयल मंडप व सूर्यास्त विहंगम" : "Traditional Royal Mandap at Dusk",
      category: lang === 'hi' ? "विवाह मंडप" : "Wedding Mandap",
      description: lang === 'hi' ? "हजारों मोगरा और गेंदे के फूलों से सुसज्जित भव्य शाम।" : "Canopy adorned with fresh marigolds, tuberoses, and ambient brass lanterns.",
      accent: "from-amber-700/80 to-amber-950/90",
      svgType: "mandap",
    },
    {
      id: 2,
      title: lang === 'hi' ? "संगीत स्टेज व लाइव ढोल उत्सव" : "Sangeet Stage & Live Dhol Gala",
      category: lang === 'hi' ? "संगीत संगीत संध्या" : "Sangeet Celebration",
      description: lang === 'hi' ? "गोल्डन एम्बर लाइट्स और शानदार डांस परफॉरमेंस।" : "Dynamic LED backdrop with warm gold trusses and live performance staging.",
      accent: "from-rose-800/80 to-purple-950/90",
      svgType: "stage",
    },
    {
      id: 3,
      title: lang === 'hi' ? "भव्य 50वां जन्मदिन बैंक्वेट" : "50th Milestone Birthday Banquet",
      category: lang === 'hi' ? "जन्मदिन उत्सव" : "Milestone Birthday",
      description: lang === 'hi' ? "शैंपेन टोस्ट, गुब्बारों का आर्च और लाइव जैज़ बैंड।" : "Elegant banquet setup with champagne toast and bespoke dessert tables.",
      accent: "from-emerald-800/80 to-slate-950/90",
      svgType: "birthday",
    },
    {
      id: 4,
      title: lang === 'hi' ? "कैंडललाइट डिनर टेबल डेकोर" : "Candlelit Intimate Table Centerpiece",
      category: lang === 'hi' ? "डिनर व कैटरिंग" : "Dinner & Dining",
      description: lang === 'hi' ? "क्रिस्टल ग्लासवेयर, ताजे गुलाब की पंखुड़ियां व मोमबत्तियां।" : "Fine cutlery, linen runners, and brass candelabras for 450 guests.",
      accent: "from-amber-800/80 to-stone-950/90",
      svgType: "dining",
    },
    {
      id: 5,
      title: lang === 'hi' ? "शानदार बारात व आतिशबाजी" : "Grand Baraat & Sparkler Procession",
      category: lang === 'hi' ? "बारात व संगीत" : "Grand Procession",
      description: lang === 'hi' ? "खुशियों की चमक, ढोल की धुन और कोल्ड-पायरो आतिशबाजी।" : "Safe cold-pyro fireworks illuminating the midnight royal arrival.",
      accent: "from-orange-800/80 to-zinc-950/90",
      svgType: "fireworks",
    },
    {
      id: 6,
      title: lang === 'hi' ? "सामुदायिक दिवाली व दीपोत्सव" : "Community Diwali & New Year Gala",
      category: lang === 'hi' ? "सामुदायिक उत्सव" : "Community Festival",
      description: lang === 'hi' ? "5,000 दीपकों की जगमगाहट और पारंपरिक सांस्कृतिक प्रस्तुतियां।" : "A warm gathering of 800 families with live classical music and feast.",
      accent: "from-yellow-800/80 to-yellow-950/90",
      svgType: "festival",
    },
  ];

  const handleNextStory = () => {
    setActiveStoryIdx((prev) => (prev + 1) % stories.length);
  };

  const handlePrevStory = () => {
    setActiveStoryIdx((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationSubmitted(true);
    setTimeout(() => {
      setShowConsultationModal(false);
      setConsultationSubmitted(false);
      setConsultationForm({
        name: '',
        email: '',
        phone: '',
        eventType: 'Wedding',
        date: '',
        notes: '',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-landing)] text-[var(--ink)] antialiased transition-colors duration-200">
      {/* 4.1 TOP NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--line)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-full bg-[#12100d] text-[#b49a45] font-serif font-bold text-base flex items-center justify-center shrink-0 hm-monogram">
              HM
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[var(--ink)] leading-none">
                {t.brand}
              </span>
              <span className="font-serif italic text-xs text-[#b49a45] tracking-wide mt-0.5">
                "{t.tagline}"
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            <a href="#services" className="hover:text-[var(--ink)] hover:border-b-2 hover:border-[#b49a45] pb-0.5 transition-all">
              {t.landing.navServices}
            </a>
            <a href="#stories" className="hover:text-[var(--ink)] hover:border-b-2 hover:border-[#b49a45] pb-0.5 transition-all">
              {t.landing.navStories}
            </a>
            <a href="#gallery" className="hover:text-[var(--ink)] hover:border-b-2 hover:border-[#b49a45] pb-0.5 transition-all">
              {t.landing.navGallery}
            </a>
            <a href="#contact" className="hover:text-[var(--ink)] hover:border-b-2 hover:border-[#b49a45] pb-0.5 transition-all">
              {t.landing.navContact}
            </a>
          </div>

          {/* Right Controls: Theme, Language, Open Planner Button */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors shadow-2xs cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#b49a45]" /> : <Moon className="w-4 h-4 text-[#6f675a]" />}
            </button>

            {/* Language Switch */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] text-xs font-semibold hover:border-[#b49a45] transition-colors shadow-2xs cursor-pointer"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-3.5 h-3.5 text-[#b49a45]" />
              <span className="hidden sm:inline">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Open Planner CTA */}
            <button
              onClick={() => onOpenPlanner()}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1c5340] hover:bg-[#164233] rounded-xl shadow-sm border border-[#1c5340] hover:border-[#b49a45] transition-all cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b49a45] group-hover:rotate-12 transition-transform" />
              <span>{t.landing.openPlanner}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* 4.2 HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0d1220] text-white flex flex-col justify-between" style={{ minHeight: 'min(78vh, 580px)' }}>
        {/* Background atmospheric inline SVG illustration (string lights, glowing warm lanterns, starry bokeh) */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 600">
            <defs>
              <radialGradient id="heroGlow1" cx="20%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#b49a45" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0d1220" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heroGlow2" cx="80%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#1c5340" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0d1220" stopOpacity="0" />
              </radialGradient>
              <filter id="softBlur">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <rect width="1200" height="600" fill="#0d1220" />
            <rect width="1200" height="600" fill="url(#heroGlow1)" />
            <rect width="1200" height="600" fill="url(#heroGlow2)" />

            {/* Festoon / fairy light garlands */}
            <path d="M 0,40 Q 300,110 600,45 Q 900,120 1200,40" fill="none" stroke="#b49a45" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
            <path d="M 0,90 Q 300,160 600,95 Q 900,170 1200,90" fill="none" stroke="#b49a45" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />

            {/* Glowing fairy light bulbs */}
            {[60, 150, 240, 330, 420, 510, 600, 690, 780, 870, 960, 1050, 1140].map((x, i) => {
              const y = 40 + Math.sin((x / 1200) * Math.PI * 2) * 35 + 20;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="6" fill="#ffd97d" opacity="0.8" filter="url(#softBlur)" />
                  <circle cx={x} cy={y} r="2.5" fill="#ffffff" />
                  <line x1={x} y1={y - 12} x2={x} y2={y} stroke="#b49a45" strokeWidth="1" opacity="0.6" />
                </g>
              );
            })}

            {/* Warm floating bokeh orbs */}
            <circle cx="150" cy="380" r="45" fill="#b49a45" opacity="0.12" filter="url(#softBlur)" />
            <circle cx="950" cy="220" r="60" fill="#e6c875" opacity="0.1" filter="url(#softBlur)" />
            <circle cx="580" cy="480" r="80" fill="#1c5340" opacity="0.25" filter="url(#softBlur)" />
          </svg>
        </div>

        {/* Ambient subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1220] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center my-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#b49a45]/40 text-[#ffd97d] text-[11px] font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#b49a45]" />
            <span>{t.landing.heroEyebrow}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            {t.landing.heroHeadline}
          </h1>

          {/* Tagline / Subtitle in Cormorant Garamond italic */}
          <p className="mt-5 text-xl sm:text-2xl font-serif italic text-[#e6dcc8] max-w-2xl mx-auto leading-relaxed">
            "{t.tagline}"
          </p>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            {t.landing.heroSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onPlanEvent}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase text-[#12100d] bg-gradient-to-r from-[#ffd97d] via-[#b49a45] to-[#c8a94b] hover:from-[#ffe094] hover:to-[#dbbd5f] shadow-lg shadow-[#b49a45]/20 hover:shadow-[#b49a45]/40 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-[#12100d]" />
              <span>{t.landing.planMyEvent}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#services"
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-semibold tracking-wide text-white/90 hover:text-white border border-white/20 hover:border-[#b49a45] bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t.landing.exploreFeatures}</span>
            </a>
          </div>
        </div>

        {/* Hero Bottom KPI Ribbon */}
        <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#ffd97d]">
              <Wallet className="w-4 h-4 text-[#b49a45]" />
              <span>{t.landing.statBudget}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#ffd97d]">
              <Users className="w-4 h-4 text-[#b49a45]" />
              <span>{t.landing.statRsvp}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#ffd97d]">
              <CheckCircle2 className="w-4 h-4 text-[#b49a45]" />
              <span>{t.landing.statTimelines}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4.3 SERVICES SECTION (2-Column Grid: 5fr : 7fr) */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 5 Cols - Rich Gold Card (#b49a45) */}
          <div className="lg:col-span-5 bg-[#b49a45] text-[#12100d] rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden flex flex-col justify-between">
            {/* Ambient vector ornament background */}
            <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#12100d" strokeWidth="1.5">
                <circle cx="50" cy="50" r="45" strokeDasharray="2 3" />
                <path d="M50 5 Q 70 35 50 65 Q 30 35 50 5 Z" />
                <path d="M50 95 Q 70 65 50 35 Q 30 65 50 95 Z" />
                <path d="M5 50 Q 35 70 65 50 Q 35 30 5 50 Z" />
                <path d="M95 50 Q 65 70 35 50 Q 65 30 95 50 Z" />
              </svg>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#12100d]/80 bg-white/20 px-3 py-1 rounded-full">
                <span>{t.landing.servicesKicker}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#12100d] leading-tight">
                {t.landing.servicesTitle}
              </h2>

              <p className="text-sm sm:text-base text-[#12100d]/90 font-medium leading-relaxed">
                {t.landing.servicesSubtitle}
              </p>

              {/* Expandable DISCOVER button */}
              <div className="pt-2">
                <button
                  onClick={() => setServicesExpanded(!servicesExpanded)}
                  className="px-6 py-3 rounded-xl bg-[#12100d] hover:bg-[#23201b] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{servicesExpanded ? t.landing.hideDetails : t.landing.discover}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${servicesExpanded ? '-rotate-90' : 'rotate-0'}`} />
                </button>
              </div>
            </div>

            {/* Quick feature pill hints */}
            <div className="relative z-10 mt-10 pt-6 border-t border-[#12100d]/20 grid grid-cols-2 gap-3 text-xs font-bold text-[#12100d]/90">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#12100d]" />
                <span>Smart Budgets</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#12100d]" />
                <span>WhatsApp RSVP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#12100d]" />
                <span>Vendor Directory</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#12100d]" />
                <span>Day-Of Run Sheet</span>
              </div>
            </div>
          </div>

          {/* Right Column: 7 Cols - Warm Bokeh Celebration Illustration + Expandable Feature Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual celebration card */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-3 sm:max-w-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b49a45]">
                    {lang === 'hi' ? 'भारतीय उत्सवों के लिए विशेष' : 'Tailored For Indian Celebrations'}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[var(--ink)]">
                    {lang === 'hi' ? 'शादियों और उत्सवों की सम्पूर्ण योजना' : 'Flawless Coordination for Families & Hosts'}
                  </h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {lang === 'hi' 
                      ? 'हल्दी, मेहंदी, संगीत से लेकर रिसेप्शन तक हर रस्म के लिए तैयार बजट और शेड्यूल।'
                      : 'From Haldi & Sangeet to Reception feasts, keep budget caps locked and guests informed effortlessly.'}
                  </p>
                  <button
                    onClick={() => onOpenPlanner('budget')}
                    className="text-xs font-bold text-[#1c5340] hover:text-[#b49a45] inline-flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'बजट ट्रैकर में जाएं' : 'Open in Budget Vault'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Inline SVG celebration art */}
                <div className="w-full sm:w-64 h-48 rounded-2xl bg-gradient-to-br from-[#12392d] to-[#0c2a21] border border-[#b49a45]/30 p-4 flex flex-col justify-between text-white shrink-0 relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#b49a45]/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#ffd97d]">HostMate Core</span>
                    <Sparkles className="w-4 h-4 text-[#ffd97d]" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-emerald-200">{lang === 'hi' ? 'अनुशंसित विभाजन' : 'Recommended Split'}</div>
                    <div className="text-lg font-serif font-bold text-white">Catering 40% • Venue 25%</div>
                    <div className="text-[11px] text-slate-300">Decor 15% • Buffer 10%</div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 pt-2 border-t border-white/10">
                    <span>Active Event Ready</span>
                    <span className="text-[#ffd97d] font-bold">100% Free</span>
                  </div>
                </div>
              </div>
            </div>

            {/* If DISCOVER clicked, show the 4 outlined cards */}
            {servicesExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
                {/* 1. Budget Tracker */}
                <div className="bg-[var(--surface)] border border-[var(--line)] hover:border-[#b49a45] rounded-2xl p-5 transition-all shadow-2xs group">
                  <div className="w-9 h-9 rounded-xl bg-[#1c5340]/10 text-[#1c5340] flex items-center justify-center mb-3">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[var(--ink)] mb-1">
                    {lang === 'hi' ? 'स्मार्ट कोर बजट' : 'Smart Core Budget'}
                  </h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                    {lang === 'hi'
                      ? 'इवेंट प्रकार के आधार पर ऑटो स्प्लिट और भुगतान की अंतिम तिथियों के साथ रियल-टाइम ट्रैकिंग।'
                      : 'Auto percentage splits, advance deposits tracking, and balance due reminders.'}
                  </p>
                  <button 
                    onClick={() => onOpenPlanner('budget')}
                    className="text-xs font-bold text-[#b49a45] group-hover:text-[#1c5340] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'बजट खोलें' : 'Launch Tracker'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* 2. WhatsApp RSVP */}
                <div className="bg-[var(--surface)] border border-[var(--line)] hover:border-[#b49a45] rounded-2xl p-5 transition-all shadow-2xs group">
                  <div className="w-9 h-9 rounded-xl bg-[#1c5340]/10 text-[#1c5340] flex items-center justify-center mb-3">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[var(--ink)] mb-1">
                    {lang === 'hi' ? 'व्हाट्सएप RSVP हब' : 'WhatsApp-Native RSVP'}
                  </h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                    {lang === 'hi'
                      ? 'मेहमानों के लिए बिना ऐप डाउनलोड किए डायरेक्ट मोबाइल फॉर्म और कैटरर के लिए भोजन वरीयता सारांश।'
                      : 'Lightweight web link for chat groups. Live headcount & pure veg / Jain meals summary.'}
                  </p>
                  <button 
                    onClick={() => onOpenPlanner('rsvp')}
                    className="text-xs font-bold text-[#b49a45] group-hover:text-[#1c5340] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'RSVP हब देखें' : 'Launch RSVP'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* 3. Vendor Hub */}
                <div className="bg-[var(--surface)] border border-[var(--line)] hover:border-[#b49a45] rounded-2xl p-5 transition-all shadow-2xs group">
                  <div className="w-9 h-9 rounded-xl bg-[#1c5340]/10 text-[#1c5340] flex items-center justify-center mb-3">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[var(--ink)] mb-1">
                    {lang === 'hi' ? 'केंद्रीकृत वेंडर हब' : 'Centralized Vendor Hub'}
                  </h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                    {lang === 'hi'
                      ? 'वेंडर संपर्क, कोटेशन दस्तावेज और शेष राशि भुगतान के लिए ऑटो रिमाइंडर।'
                      : 'Directory cards, PDF quote attachments, and advance balance notifications.'}
                  </p>
                  <button 
                    onClick={() => onOpenPlanner('vendors')}
                    className="text-xs font-bold text-[#b49a45] group-hover:text-[#1c5340] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'वेंडर्स देखें' : 'Launch Vendor Hub'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* 4. Day-Of Run Sheet & AI */}
                <div className="bg-[var(--surface)] border border-[var(--line)] hover:border-[#b49a45] rounded-2xl p-5 transition-all shadow-2xs group">
                  <div className="w-9 h-9 rounded-xl bg-[#1c5340]/10 text-[#1c5340] flex items-center justify-center mb-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[var(--ink)] mb-1">
                    {lang === 'hi' ? 'रन शीट व एआई सुझाव' : 'Day-Of Run Sheet & AI'}
                  </h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
                    {lang === 'hi'
                      ? 'मिनट-दर-मिनट शेड्यूल, प्रिंट करने योग्य PDF और GenAI लागत-बचत सुझाव।'
                      : 'Hour-by-hour schedules exportable to PDF, plus AI negotiation & theme advice.'}
                  </p>
                  <button 
                    onClick={() => onOpenPlanner('tasks')}
                    className="text-xs font-bold text-[#b49a45] group-hover:text-[#1c5340] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'शेड्यूल देखें' : 'Launch Timeline'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4.4 STORIES / TESTIMONIALS CAROUSEL */}
      <section id="stories" className="py-20 bg-[var(--surface)] border-y border-[var(--line)] scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b49a45]">
              {t.landing.storiesKicker}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink)] mt-2">
              {t.landing.storiesTitle}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2">
              {t.landing.storiesSubtitle}
            </p>
          </div>

          {/* Active Story Card */}
          <div className="relative bg-[var(--bg-landing)] border border-[var(--line)] rounded-3xl p-8 sm:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-6 flex-1">
                {/* 5-Star indicator */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#b49a45] text-[#b49a45]" />
                  ))}
                  <span className="text-xs font-bold text-[#b49a45] ml-2">Verified Host Review</span>
                </div>

                {/* Quote in Cormorant Garamond */}
                <p className="font-serif text-xl sm:text-2xl text-[var(--ink)] italic leading-relaxed">
                  "{stories[activeStoryIdx].quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="w-12 h-12 rounded-full bg-[#1c5340] text-[#ffd97d] font-serif font-bold text-base flex items-center justify-center shrink-0">
                    {stories[activeStoryIdx].avatarInitials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--ink)]">
                      {stories[activeStoryIdx].author}
                    </h4>
                    <p className="text-xs text-[var(--muted)]">
                      {stories[activeStoryIdx].event} • <span className="font-mono text-[#b49a45]">{stories[activeStoryIdx].stats}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <button
                  onClick={handlePrevStory}
                  className="w-11 h-11 rounded-full border border-[var(--line)] bg-[var(--surface)] hover:bg-[#b49a45] hover:text-white hover:border-[#b49a45] text-[var(--ink)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                  title="Previous Story"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono font-bold text-[var(--muted)] px-1">
                  {activeStoryIdx + 1} / {stories.length}
                </span>
                <button
                  onClick={handleNextStory}
                  className="w-11 h-11 rounded-full border border-[var(--line)] bg-[var(--surface)] hover:bg-[#b49a45] hover:text-white hover:border-[#b49a45] text-[var(--ink)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                  title="Next Story"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 GALLERY SECTION & LIGHTBOX */}
      <section id="gallery" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#b49a45]">
              {t.landing.galleryKicker}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink)] mt-2">
              {t.landing.galleryTitle}
            </h2>
          </div>
          <p className="text-xs text-[var(--muted)] max-w-xs sm:text-right">
            {lang === 'hi' 
              ? 'किसी भी कार्ड पर क्लिक करके भव्य झलकियां देखें।'
              : 'Click any celebration card to view full photographs & event details.'}
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedGalleryItem(idx)}
              className="group cursor-pointer rounded-3xl overflow-hidden border border-[var(--line)] bg-[var(--surface)] hover:border-[#b49a45] transition-all shadow-2xs hover:shadow-md flex flex-col"
            >
              {/* Visual Container */}
              <div className={`h-48 w-full bg-gradient-to-br ${item.accent} relative p-6 flex flex-col justify-between text-white overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-500">
                  <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="none">
                    <circle cx="30" cy="30" r="40" fill="#ffffff" opacity="0.1" />
                    <circle cx="170" cy="90" r="50" fill="#ffffff" opacity="0.1" />
                    <line x1="0" y1="20" x2="200" y2="40" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
                  </svg>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                  <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="relative z-10">
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#ffd97d] transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-3 mt-3 border-t border-[var(--line)] flex items-center justify-between text-[11px] font-bold text-[#b49a45]">
                  <span>{lang === 'hi' ? 'विवरण देखें' : 'View Memory'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedGalleryItem !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] text-[var(--ink)] max-w-2xl w-full rounded-3xl border border-[#b49a45]/50 overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedGalleryItem(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Photo / Artwork */}
            <div className={`h-64 sm:h-80 w-full bg-gradient-to-br ${galleryItems[selectedGalleryItem].accent} p-8 flex flex-col justify-between text-white relative`}>
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full">
                  {galleryItems[selectedGalleryItem].category}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {galleryItems[selectedGalleryItem].title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {galleryItems[selectedGalleryItem].description}
              </p>

              <div className="p-4 rounded-2xl bg-[var(--bg-landing)] border border-[var(--line)] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[var(--ink)]">
                    {lang === 'hi' ? 'होस्टमेट से प्लान किया गया' : 'Organized with HostMate'}
                  </div>
                  <div className="text-[11px] text-[var(--muted)]">
                    {lang === 'hi' ? 'स्मार्ट बजट और रन शीट के साथ सफल निष्पादन' : 'Realized within budget with zero day-of delays.'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedGalleryItem(null);
                    onPlanEvent();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {t.landing.planMyEvent}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.6 FOOTER & CONTACT SECTION (4 Columns) */}
      <footer id="contact" className="mt-auto bg-[#12100d] text-white border-t border-[#b49a45]/30 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            {/* Column 1: Studio Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1c5340] text-[#b49a45] font-serif font-bold text-sm flex items-center justify-center">
                  HM
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-white">{t.brand}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Cyber Hub, DLF Phase 2<br />
                Gurugram, HR 122002<br />
                India
              </p>
              <div className="flex items-center gap-2 text-xs text-[#b49a45] pt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Delhi NCR • Mumbai • Bengaluru</span>
              </div>
            </div>

            {/* Column 2: Direct Contact */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#b49a45]">
                {t.landing.navContact}
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#b49a45]" />
                  <span>concierge@hostmate.in</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#b49a45]" />
                  <span>+91 98765 43210</span>
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#b49a45]" />
                  <span>WhatsApp 24/7 Hotline</span>
                </p>
              </div>
            </div>

            {/* Column 3: Brand Promise */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#b49a45]">
                {lang === 'hi' ? 'हमारा संकल्प' : 'Our Promise'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-serif italic text-sm">
                "{t.tagline}"
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'हर भारतीय परिवार और आयोजक को बिना किसी अतिरिक्त खर्च के तनावमुक्त आयोजन का भरोसा।'
                  : 'Empowering families and organizers with elegant financial caps, effortless RSVP, and on-time coordination.'}
              </p>
            </div>

            {/* Column 4: Consultation & Planner CTAs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#b49a45]">
                {lang === 'hi' ? 'प्लानिंग शुरू करें' : 'Get Started'}
              </h4>
              <button
                onClick={() => setShowConsultationModal(true)}
                className="w-full px-4 py-3 rounded-xl bg-[#b49a45] hover:bg-[#c8a94b] text-[#12100d] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                {t.landing.consultation}
              </button>
              <button
                onClick={() => onOpenPlanner()}
                className="w-full px-4 py-2.5 rounded-xl border border-white/20 hover:border-[#b49a45] text-white text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t.landing.openPlanner}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © {new Date().getFullYear()} {t.brand}. {t.landing.rights}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-[#b49a45]">English & हिन्दी</span>
              {onOpenTests && (
                <>
                  <span>•</span>
                  <button onClick={onOpenTests} className="hover:text-[#b49a45] cursor-pointer flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                    <FileCheck className="w-3.5 h-3.5 text-[#1c5340]" />
                    <span>Test Suite</span>
                  </button>
                </>
              )}
              <span>•</span>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white cursor-pointer">
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* CONSULTATION MODAL */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] text-[var(--ink)] max-w-md w-full rounded-3xl border border-[#b49a45]/40 p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowConsultationModal(false)}
              className="absolute top-5 right-5 text-[var(--muted)] hover:text-[var(--ink)]"
            >
              <X className="w-5 h-5" />
            </button>

            {consultationSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold">{lang === 'hi' ? 'धन्यवाद!' : 'Thank You!'}</h3>
                <p className="text-xs text-[var(--muted)]">
                  {lang === 'hi'
                    ? 'हमारी इवेंट कंसीयज टीम जल्द ही आपसे संपर्क करेगी।'
                    : 'Our event concierge team will reach out to you within 2 business hours.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#b49a45]">
                    {lang === 'hi' ? 'निःशुल्क परामर्श' : 'Free Consultation'}
                  </span>
                  <h3 className="font-serif text-2xl font-bold mt-1">
                    {t.landing.consultation}
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {lang === 'hi'
                      ? 'अपनी तिथि और बजट साझा करें। हम आपके लिए अनुकूल योजना तैयार करेंगे।'
                      : 'Share your event details and our certified planners will review your setup.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={consultationForm.name}
                    onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--bg-landing)] focus:outline-none focus:ring-1 focus:ring-[#b49a45]"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={consultationForm.email}
                      onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--bg-landing)] focus:outline-none focus:ring-1 focus:ring-[#b49a45]"
                      placeholder="name@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={consultationForm.phone}
                      onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--bg-landing)] focus:outline-none focus:ring-1 focus:ring-[#b49a45]"
                      placeholder="+91 98765..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Event Type & Date</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={consultationForm.eventType}
                      onChange={(e) => setConsultationForm({ ...consultationForm, eventType: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--bg-landing)] focus:outline-none focus:ring-1 focus:ring-[#b49a45]"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Community">Community Event</option>
                      <option value="Anniversary">Anniversary</option>
                    </select>
                    <input
                      type="date"
                      value={consultationForm.date}
                      onChange={(e) => setConsultationForm({ ...consultationForm, date: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--bg-landing)] focus:outline-none focus:ring-1 focus:ring-[#b49a45]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Confirm & Request Call
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
