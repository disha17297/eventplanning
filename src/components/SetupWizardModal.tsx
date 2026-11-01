import React, { useState } from 'react';
import { X, Sparkles, Calendar, DollarSign, Users, CheckCircle2, Heart, Cake, Users2 } from 'lucide-react';
import { Currency, EventData, EventType, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { EVENT_PRESETS, createInitialEvent } from '../data/presets';

interface SetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onComplete: (newEvent: EventData) => void;
  existingEvent?: EventData | null;
}

export const SetupWizardModal: React.FC<SetupWizardModalProps> = ({
  isOpen,
  onClose,
  lang,
  onComplete,
  existingEvent,
}) => {
  const t = TRANSLATIONS[lang];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [eventType, setEventType] = useState<EventType>(existingEvent?.type || 'wedding');
  const [eventName, setEventName] = useState(existingEvent?.title || '');
  const [eventDate, setEventDate] = useState(existingEvent?.date || '2026-11-20');
  const [currency, setCurrency] = useState<Currency>(existingEvent?.currency || '₹');
  const [totalBudget, setTotalBudget] = useState<number>(existingEvent?.totalBudget || 1500000);
  const [guestCount, setGuestCount] = useState<number>(existingEvent?.guestCount || 250);

  if (!isOpen) return null;

  const currentPreset = EVENT_PRESETS[eventType] || EVENT_PRESETS.wedding;

  const handleSelectType = (type: EventType) => {
    setEventType(type);
    const preset = EVENT_PRESETS[type];
    if (!existingEvent || existingEvent.type !== type) {
      setEventName(lang === 'hi' ? preset.titleHi : preset.title);
      setTotalBudget(preset.defaultBudget);
      setGuestCount(preset.defaultGuestCount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = createInitialEvent(
      eventType,
      eventName || (lang === 'hi' ? currentPreset.titleHi : currentPreset.title),
      eventDate,
      Number(totalBudget) || currentPreset.defaultBudget,
      Number(guestCount) || currentPreset.defaultGuestCount,
      currency
    );
    onComplete(newEvent);
    onClose();
  };

  const eventTypeCards = [
    {
      id: 'wedding' as EventType,
      label: t.wizard.wedding,
      icon: Heart,
      descEn: 'Catering 40%, Venue 25%, Decor 15%, Photo 10%, Buffer 10%',
      descHi: 'केटरिंग 40%, वेन्यू 25%, डेकोर 15%, फ़ोटो 10%, बफ़र 10%',
    },
    {
      id: 'birthday' as EventType,
      label: t.wizard.birthday,
      icon: Cake,
      descEn: 'Food 35%, Venue 20%, DJ & Music 15%, Cake 10%, Decor 10%',
      descHi: 'भोजन 35%, वेन्यू 20%, डीजे 15%, केक 10%, डेकोर 10%',
    },
    {
      id: 'community' as EventType,
      label: t.wizard.community,
      icon: Users2,
      descEn: 'Catering 30%, Venue & NOC 25%, Stage 20%, Banners 10%',
      descHi: 'केटरिंग 30%, वेन्यू व परमिशन 25%, मंच 20%, प्रिंट 10%',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1D20]/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/30 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-[#1A1D20] p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          title={t.common.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Luxury Serif & Gold Crest */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#1A1D20] text-[#D4AF37] border border-[#D4AF37]/60 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#9A813A]">
              HostMate Digital Concierge
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1A1D20] leading-tight">
              {t.wizard.modalTitle}
            </h2>
          </div>
        </div>

        {/* 3-Step Wizard Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { s: 1, label: lang === 'hi' ? '1. आयोजन प्रकार' : '1. Event Type' },
            { s: 2, label: lang === 'hi' ? '2. तिथि व विवरण' : '2. Date & Title' },
            { s: 3, label: lang === 'hi' ? '3. बजट व मेहमान' : '3. Budget & Caps' },
          ].map((item) => (
            <button
              key={item.s}
              type="button"
              onClick={() => setStep(item.s as any)}
              className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg text-center transition-all ${
                step === item.s
                  ? 'bg-[#1A1D20] text-white shadow-xs'
                  : step > item.s
                  ? 'bg-[#EFEAE1] text-[#7A6B43]'
                  : 'bg-white/80 text-slate-400 border border-[#E2E8F0]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1: EVENT TYPE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-[#1A1D20] uppercase tracking-wider">
                {t.wizard.eventTypeLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {eventTypeCards.map((item) => {
                  const isSelected = eventType === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectType(item.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-[#D4AF37] bg-white shadow-md ring-1 ring-[#D4AF37]'
                          : 'border-[#E2E8F0] hover:border-slate-300 bg-white/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#D4AF37]' : 'text-slate-600'}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                      </div>
                      <div className="font-serif font-bold text-sm text-[#1A1D20]">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {lang === 'hi' ? item.descHi : item.descEn}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1A1D20] hover:bg-[#2A2F35] rounded-xl shadow-xs transition-colors"
                >
                  {lang === 'hi' ? 'अगला: तिथि व शीर्षक →' : 'Next: Date & Title →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TITLE */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                  {t.wizard.eventNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={t.wizard.eventNamePlaceholder}
                  className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.wizard.eventDateLabel}
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm font-mono bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                    {t.wizard.currencyLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    {(['₹', '$', '€', '£'] as Currency[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCurrency(c)}
                        className={`flex-1 py-2 text-sm font-bold rounded-xl border transition-colors ${
                          currency === c
                            ? 'border-[#D4AF37] bg-[#1A1D20] text-[#D4AF37]'
                            : 'border-[#E2E8F0] bg-white text-slate-700 hover:bg-[#F8F6F1]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  ← {lang === 'hi' ? 'वापस' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1A1D20] hover:bg-[#2A2F35] rounded-xl shadow-xs transition-colors"
                >
                  {lang === 'hi' ? 'अगला: बजट निर्धारण →' : 'Next: Budget & Caps →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET & CAPS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.wizard.budgetLabel} ({currency})
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm font-mono tabular-nums bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.wizard.guestCountLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm font-mono tabular-nums bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Preset Budget Caps Generator Preview */}
              <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1A1D20] flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">✦</span>
                    {lang === 'hi' ? 'स्वतः उत्पन्न बजट विभाजन (Caps Generator):' : 'Auto-Generated Budget Caps:'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">100% Total Split</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentPreset.budgetCapSplits.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] border border-[#EFEAE1]">
                      <span className="text-slate-700 truncate font-medium">
                        {lang === 'hi' ? item.nameHi : item.name}
                      </span>
                      <span className="font-mono tabular-nums font-bold text-[#1A1D20] shrink-0 ml-2">
                        {item.pct}% ({currency}{Math.round((totalBudget * item.pct) / 100).toLocaleString()})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  ← {lang === 'hi' ? 'वापस' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#1A1D20] hover:bg-[#2A2F35] rounded-xl shadow-md border border-[#D4AF37]/40 transition-all active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{t.wizard.submitBtn}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
