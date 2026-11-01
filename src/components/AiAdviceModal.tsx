import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  TrendingDown, 
  Lightbulb, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle2, 
  FileText, 
  RefreshCw,
  Send
} from 'lucide-react';
import { EventData, Language, Vendor } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AiAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'budget' | 'ideas' | 'vendor';
  event: EventData;
  lang: Language;
  selectedVendor?: Vendor | null;
}

export const AiAdviceModal: React.FC<AiAdviceModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'budget',
  event,
  lang,
  selectedVendor,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'budget' | 'ideas' | 'vendor'>(initialTab);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Budget advice response
  const [budgetAdvice, setBudgetAdvice] = useState<any>(null);

  // Personalized ideas prompt & response
  const [themeInput, setThemeInput] = useState('');
  const [ideasData, setIdeasData] = useState<any>(null);

  // Vendor review response
  const [vendorReview, setVendorReview] = useState<any>(null);

  if (!isOpen) return null;

  // Run budget review
  const handleFetchBudgetAdvice = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/budget-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.type,
          budget: event.totalBudget,
          guestCount: event.guestCount,
          currency: event.currency,
          categories: event.budgetItems.map((b) => ({
            name: b.name,
            estimated: b.estimatedCost,
            actual: b.actualCost,
            advance: b.advancePaid,
          })),
          lang,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setBudgetAdvice(json.data);
      } else {
        setError(json.error || 'Failed to analyze budget');
      }
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  // Run personalized ideas
  const handleFetchIdeas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/personalized-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.type,
          budget: event.totalBudget,
          guestCount: event.guestCount,
          currency: event.currency,
          customPrompt: themeInput,
          lang,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIdeasData(json.data);
      } else {
        setError(json.error || 'Failed to generate ideas');
      }
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  // Run vendor review
  const handleFetchVendorReview = async (vendor: Vendor) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/vendor-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.type,
          totalBudget: event.totalBudget,
          currency: event.currency,
          vendor: {
            name: vendor.name,
            category: vendor.category,
            agreedPrice: vendor.agreedPrice,
            advancePaid: vendor.advancePaid,
            deliverables: vendor.deliverables,
          },
          lang,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setVendorReview(json.data);
      } else {
        setError(json.error || 'Failed to analyze vendor');
      }
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1D20]/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A1D20] text-[#D4AF37] flex items-center justify-center shadow-xs border border-[#D4AF37]/30">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  HostMate Intelligence
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1A1D20]">{t.aiAdvisor.title}</h3>
              <p className="text-xs text-[#1A1D20]/65 mt-0.5">{t.aiAdvisor.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#1A1D20]/50 hover:text-[#1A1D20] rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-1 bg-[#1A1D20]/5 rounded-xl my-4 shrink-0 border border-[#E2E8F0]">
          <button
            onClick={() => {
              setActiveTab('budget');
              if (!budgetAdvice) handleFetchBudgetAdvice();
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'budget'
                ? 'bg-[#1A1D20] text-white shadow-xs'
                : 'text-[#1A1D20]/70 hover:text-[#1A1D20]'
            }`}
          >
            {t.aiAdvisor.tabBudget}
          </button>

          <button
            onClick={() => {
              setActiveTab('ideas');
              if (!ideasData) handleFetchIdeas();
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'ideas'
                ? 'bg-[#1A1D20] text-white shadow-xs'
                : 'text-[#1A1D20]/70 hover:text-[#1A1D20]'
            }`}
          >
            {t.aiAdvisor.tabIdeas}
          </button>

          <button
            onClick={() => {
              setActiveTab('vendor');
              if (selectedVendor && !vendorReview) handleFetchVendorReview(selectedVendor);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'vendor'
                ? 'bg-[#1A1D20] text-white shadow-xs'
                : 'text-[#1A1D20]/70 hover:text-[#1A1D20]'
            }`}
          >
            {t.aiAdvisor.tabVendor}
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: BUDGET ADVICE */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              {!budgetAdvice && !isLoading && (
                <div className="text-center py-8 space-y-3 bg-white p-6 rounded-2xl border border-[#E2E8F0]">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 text-[#8F741C] flex items-center justify-center mx-auto">
                    <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#1A1D20]">
                    {lang === 'hi' ? 'बजट ऑडिट और अनुकूलन' : 'Budget Audit & Optimization'}
                  </h4>
                  <p className="text-xs text-[#1A1D20]/65 max-w-sm mx-auto leading-relaxed">
                    {lang === 'hi'
                      ? 'अपने बजट, श्रेणियों और मेहमान संख्या का एआई द्वारा वित्तीय विश्लेषण कराएं।'
                      : 'Run a deep financial audit on your current categories, vendor advances, and guest count.'}
                  </p>
                  <button
                    onClick={handleFetchBudgetAdvice}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1A1D20] hover:bg-[#1A1D20]/90 rounded-xl shadow-xs border border-[#D4AF37]/40 cursor-pointer"
                  >
                    {t.aiAdvisor.budgetReviewBtn}
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12 space-y-2 bg-white rounded-2xl border border-[#E2E8F0]">
                  <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
                  <div className="text-xs font-semibold text-[#1A1D20]">{t.common.loading}</div>
                  <div className="text-[11px] text-[#1A1D20]/60">Auditing budget allocations and hidden fees...</div>
                </div>
              )}

              {budgetAdvice && !isLoading && (
                <div className="space-y-4 text-xs animate-in fade-in duration-150">
                  {/* Summary Box */}
                  <div className="p-4 bg-[#1A1D20] text-white rounded-2xl border border-[#D4AF37]/40 shadow-xs">
                    <span className="font-bold text-[#D4AF37] block mb-1 text-sm font-serif">
                      📊 {lang === 'hi' ? 'वित्तीय स्थिति का मूल्यांकन' : 'Financial Health Assessment'}:
                    </span>
                    <p className="text-white/85 leading-relaxed text-xs">{budgetAdvice.summary}</p>
                  </div>

                  {/* Cost Saving Hacks */}
                  {budgetAdvice.costSavingHacks && (
                    <div className="bg-[#1B4332]/10 border border-[#1B4332]/30 rounded-2xl p-4">
                      <div className="font-bold text-[#1B4332] flex items-center gap-1.5 mb-2.5">
                        <TrendingDown className="w-4 h-4 text-[#1B4332]" />
                        <span className="font-serif text-sm">
                          {lang === 'hi' ? 'लागत घटाने के व्यावहारिक हैक्स' : 'Actionable Cost-Saving Hacks'}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {budgetAdvice.costSavingHacks.map((hack: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-[#1A1D20]">
                            <span className="text-[#1B4332] font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{hack}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Hidden Costs Warning */}
                  {budgetAdvice.hiddenCostsWarning && (
                    <div className="bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-2xl p-4">
                      <div className="font-bold text-[#8F741C] flex items-center gap-1.5 mb-2.5">
                        <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-serif text-sm">
                          {lang === 'hi' ? 'छिपे हुए खर्चों की चेतावनी' : 'Hidden Costs & Traps to Watch For'}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {budgetAdvice.hiddenCostsWarning.map((cost: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-[#1A1D20]">
                            <span className="text-[#8F741C] font-bold mt-0.5">!</span>
                            <span className="leading-relaxed">{cost}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-right pt-2">
                    <button
                      onClick={handleFetchBudgetAdvice}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8F741C] hover:text-[#1A1D20] cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'पुनः विश्लेषण करें' : 'Re-run Analysis'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PERSONALIZED THEMES & IDEAS */}
          {activeTab === 'ideas' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  placeholder={
                    lang === 'hi'
                      ? 'उदा. विंटेज बोहो, रॉयल राजपूताना, बॉलीवुड रेट्रो, मिनिमल पेस्टल...'
                      : 'e.g. Royal Traditional, Pastel Garden Sunset, 90s Bollywood Night...'
                  }
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-white text-[#1A1D20] focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  disabled={isLoading}
                  onClick={handleFetchIdeas}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-[#1A1D20] hover:bg-[#1A1D20]/90 rounded-xl shadow-xs disabled:opacity-50 shrink-0 flex items-center gap-1.5 border border-[#D4AF37]/40 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.aiAdvisor.generateIdeasBtn}</span>
                </button>
              </div>

              {isLoading && (
                <div className="text-center py-12 space-y-2 bg-white rounded-2xl border border-[#E2E8F0]">
                  <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
                  <div className="text-xs font-semibold text-[#1A1D20]">{t.common.loading}</div>
                  <div className="text-[11px] text-[#1A1D20]/60">Crafting personalized decor, food and activities...</div>
                </div>
              )}

              {ideasData && !isLoading && (
                <div className="space-y-4 text-xs animate-in fade-in duration-150">
                  <div className="p-4 bg-[#1A1D20] text-white border border-[#D4AF37]/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        Concept Theme
                      </span>
                      <h4 className="font-serif font-bold text-base text-white">{ideasData.themeName}</h4>
                    </div>
                    {ideasData.hostTip && (
                      <div className="max-w-xs text-xs text-[#FAF8F5]/80 italic">
                        "{ideasData.hostTip}"
                      </div>
                    )}
                  </div>

                  {/* Decor Ideas */}
                  {ideasData.decorIdeas && (
                    <div className="space-y-2.5">
                      <div className="font-bold text-[#1A1D20] flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-serif text-sm">
                          {lang === 'hi' ? 'सजावट के बजट-अनुकूल विचार' : 'Budget-Friendly Decor Concepts'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ideasData.decorIdeas.map((idea: any, idx: number) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                            <div className="font-semibold text-[#1A1D20] flex justify-between">
                              <span>{idea.title}</span>
                              <span className="text-[10px] text-[#8F741C] font-mono">{idea.estimatedCostTier}</span>
                            </div>
                            <p className="text-[#1A1D20]/70 mt-1 leading-relaxed text-xs">{idea.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Food & Entertainment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {ideasData.foodDrinkIdeas && (
                      <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-2.5 shadow-xs">
                        <div className="font-serif font-bold text-sm text-[#1A1D20]">
                          🍽️ {lang === 'hi' ? 'खान-पान के अनूठे ट्विस्ट' : 'Food & Drink Twists'}
                        </div>
                        {ideasData.foodDrinkIdeas.map((f: any, idx: number) => (
                          <div key={idx} className="border-b border-slate-100 last:border-none pb-2 last:pb-0">
                            <div className="font-medium text-[#1A1D20]">{f.title}</div>
                            <div className="text-[11px] text-[#1A1D20]/65 mt-0.5">{f.description}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {ideasData.entertainmentIdeas && (
                      <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-2.5 shadow-xs">
                        <div className="font-serif font-bold text-sm text-[#1A1D20]">
                          🎉 {lang === 'hi' ? 'गेम्स व मनोरंजन' : 'Icebreakers & Activities'}
                        </div>
                        {ideasData.entertainmentIdeas.map((ent: any, idx: number) => (
                          <div key={idx} className="border-b border-slate-100 last:border-none pb-2 last:pb-0">
                            <div className="font-medium text-[#1A1D20]">{ent.title}</div>
                            <div className="text-[11px] text-[#1A1D20]/65 mt-0.5">{ent.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VENDOR REVIEW */}
          {activeTab === 'vendor' && (
            <div className="space-y-4">
              {/* Select Vendor Dropdown if not selected */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1D20] mb-1.5">
                  {lang === 'hi' ? 'समीक्षा के लिए वेंडर चुनें:' : 'Select Vendor to Review:'}
                </label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-white text-[#1A1D20] focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => {
                      const found = event.vendors.find((v) => v.id === e.target.value);
                      if (found) handleFetchVendorReview(found);
                    }}
                    defaultValue={selectedVendor?.id || ''}
                  >
                    <option value="" disabled>
                      Choose a vendor...
                    </option>
                    {event.vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.category} - {event.currency}{v.agreedPrice.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isLoading && (
                <div className="text-center py-12 space-y-2 bg-white rounded-2xl border border-[#E2E8F0]">
                  <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
                  <div className="text-xs font-semibold text-[#1A1D20]">{t.common.loading}</div>
                  <div className="text-[11px] text-[#1A1D20]/60">Examining contract clauses and market benchmarks...</div>
                </div>
              )}

              {vendorReview && !isLoading && (
                <div className="space-y-3.5 text-xs animate-in fade-in duration-150">
                  <div className="p-4 bg-[#1A1D20] text-white border border-[#D4AF37]/40 rounded-xl shadow-xs">
                    <span className="font-bold text-[#D4AF37] block font-serif text-sm mb-1">
                      ⚖️ {lang === 'hi' ? 'मूल्य निर्धारण मूल्यांकन' : 'Fairness Assessment'}:
                    </span>
                    <span className="font-semibold text-white/90 text-sm">
                      {vendorReview.fairnessAssessment}
                    </span>
                  </div>

                  {vendorReview.questionsToAskBeforeSigning && (
                    <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                      <div className="font-serif font-bold text-[#1A1D20] mb-2 text-sm">
                        ❓ {lang === 'hi' ? 'हस्ताक्षर से पहले पूछने योग्य प्रश्न' : 'Crucial Questions to Ask Before Signing'}
                      </div>
                      <ul className="space-y-1.5 text-[#1A1D20]/75">
                        {vendorReview.questionsToAskBeforeSigning.map((q: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#D4AF37] font-bold">•</span>
                            <span className="leading-relaxed">{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {vendorReview.negotiationAngles && (
                    <div className="p-4 bg-[#1B4332]/10 border border-[#1B4332]/30 rounded-xl">
                      <div className="font-serif font-bold text-[#1B4332] mb-2 text-sm">
                        🤝 {lang === 'hi' ? 'मोलभाव के बिंदु' : 'Negotiation Angles & Complimentary Add-ons'}
                      </div>
                      <ul className="space-y-1.5 text-[#1A1D20]/80">
                        {vendorReview.negotiationAngles.map((angle: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#1B4332] font-bold">•</span>
                            <span className="leading-relaxed">{angle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {vendorReview.redFlagsToWatch && (
                    <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl">
                      <div className="font-serif font-bold text-rose-950 mb-2 text-sm">
                        🚩 {lang === 'hi' ? 'अनुबंध की मुख्य शर्तें' : 'Key Contract Clauses to Insist On'}
                      </div>
                      <ul className="space-y-1.5 text-rose-900">
                        {vendorReview.redFlagsToWatch.map((flag: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-600 font-bold">•</span>
                            <span className="leading-relaxed">{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
