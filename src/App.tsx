import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SetupWizardModal } from './components/SetupWizardModal';
import { BudgetTracker } from './components/BudgetTracker';
import { MilestoneTimeline } from './components/MilestoneTimeline';
import { RsvpDashboard } from './components/RsvpDashboard';
import { RsvpPublicView } from './components/RsvpPublicView';
import { VendorHub } from './components/VendorHub';
import { AiAdviceModal } from './components/AiAdviceModal';
import { TestSuiteModal } from './components/TestSuiteModal';
import { SeatingPlanner } from './components/SeatingPlanner';
import { SubEventsManager } from './components/SubEventsManager';
import { DigitalInvitesAndBroadcast } from './components/DigitalInvitesAndBroadcast';
import { LivePhotoWall } from './components/LivePhotoWall';
import { AiAssistantExpanded } from './components/AiAssistantExpanded';
import { ProAgencyHub } from './components/ProAgencyHub';
import { MemoryShagunVault } from './components/MemoryShagunVault';
import { EcoHostCalculator } from './components/EcoHostCalculator';
import { EventData, Language, Vendor, GuestRsvp } from './types';
import { TRANSLATIONS } from './data/translations';
import { 
  getStoredEvents, 
  saveActiveEvent, 
  getActiveEventId, 
  setActiveEventId,
  formatCurrency 
} from './utils/storage';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Compass,
  ArrowLeft
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('hostmate_lang');
    return saved === 'hi' ? 'hi' : 'en';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('hostmate_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Dual view mode: 'landing' (Marketing site) or 'planner' (Interactive workspace)
  const [viewMode, setViewMode] = useState<'landing' | 'planner'>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('planner') || window.location.hash === '#planner') return 'planner';
    const saved = localStorage.getItem('hostmate_view_mode');
    return saved === 'planner' ? 'planner' : 'landing';
  });

  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [activeEventId, setActiveEventIdState] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('budget');

  // Modals state
  const [showWizard, setShowWizard] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showTestSuite, setShowTestSuite] = useState(false);
  const [aiModalTab, setAiModalTab] = useState<'budget' | 'ideas' | 'vendor'>('budget');
  const [selectedVendorForAi, setSelectedVendorForAi] = useState<Vendor | null>(null);

  // Standalone RSVP view mode (when query param ?rsvp=... is present or user clicked preview)
  const [publicRsvpMode, setPublicRsvpMode] = useState(false);

  // Sync theme to root attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hostmate_theme', theme);
  }, [theme]);

  // Load events on mount
  useEffect(() => {
    const events = getStoredEvents();
    setAllEvents(events);
    const activeId = getActiveEventId();
    const found = events.find((e) => e.id === activeId) || events[0];
    if (found) {
      setActiveEventIdState(found.id);
    }

    // Check query params for RSVP link
    const params = new URLSearchParams(window.location.search);
    if (params.get('rsvp')) {
      const rsvpEventId = params.get('rsvp');
      const targetEvent = events.find((e) => e.id === rsvpEventId);
      if (targetEvent) {
        setActiveEventIdState(targetEvent.id);
      }
      setPublicRsvpMode(true);
    }
  }, []);

  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem('hostmate_lang', nextLang);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSwitchView = (mode: 'landing' | 'planner') => {
    setViewMode(mode);
    localStorage.setItem('hostmate_view_mode', mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeEvent = allEvents.find((e) => e.id === activeEventId) || allEvents[0] || null;

  const handleSelectEvent = (id: string) => {
    setActiveEventIdState(id);
    setActiveEventId(id);
  };

  const handleUpdateActiveEvent = (updated: EventData) => {
    const newEvents = saveActiveEvent(updated);
    setAllEvents(newEvents);
  };

  const handleWizardComplete = (newEvent: EventData) => {
    const newEvents = saveActiveEvent(newEvent);
    setAllEvents(newEvents);
    setActiveEventIdState(newEvent.id);
    setCurrentTab('budget');
    handleSwitchView('planner');
  };

  // RSVP submission from guest public form
  const handleAddGuestRsvp = (rsvp: GuestRsvp) => {
    if (!activeEvent) return;
    const updated = {
      ...activeEvent,
      rsvps: [rsvp, ...activeEvent.rsvps],
    };
    handleUpdateActiveEvent(updated);
  };

  // Open AI modal with specific tab
  const handleOpenAiModal = (tab: 'budget' | 'ideas' | 'vendor', vendor?: Vendor) => {
    setAiModalTab(tab);
    setSelectedVendorForAi(vendor || null);
    setShowAiModal(true);
  };

  const t = TRANSLATIONS[lang];

  // If in Public Guest RSVP Form Mode:
  if (publicRsvpMode && activeEvent) {
    return (
      <RsvpPublicView
        event={activeEvent}
        lang={lang}
        onAddRsvp={handleAddGuestRsvp}
        onBackToDashboard={() => setPublicRsvpMode(false)}
        isStandalone={true}
      />
    );
  }

  // Calculate days left
  let daysLeft = 0;
  if (activeEvent?.date) {
    const today = new Date();
    const eventD = new Date(activeEvent.date);
    daysLeft = Math.ceil((eventD.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  // VIEW 1: Marketing Landing Page
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenPlanner={(tab?: string) => {
            if (tab) setCurrentTab(tab);
            handleSwitchView('planner');
          }}
          onPlanEvent={() => {
            setShowWizard(true);
          }}
          onOpenTests={() => setShowTestSuite(true)}
        />

        {/* Smart Setup Wizard Modal directly accessible from Landing */}
        <SetupWizardModal
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          lang={lang}
          onComplete={handleWizardComplete}
          existingEvent={activeEvent}
        />

        {/* Test Suite Modal */}
        <TestSuiteModal
          isOpen={showTestSuite}
          onClose={() => setShowTestSuite(false)}
          lang={lang}
        />
      </>
    );
  }

  // VIEW 2: Planner App Workspace
  return (
    <div className="min-h-screen bg-[var(--bg-landing)] text-[var(--ink)] flex flex-col antialiased transition-colors duration-200">
      {/* 5.1 Two-Row App Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeEvent={activeEvent}
        allEvents={allEvents}
        onSelectEvent={handleSelectEvent}
        onOpenWizard={() => setShowWizard(true)}
        onGoToLanding={() => handleSwitchView('landing')}
        onOpenTests={() => setShowTestSuite(true)}
      />

      {/* Main Workspace Body */}
      {activeEvent ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* 5.2 Event Summary Card */}
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
            <div className="flex items-center gap-4">
              {/* Round rose icon */}
              <div className="w-13 h-13 rounded-full bg-[var(--rose-bg)] text-[var(--rose-ink)] border border-[var(--rose-ink)]/20 flex items-center justify-center font-bold text-2xl shrink-0 shadow-2xs">
                {activeEvent.type === 'wedding' ? '💍' : activeEvent.type === 'birthday' ? '🎂' : '🎪'}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)] tracking-tight">
                    {activeEvent.title}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#b49a45]/15 text-[#8a7226] border border-[#b49a45]/30 px-2.5 py-0.5 rounded-full">
                    {activeEvent.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)] mt-1.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#b49a45]" />
                    <strong className="text-[var(--ink)]">{activeEvent.date}</strong>
                    {daysLeft > 0 ? (
                      <span className="text-[#8a7226] font-semibold font-mono tabular-nums">
                        ({daysLeft} {t.common.daysLeft})
                      </span>
                    ) : (
                      <span className="text-[#1c5340] font-semibold">({lang === 'hi' ? 'आज / संपन्न' : 'Today / Completed'})</span>
                    )}
                  </span>
                  <span className="text-[var(--line)]">•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#b49a45]" />
                    <strong className="font-mono tabular-nums text-[var(--ink)]">{activeEvent.guestCount}</strong> {t.common.guests}
                  </span>
                  <span className="text-[var(--line)]">•</span>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-[#b49a45]" />
                    <span>{lang === 'hi' ? 'कुल बजट' : 'Total Budget'}:</span>
                    <strong className="font-mono tabular-nums text-[var(--ink)]">
                      {formatCurrency(activeEvent.totalBudget, activeEvent.currency)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Concierge Buttons */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                onClick={() => setPublicRsvpMode(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white border border-[#1c5340] transition-colors shadow-2xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#ffd97d]" />
                <span>{lang === 'hi' ? 'RSVP लिंक टेस्ट करें' : 'Preview Guest RSVP'}</span>
              </button>

              <button
                onClick={() => handleOpenAiModal('ideas')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#12100d] hover:bg-[#23201b] text-white border border-[#b49a45]/40 transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ffd97d]" />
                <span>{lang === 'hi' ? 'एआई विचार' : 'AI Ideas'}</span>
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          {currentTab === 'budget' && (
            <BudgetTracker
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
              onOpenAiBudgetModal={() => handleOpenAiModal('budget')}
            />
          )}

          {currentTab === 'tasks' && (
            <MilestoneTimeline
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
            />
          )}

          {currentTab === 'rsvp' && (
            <RsvpDashboard
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
              onPreviewPublicForm={() => setPublicRsvpMode(true)}
            />
          )}

          {currentTab === 'subEvents' && (
            <SubEventsManager
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
            />
          )}

          {currentTab === 'seating' && (
            <SeatingPlanner
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
            />
          )}

          {currentTab === 'microsite' && (
            <DigitalInvitesAndBroadcast
              event={activeEvent}
              lang={lang}
            />
          )}

          {currentTab === 'liveWall' && (
            <LivePhotoWall
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
            />
          )}

          {currentTab === 'vendors' && (
            <VendorHub
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
              onReviewVendorAi={(v) => handleOpenAiModal('vendor', v)}
            />
          )}

          {currentTab === 'aiAdvisor' && (
            <AiAssistantExpanded
              event={activeEvent}
              lang={lang}
              onOpenCoreAiModal={() => setShowAiModal(true)}
            />
          )}

          {currentTab === 'vault' && (
            <MemoryShagunVault
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
            />
          )}

          {currentTab === 'ecoHost' && (
            <EcoHostCalculator
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
            />
          )}

          {currentTab === 'pro' && (
            <ProAgencyHub
              event={activeEvent}
              allEvents={allEvents}
              onSelectEvent={handleSelectEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
            />
          )}
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3 bg-[var(--surface)] p-8 rounded-2xl border border-[var(--line)] max-w-md shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#12100d] text-[#b49a45] flex items-center justify-center mx-auto border border-[#b49a45]/30">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--ink)]">Welcome to HostMate</h2>
            <p className="text-xs text-[var(--muted)] italic">
              {lang === 'hi' ? 'बजट सही, इवेंट हिट!' : 'Budget fit, event hit!'}
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="mt-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#1c5340] hover:bg-[#164233] rounded-xl shadow-xs border border-[#1c5340] cursor-pointer"
            >
              Start Smart Setup Wizard
            </button>
          </div>
        </div>
      )}

      {/* Smart Setup Wizard Modal */}
      <SetupWizardModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        lang={lang}
        onComplete={handleWizardComplete}
        existingEvent={activeEvent}
      />

      {/* AI Advice & Review Modal */}
      {activeEvent && (
        <AiAdviceModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          initialTab={aiModalTab}
          event={activeEvent}
          lang={lang}
          selectedVendor={selectedVendorForAi}
        />
      )}

      {/* Test Suite Modal */}
      <TestSuiteModal
        isOpen={showTestSuite}
        onClose={() => setShowTestSuite(false)}
        lang={lang}
      />
    </div>
  );
}
