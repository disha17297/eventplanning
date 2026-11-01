import React, { useState } from 'react';
import { 
  Sparkles, 
  Wallet, 
  Mic, 
  Copy, 
  Check, 
  Send, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Share2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { EventData, Language, BudgetCategory } from '../types';
import { formatCurrency } from '../utils/storage';

interface AiAssistantExpandedProps {
  event: EventData;
  lang: Language;
  onOpenCoreAiModal?: () => void;
}

export const AiAssistantExpanded: React.FC<AiAssistantExpandedProps> = ({
  event,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [activeTab, setActiveTab] = useState<'budget' | 'script'>('budget');

  // Script Generator State
  const [scriptType, setScriptType] = useState<'sangeet' | 'father_toast' | 'birthday_games' | 'welcome_emcee'>('sangeet');
  const [scriptTone, setScriptTone] = useState<'humorous' | 'emotional' | 'royal' | 'high_energy'>('humorous');
  const [customPromptInput, setCustomPromptInput] = useState('funny sangeet host script for my elder brother and his fiancee');
  const [scriptLanguage, setScriptLanguage] = useState<'en' | 'hinglish' | 'hi'>('hinglish');
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Budget Optimization Analysis
  const totalBudget = event.totalBudget || 1;
  const categories = event.budgetItems || [];

  const analysisItems = categories.map((cat) => {
    const recommendedAmount = Math.round(totalBudget * (cat.recommendedPct / 100));
    const effectiveSpend = Math.max(cat.actualCost || 0, cat.estimatedCost || 0);
    const variance = effectiveSpend - recommendedAmount;
    const variancePct = Math.round((variance / (recommendedAmount || 1)) * 100);
    const isOver = variance > 0;

    let trimmingTips: string[] = [];
    if (cat.name.toLowerCase().includes('decor')) {
      trimmingTips = [
        'Switch from imported Dutch blooms to seasonal Indian marigolds & tuberose (saves ~25%).',
        'Repurpose daytime Haldi floral props into evening photobooth backdrops.',
        'Use ambient fairy light canopies & warm wash up-lights instead of heavy fabricated ceiling trusses.'
      ];
    } else if (cat.name.toLowerCase().includes('catering') || cat.name.toLowerCase().includes('khan')) {
      trimmingTips = [
        'Streamline live counter desserts from 8 to 4 crowd favorites (saves ₹45,000+).',
        'Freeze final RSVP count 72 hours early to eliminate minimum guarantee over-commitments.',
        'Opt for a single signature mocktail bar rather than an extensive open mixology station.'
      ];
    } else if (cat.name.toLowerCase().includes('photo')) {
      trimmingTips = [
        'Combine candid and traditional packages under one lead boutique studio team.',
        'Book drone operator exclusively for 2 hours during the baraat & varmala entrance.',
        'Request raw high-res cloud footage with 48h highlight reels instead of expensive 5-set physical leather albums.'
      ];
    } else {
      trimmingTips = [
        'Negotiate bundle discounts across multiple sub-events with the same lead supplier.',
        'Verify contractual tax exclusions and power backup inclusions prior to balance settlements.'
      ];
    }

    return {
      cat,
      recommendedAmount,
      effectiveSpend,
      variance,
      variancePct,
      isOver,
      trimmingTips,
    };
  });

  const overBudgetCategories = analysisItems.filter((item) => item.isOver);

  // Script Generator presets
  const presetPrompts = {
    sangeet: 'funny sangeet host script for my brother and sister-in-law with Bollywood jokes and family dance cues',
    father_toast: 'emotional father of the bride wedding toast sharing childhood memories and welcoming the son-in-law',
    birthday_games: 'fun birthday party itinerary with 5 high-energy games for 15 kids aged 7-10',
    welcome_emcee: 'energetic opening speech welcoming guests to the grand reception with couple felicitation',
  };

  const handleSelectPreset = (type: typeof scriptType) => {
    setScriptType(type);
    setCustomPromptInput(presetPrompts[type]);
  };

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/theme-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.type,
          themeInput: `Generate an event speech/script for: "${customPromptInput}". Tone: ${scriptTone}. Language: ${scriptLanguage}. Include stage cues [pause for laughter], [cue DJ music], and crowd engagement prompts.`,
          budget: event.totalBudget,
          guestCount: event.guestCount,
          currency: event.currency,
          lang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.themeName || data.ideas) {
          // Construct formatted script
          const scriptText = `🎤 HOST / EMCEE SCRIPT: ${data.themeName || 'Celebration Host Script'}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `✨ Tone: ${scriptTone.toUpperCase()} | Format: Live Anchor Dialogue\n\n` +
            `[STAGE CUE: Upbeat background music fades, spot light on Host]\n\n` +
            `"Namaste, Aadab, and a very warm welcome to every auntie, uncle, cousin, and friends who have travelled far and wide to celebrate ${event.title} tonight!\n\n` +
            `[PAUSE FOR CHEERS & APPLAUSE]\n\n` +
            `Ladies and gentlemen, tonight isn't just an ordinary party—it's a Bollywood blockbuster in the making. And as our groom always says: 'Why settle for normal when you can have full filmy drama?!'\n\n` +
            (data.paletteReasoning ? `Key Highlight: ${data.paletteReasoning}\n\n` : '') +
            `[CUE DJ: 5-second dhol beat roll]\n\n` +
            `Now, before we call the stars of the evening onto the dance floor, let's establish three golden rules for tonight:\n` +
            `1. No counting calories at the dessert counter.\n` +
            `2. Every family member MUST join the dance floor—no wallflowers permitted!\n` +
            `3. Make memories, take photos, and upload them onto our live stage screen!\n\n` +
            `Are we ready to make some noise?! Let's hear it for the couple! 👏🥂"`;
          setGeneratedScript(scriptText);
        } else {
          fallbackScript();
        }
      } else {
        fallbackScript();
      }
    } catch (err) {
      fallbackScript();
    } finally {
      setIsGenerating(false);
    }
  };

  const fallbackScript = () => {
    let script = '';
    if (scriptType === 'sangeet') {
      script = `🎤 SANGEET EMCEE SCRIPT: "Hum Aapke Hain Koun... Part 2!"\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Tone: Humorous & High-Energy | Language: Hinglish\n\n` +
        `[STAGE CUE: DJ rolls high-energy dhol beat, spot light turns to Emcee]\n\n` +
        `"Namaste, Hello, and Sat Sri Akal to the most energetic wedding gathering in town!\n\n` +
        `[PAUSE FOR CROWD CHEER]\n\n` +
        `Tonight is the night we've all been practicing for in front of bedroom mirrors for three whole weeks! The ladkewale swear they have better moves than Hrithik Roshan, while the ladkiwale claim they invented Bollywood dancing.\n\n` +
        `[CUE DJ: Dramatic 'Dhoom Machale' brass hit]\n\n` +
        `Let me introduce our lead hero of the evening—my brother! He went from 'I'm never getting married' to 'Bhai, do you think pastel pink sherwani matches her lehenga?' in approximately 48 hours!\n\n` +
        `[AUDIENCE LAUGHTER & APPLAUSE]\n\n` +
        `To the bride: You have officially signed up for a lifetime of dad jokes and lost car keys. But we promise, you're getting the kindest heart in the universe.\n\n` +
        `So without further ado, let's welcome the groom's cousins to the stage for Round 1! Give it up for Team Groom! 💃🕺"`;
    } else if (scriptType === 'father_toast') {
      script = `🍷 FATHER OF THE BRIDE TOAST: "A Lifetime of Blessings"\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Tone: Heartfelt & Emotional | Language: English / Hindi\n\n` +
        `"Good evening everyone. Standing here looking at my daughter tonight, I am reminded of the day she took her first steps in our living room...\n\n` +
        `[PAUSE - EMOTIONAL SMILE]\n\n` +
        `Time passes like sand through fingers, but watching her grow into the compassionate, brilliant woman she is today has been the greatest privilege of my life.\n\n` +
        `And to my new son: when you asked for her hand, I didn't see someone taking away my little girl. I saw someone who treats her with the immense respect and joy she deserves.\n\n` +
        `May your home always be filled with laughter, patience, and boundless love. Please raise your glasses to our newlyweds! 🥂"`;
    } else if (scriptType === 'birthday_games') {
      script = `🎈 10TH BIRTHDAY GAMES ITINERARY: 15 Super-Kids Edition\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Game 1: 'The Musical Freeze Statues' (15 mins) - High tempo dance track, pause abruptly!\n` +
        `Game 2: 'Balloon Pop Relay' (20 mins) - Teams race to sit and pop balloons on chairs.\n` +
        `Game 3: 'Pass the Mystery Parcel' (20 mins) - With funny dares (e.g. sing like an opera frog!).\n` +
        `Game 4: 'Tug of War Championship' (15 mins) - Kids vs Parents showdown!\n` +
        `Game 5: 'Grand Cake Cutting Countdown & Confetti Blast' (10 mins)`;
    } else {
      script = `🎙️ GRAND RECEPTION OPENING SCRIPT\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `"Good evening esteemed elders, dear family, and friends! Welcome to the grand felicitation of ${event.title}.\n\n` +
        `Tonight we celebrate not just the union of two souls, but the coming together of two extraordinary families. Please take your seats, enjoy the live saxophone quartet, and prepare to welcome the newlyweds with a standing ovation! ✨"`;
    }
    setGeneratedScript(script);
  };

  const handleCopyScript = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#12100d] text-[#b49a45] flex items-center justify-center font-bold border border-[#b49a45]/30">
              <Sparkles className="w-4 h-4 text-[#ffd97d]" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--ink)]">
              {isHi ? 'होस्टमेट एआई इवेंट असिस्टेंट' : 'HostMate AI Event Assistant'}
            </h2>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            {isHi 
              ? 'बजट ऑप्टिमाइजेशन और लागत-कटौती विश्लेषण, साथ ही पेशेवर एंकर व टोस्ट स्क्रिप्ट जनरेटर।' 
              : 'Category budget trimmer analysis based on local event data, plus AI-generated emcee scripts, wedding toasts, and game itineraries.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--bg-app)] border border-[var(--line)]">
          <button
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'budget'
                ? 'bg-[var(--surface)] text-[var(--ink)] shadow-2xs'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#b49a45]" />
            <span>{isHi ? 'बजट ऑप्टिमाइज़र' : 'Budget Trimmer AI'}</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'script'
                ? 'bg-[var(--surface)] text-[var(--ink)] shadow-2xs'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-[#1c5340]" />
            <span>{isHi ? 'एंकर व टोस्ट स्क्रिप्ट' : 'Anchor & Toast Scripts'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Budget Optimization AI */}
      {activeTab === 'budget' && (
        <div className="space-y-5">
          {/* Summary Alert */}
          {overBudgetCategories.length > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-sm">
                  {isHi 
                    ? `सावधानी: ${overBudgetCategories.length} श्रेणियां अनुशंसित सीमा से अधिक खर्च कर रही हैं` 
                    : `Attention: ${overBudgetCategories.length} categories are exceeding recommended budget caps`}
                </h4>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {isHi
                    ? 'होस्टमेट एआई ने आपके वास्तविक खर्च का विश्लेषण किया है और नीचे लागत कम करने के 3 व्यावहारिक सुझाव दिए हैं।'
                    : 'HostMate AI has analyzed your actual quotes against comparable events and identified high-impact trimming areas below.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#1c5340]/10 border border-[#1c5340]/30 text-[#1c5340] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#1c5340] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-sm">
                  {isHi ? 'बधाई: आपका बजट पूरी तरह संतुलित है!' : 'Outstanding: Your budget is well within benchmark caps!'}
                </h4>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {isHi ? 'कोई भी श्रेणी सीमा से अधिक नहीं है। नीचे सामान्य बचत के सुझाव देखें।' : 'No category is over-spending. Check below for incremental cost efficiencies.'}
                </p>
              </div>
            </div>
          )}

          {/* Cards for each category with trimming recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisItems.map(({ cat, recommendedAmount, effectiveSpend, variance, variancePct, isOver, trimmingTips }) => (
              <div
                key={cat.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isOver
                    ? 'border-amber-500/40 bg-[var(--surface)] shadow-xs'
                    : 'border-[var(--line)] bg-[var(--surface)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[var(--ink)]">
                      {isHi && cat.nameHi ? cat.nameHi : cat.name}
                    </h3>
                    <div className="text-[11px] text-[var(--muted)] mt-0.5">
                      Benchmark Cap: {cat.recommendedPct}% ({formatCurrency(recommendedAmount, event.currency)})
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                      isOver
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        : 'bg-[#1c5340]/10 text-[#1c5340]'
                    }`}
                  >
                    {isOver ? `+${variancePct}% Over` : 'Within Cap'}
                  </span>
                </div>

                {/* Spend Metric */}
                <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--line)]">
                  <div>
                    <span className="text-[10px] text-[var(--muted)] uppercase font-bold">Current Spend</span>
                    <div className="font-mono font-bold text-sm text-[var(--ink)]">
                      {formatCurrency(effectiveSpend, event.currency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--muted)] uppercase font-bold">Variance</span>
                    <div className={`font-mono font-bold text-sm ${isOver ? 'text-rose-600' : 'text-[#1c5340]'}`}>
                      {isOver ? `+${formatCurrency(variance, event.currency)}` : 'Safe'}
                    </div>
                  </div>
                </div>

                {/* AI Cost-Trimming Recommendations */}
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#b49a45] flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{isHi ? 'लागत कम करने के 3 एआई सुझाव' : 'HostMate AI Trimming Recommendations'}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--muted)]">
                    {trimmingTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#1c5340] font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Anchor & Toast Scripts Generator */}
      {activeTab === 'script' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-[#1c5340]" />
              <span>{isHi ? 'स्क्रिप्ट व एंकरिंग जनरेटर' : 'Speech & Itinerary Generator'}</span>
            </h3>

            {/* Quick Templates */}
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-2">
                {isHi ? 'अवसर चुनें' : 'Occasion / Preset Scenario'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sangeet', label: 'Funny Sangeet Emcee' },
                  { id: 'father_toast', label: 'Father of Bride Toast' },
                  { id: 'birthday_games', label: 'Kids Birthday Games' },
                  { id: 'welcome_emcee', label: 'Reception Welcome' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPreset(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      scriptType === item.id
                        ? 'border-[#1c5340] bg-[#1c5340]/10 text-[#1c5340] font-bold'
                        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                {isHi ? 'आपका विचार या आवश्यकता' : 'Custom Prompt / Topic'}
              </label>
              <textarea
                rows={3}
                value={customPromptInput}
                onChange={(e) => setCustomPromptInput(e.target.value)}
                placeholder="e.g. funny sangeet host script for my elder brother and his fiancee"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
              />
            </div>

            {/* Tone & Language Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'टोन (Tone)' : 'Tone'}
                </label>
                <select
                  value={scriptTone}
                  onChange={(e) => setScriptTone(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                >
                  <option value="humorous">Humorous & Playful</option>
                  <option value="emotional">Emotional & Warm</option>
                  <option value="royal">Royal & Traditional</option>
                  <option value="high_energy">High-Energy Bollywood</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'भाषा (Language)' : 'Language'}
                </label>
                <select
                  value={scriptLanguage}
                  onChange={(e) => setScriptLanguage(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                >
                  <option value="hinglish">Hinglish (Party Style)</option>
                  <option value="en">English</option>
                  <option value="hi">शुद्ध हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={isGenerating || !customPromptInput.trim()}
              className="w-full py-2.5 rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin text-[#ffd97d]" /> : <Sparkles className="w-4 h-4 text-[#ffd97d]" />}
              <span>{isGenerating ? (isHi ? 'एआई लिख रहा है...' : 'Crafting Script...') : (isHi ? 'स्क्रिप्ट तैयार करें' : 'Generate Anchor Script')}</span>
            </button>
          </div>

          {/* Script Output Area (7 Cols) */}
          <div className="lg:col-span-7 bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  {isHi ? 'तैयार स्क्रिप्ट व स्टेज संकेत' : 'Generated Script & Stage Cues'}
                </span>
                {generatedScript && (
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-app)] hover:bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-[#1c5340]" /> : <Copy className="w-3.5 h-3.5 text-[#b49a45]" />}
                    <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                )}
              </div>

              {generatedScript ? (
                <div className="mt-4 p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--line)] text-xs text-[var(--ink)] font-mono whitespace-pre-line leading-relaxed max-h-[480px] overflow-y-auto">
                  {generatedScript}
                </div>
              ) : (
                <div className="py-24 text-center space-y-2">
                  <FileText className="w-10 h-10 text-[var(--muted)] mx-auto opacity-50" />
                  <p className="text-xs text-[var(--muted)]">
                    {isHi 
                      ? 'बाईं ओर विकल्प चुनें और "स्क्रिप्ट तैयार करें" पर क्लिक करें।' 
                      : 'Select your options on the left and click "Generate Anchor Script" to create customized speeches with stage cues.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
