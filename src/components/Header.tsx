import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Plus, 
  Globe, 
  ChevronDown, 
  Sun, 
  Moon, 
  ArrowLeft, 
  FileCheck,
  Wallet,
  Armchair,
  CheckSquare,
  Store,
  MessageCircle,
  Mail,
  Camera,
  Leaf,
  Gift,
  Crown,
  Users
} from 'lucide-react';
import { Language, EventData } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeEvent: EventData | null;
  allEvents: EventData[];
  onSelectEvent: (eventId: string) => void;
  onOpenWizard: () => void;
  onGoToLanding: () => void;
  onOpenTests: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  activeEvent,
  allEvents,
  onSelectEvent,
  onOpenWizard,
  onGoToLanding,
  onOpenTests,
}) => {
  const t = TRANSLATIONS[lang];
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState<string | null>(null);
  const navBarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navBarRef.current && !navBarRef.current.contains(event.target as Node)) {
        setOpenCategoryDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenCategoryDropdown(null);
        setShowEventDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Grouped navigation tabs with shortened labels across 5 categories
  const navGroups = [
    {
      id: 'plan',
      label: t.navGroups?.plan || 'Plan',
      icon: Calendar,
      items: [
        { id: 'budget', label: t.shortNav?.budget || 'Budget', fullName: t.nav.budget, icon: Wallet },
        { id: 'subEvents', label: t.shortNav?.subEvents || 'Schedule', fullName: t.nav.subEvents, icon: Calendar },
        { id: 'seating', label: t.shortNav?.seating || 'Seating', fullName: t.nav.seating, icon: Armchair },
        { id: 'tasks', label: t.shortNav?.tasks || 'Checklist', fullName: t.nav.tasks, icon: CheckSquare },
        { id: 'vendors', label: t.shortNav?.vendors || 'Vendors', fullName: t.nav.vendors, icon: Store },
      ],
    },
    {
      id: 'guests',
      label: t.navGroups?.guests || 'Guests',
      icon: Users,
      items: [
        { id: 'rsvp', label: t.shortNav?.rsvp || 'RSVP', fullName: t.nav.rsvp, icon: MessageCircle },
        { id: 'microsite', label: t.shortNav?.microsite || 'Invites', fullName: t.nav.microsite, icon: Mail },
      ],
    },
    {
      id: 'dayOf',
      label: t.navGroups?.dayOf || 'Live Photo Wall',
      icon: Camera,
      items: [
        { id: 'liveWall', label: t.shortNav?.liveWall || 'Photo Wall', fullName: t.nav.liveWall, icon: Camera },
      ],
    },
    {
      id: 'smartTools',
      label: t.navGroups?.smartTools || 'Smart tools',
      icon: Sparkles,
      items: [
        { id: 'aiAdvisor', label: t.shortNav?.aiAdvisor || 'AI Assistant', fullName: t.nav.aiAdvisor, icon: Sparkles },
        { id: 'ecoHost', label: t.shortNav?.ecoHost || 'Eco Calculator', fullName: t.nav.ecoHost, icon: Leaf },
        { id: 'vault', label: t.shortNav?.vault || 'Memories', fullName: t.nav.vault, icon: Gift },
      ],
    },
    {
      id: 'account',
      label: t.navGroups?.account || 'Account',
      icon: Crown,
      items: [
        { id: 'pro', label: t.shortNav?.pro || 'Pro', fullName: t.nav.pro, icon: Crown },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--line)] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ROW 1: Name of website, tagline, language option, theme toggle, and Landing link in ONE line */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--line)]/70 gap-4">
          {/* Logo & Tagline */}
          <div 
            className="flex items-center gap-3 cursor-pointer group min-w-0" 
            onClick={() => onSelectTab('budget')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#12100d] text-[#b49a45] font-serif font-bold text-sm sm:text-base flex items-center justify-center shrink-0 hm-monogram transition-transform group-hover:scale-105">
              HM
            </div>

            <div className="flex items-baseline flex-wrap gap-x-2.5 gap-y-0.5 min-w-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] leading-none shrink-0">
                {t.brand}
              </span>
              <span className="hidden sm:inline text-xs text-[#b49a45] font-serif shrink-0">•</span>
              <span className="text-xs sm:text-sm font-serif italic text-[var(--muted)] tracking-normal leading-none truncate">
                "{t.tagline}"
              </span>
            </div>
          </div>

          {/* Right section of Row 1: Back to Landing, Theme Toggle, and Language */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Back to Home / Landing Page button */}
            <button
              onClick={onGoToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] transition-all shadow-2xs hover:border-[#b49a45]/60 cursor-pointer"
              title="Return to Marketing Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#b49a45]" />
              <span className="hidden sm:inline">{t.landing.backToHome}</span>
            </button>

            {/* Test Suite Button */}
            <button
              onClick={onOpenTests}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] transition-all shadow-2xs hover:border-[#1c5340] cursor-pointer"
              title="Run Automated Test Cases"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#1c5340]" />
              <span className="hidden md:inline">Test Suite</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors shadow-2xs cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#b49a45]" /> : <Moon className="w-4 h-4 text-[#6f675a]" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] transition-all shadow-2xs hover:border-[#b49a45]/60 cursor-pointer"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-4 h-4 text-[#b49a45]" />
              <span className="font-medium">{lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Plan Event button + Event selector line */}
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-3 border-b border-[var(--line)]/60">
          {/* Left section: Green Plan Event Button + Event Dropdown */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Green button for Plan Event */}
            <button
              onClick={onOpenWizard}
              className="flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-bold text-white bg-[#1c5340] hover:bg-[#164233] active:scale-[0.98] rounded-xl shadow-sm border border-[#1c5340] hover:border-[#b49a45] transition-all cursor-pointer group shrink-0"
              title="Plan event details, dates, guest counts and budget caps"
            >
              <Sparkles className="w-4 h-4 text-[#ffd97d] group-hover:rotate-12 transition-transform" />
              <span className="tracking-wide text-xs sm:text-sm">{t.wizard.planEventBtn}</span>
            </button>

            {/* Event switcher dropdown pill */}
            {activeEvent && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEventDropdown(!showEventDropdown)}
                  className="flex items-center gap-2 px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--bg-app)] rounded-xl transition-colors border border-[var(--line)] shadow-2xs max-w-[240px] cursor-pointer"
                  title={activeEvent.title}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#b49a45] shrink-0" />
                  <span className="truncate font-sans">{activeEvent.title}</span>
                  <ChevronDown className="w-3 h-3 text-[var(--muted)] shrink-0" />
                </button>

                {showEventDropdown && (
                  <div className="absolute left-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                      {t.nav.switchEvent}
                    </div>
                    {allEvents.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          onSelectEvent(ev.id);
                          setShowEventDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[var(--bg-app)] transition-colors cursor-pointer ${
                          ev.id === activeEvent.id ? 'font-semibold text-[var(--ink)] bg-[var(--gold-light)] border-l-2 border-[#b49a45]' : 'text-[var(--ink)]/80'
                        }`}
                      >
                        <span className="truncate">{ev.title}</span>
                        <span className="text-[10px] text-[var(--muted)] shrink-0 ml-2 font-mono">{ev.date}</span>
                      </button>
                    ))}
                    <div className="border-t border-[var(--line)] mt-1.5 pt-1.5 px-1.5">
                      <button
                        onClick={() => {
                          setShowEventDropdown(false);
                          onOpenWizard();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--gold-light)] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#b49a45]" />
                        <span>{t.nav.newPlan}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Event Status Tag */}
          {activeEvent && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--muted)] bg-[var(--surface)] px-3 py-1.5 rounded-xl border border-[var(--line)] shadow-2xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#1c5340] animate-pulse" />
              <span className="text-[#1c5340] font-bold">{lang === 'hi' ? 'सक्रिय आयोजन' : 'Active Plan'}</span>
              <span>•</span>
              <span>{activeEvent.guestCount} {t.common.guests}</span>
            </div>
          )}
        </div>

        {/* ROW 3: Dedicated Module Navigation Bar - ONLY Categories in Bar, Labels in Dropdowns */}
        <div 
          ref={navBarRef}
          className="py-2.5 relative no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <nav className="flex items-center gap-2.5 flex-wrap min-w-max py-0.5" aria-label="Modules category navigation">
            {navGroups.map((group) => {
              const isDropdownOpen = openCategoryDropdown === group.id;
              const activeItem = group.items.find((item) => item.id === currentTab);
              const isGroupActive = Boolean(activeItem);
              const CategoryIcon = group.icon;

              return (
                <div key={group.id} className="relative">
                  {/* Category Button in Navigation Bar */}
                  <button
                    type="button"
                    onClick={() => setOpenCategoryDropdown(isDropdownOpen ? null : group.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer border shadow-2xs select-none ${
                      isGroupActive
                        ? 'text-[var(--ink)] bg-[var(--surface)] border-[#b49a45]/60 font-bold ring-1 ring-[#b49a45]/30'
                        : isDropdownOpen
                        ? 'text-[var(--ink)] bg-[var(--surface)] border-[var(--line)] font-bold'
                        : 'text-[var(--muted)] hover:text-[var(--ink)] bg-[var(--surface)]/70 hover:bg-[var(--surface)] border-[var(--line)]/80'
                    }`}
                    aria-expanded={isDropdownOpen}
                    title={`${group.label}: Click to view modules`}
                  >
                    <CategoryIcon className={`w-3.5 h-3.5 shrink-0 ${isGroupActive ? 'text-[#b49a45]' : 'text-[var(--muted)]'}`} />
                    <span className="tracking-wide text-xs">{group.label}</span>

                    {/* Active sub-item chip indicator */}
                    {activeItem && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-[#b49a45]/15 text-[#8a7226] dark:text-[#ffd97d] border border-[#b49a45]/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b49a45]" />
                        {activeItem.label}
                      </span>
                    )}

                    <ChevronDown 
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 text-[#b49a45]' : 'text-[var(--muted)]'
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu with Labels for this Category */}
                  {isDropdownOpen && (
                    <div 
                      className="absolute left-0 mt-1.5 w-64 bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-md"
                      role="menu"
                    >
                      <div className="px-3.5 py-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider font-mono border-b border-[var(--line)]/50 pb-1.5 mb-1">
                        <span>{group.label}</span>
                      </div>

                      <div className="space-y-0.5 px-1">
                        {group.items.map((item) => {
                          const isItemActive = currentTab === item.id;
                          const ItemIcon = item.icon;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                onSelectTab(item.id);
                                setOpenCategoryDropdown(null);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                                isItemActive
                                  ? 'bg-[var(--gold-light)] font-bold text-[var(--ink)] border border-[#b49a45]/40 shadow-2xs'
                                  : 'text-[var(--ink)]/80 hover:text-[var(--ink)] hover:bg-[var(--bg-app)]'
                              }`}
                              role="menuitem"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <ItemIcon className={`w-4 h-4 shrink-0 ${isItemActive ? 'text-[#b49a45]' : 'text-[var(--muted)]'}`} />
                                <div className="truncate">
                                  <div className="font-semibold text-xs leading-snug">{item.label}</div>
                                  <div className="text-[10px] text-[var(--muted)] font-normal truncate">{item.fullName}</div>
                                </div>
                              </div>

                              {isItemActive && (
                                <span className="w-2 h-2 rounded-full bg-[#b49a45] shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
