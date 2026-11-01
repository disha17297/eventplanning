import React, { useState } from 'react';
import { 
  Leaf, 
  Trash2, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Users, 
  Utensils, 
  Droplet, 
  Trees, 
  Phone,
  HeartHandshake
} from 'lucide-react';
import { EventData, Language, EcoStats } from '../types';

interface EcoHostCalculatorProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
}

export const EcoHostCalculator: React.FC<EcoHostCalculatorProps> = ({
  event,
  onUpdateEvent,
  lang,
}) => {
  const isHi = lang === 'hi';
  const totalGuests = event.guestCount || 200;

  const currentEco = event.ecoStats || {
    adultsCount: Math.round(totalGuests * 0.75),
    childrenCount: Math.round(totalGuests * 0.15),
    seniorsCount: Math.round(totalGuests * 0.10),
    mealType: 'buffet',
    estimatedFoodKg: Math.round(totalGuests * 0.55),
    plasticBottlesSaved: Math.round(totalGuests * 2.8),
    carbonOffsetKg: Math.round(totalGuests * 1.6),
    surplusPortions: 30,
    foodDonationRequested: false,
    foodDonationNgo: 'Robin Hood Army',
    foodDonationStatus: 'pending',
  };

  const [adults, setAdults] = useState<number>(currentEco.adultsCount);
  const [children, setChildren] = useState<number>(currentEco.childrenCount);
  const [seniors, setSeniors] = useState<number>(currentEco.seniorsCount);
  const [mealType, setMealType] = useState<'buffet' | 'plated' | 'cocktail'>(currentEco.mealType);
  const [selectedNgo, setSelectedNgo] = useState<string>(currentEco.foodDonationNgo || 'Robin Hood Army');
  const [donationRequested, setDonationRequested] = useState<boolean>(!!currentEco.foodDonationRequested);

  // Demographic consumption model:
  // Adult buffet = ~0.60 kg, Child = ~0.30 kg, Senior = ~0.40 kg
  // Plated saves ~15% waste compared to buffet.
  const multiplier = mealType === 'buffet' ? 1.0 : mealType === 'plated' ? 0.85 : 0.75;
  const rawFoodKg = Math.round((adults * 0.60 + children * 0.30 + seniors * 0.40) * multiplier);
  const calculatedBottlesSaved = Math.round((adults + children + seniors) * 2.8);
  const calculatedCarbonKg = Math.round((adults + children + seniors) * 1.65);
  const estimatedSurplus = Math.round(rawFoodKg * 0.12 * 2.2); // approx portions

  const handleUpdateDemographics = (newAdults: number, newKids: number, newSeniors: number, newMeal: 'buffet' | 'plated' | 'cocktail') => {
    setAdults(newAdults);
    setChildren(newKids);
    setSeniors(newSeniors);
    setMealType(newMeal);

    const updatedEco: EcoStats = {
      ...currentEco,
      adultsCount: newAdults,
      childrenCount: newKids,
      seniorsCount: newSeniors,
      mealType: newMeal,
      estimatedFoodKg: rawFoodKg,
      plasticBottlesSaved: calculatedBottlesSaved,
      carbonOffsetKg: calculatedCarbonKg,
      surplusPortions: estimatedSurplus,
    };

    onUpdateEvent({ ...event, ecoStats: updatedEco });
  };

  const handleRequestDonation = () => {
    setDonationRequested(true);
    const updatedEco: EcoStats = {
      ...currentEco,
      foodDonationRequested: true,
      foodDonationNgo: selectedNgo,
      foodDonationStatus: 'dispatched',
    };
    onUpdateEvent({ ...event, ecoStats: updatedEco });
  };

  const ngos = [
    {
      name: 'Robin Hood Army',
      coverage: 'Pan-India (400+ cities)',
      phone: '+91 99990 12345',
      focus: 'Volunteer food rescue within 45 mins of event wrap',
      logo: '💚',
    },
    {
      name: 'Feeding India by Zomato',
      coverage: 'Metro & Tier-1 Hubs',
      phone: '+91 98110 56789',
      focus: 'Temperature-controlled van pickup & hygiene verified',
      logo: '🍲',
    },
    {
      name: 'Roti Bank & Food Relief Foundation',
      coverage: 'Mumbai, Delhi, Pune, Bengaluru',
      phone: '+91 98200 45678',
      focus: 'Direct delivery to night shelters & orphanages',
      logo: '🍞',
    },
  ];

  const ecoAlternatives = [
    {
      title: 'Zero-PET Water Stations',
      description: 'Replace 250ml single-use plastic water bottles with chilled copper dispensers & reusable glassware.',
      impact: `Saves ~${calculatedBottlesSaved} single-use bottles`,
    },
    {
      title: 'Areca Palm Leaf Pattals',
      description: '100% biodegradable, compostable fallen palm leaf plates for Chaat & Haldi rituals.',
      impact: 'Diverts 40+ kg of plastic thermocol from landfills',
    },
    {
      title: 'Edible / Seed Paper Invites',
      description: 'Plantable seed-embedded invitations that blossom into marigolds and basil when potted.',
      impact: 'Zero pulp tree destruction',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1c5340]/15 text-[#1c5340] flex items-center justify-center font-bold">
              <Leaf className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--ink)]">
              {isHi ? 'इको-होस्ट: सतत इवेंट व भोजन बर्बादी कैलकुलेटर' : 'Eco-Host: Sustainable Event & Food Waste Calculator'}
            </h2>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            {isHi 
              ? 'अतिथियों की आयु व भोजन प्रारूप अनुसार सटीक कैटरिंग मात्रा आंकें और अतिरिक्त भोजन को एनजीओ को दान करें।' 
              : 'Estimate precise catering needs by guest demographics to prevent waste, calculate carbon savings, and dispatch surplus food to local NGOs.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#1c5340]/10 text-[#1c5340] border border-[#1c5340]/30 text-xs font-bold flex items-center gap-1.5">
            <Trees className="w-3.5 h-3.5" />
            <span>Green Event Certified</span>
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'अनुमानित कुल भोजन' : 'Estimated Food Needed'}
          </div>
          <div className="text-xl font-mono font-bold text-[var(--ink)] mt-1">
            {rawFoodKg} kg
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'बचाई गई प्लास्टिक बोतलें' : 'Plastic Bottles Saved'}
          </div>
          <div className="text-xl font-mono font-bold text-[#1c5340] mt-1">
            {calculatedBottlesSaved} 🍶
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'कार्बन फुटप्रिंट ऑफसेट' : 'Carbon Offset'}
          </div>
          <div className="text-xl font-mono font-bold text-[#8a7226] mt-1">
            {calculatedCarbonKg} kg CO₂e
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'अधिशेष भोजन पैकेट' : 'Surplus Portions'}
          </div>
          <div className="text-xl font-mono font-bold text-amber-600 mt-1">
            ~{estimatedSurplus} meals
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Demographic Consumption Inputs */}
        <div className="lg:col-span-5 bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[var(--line)]">
            <h3 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#1c5340]" />
              <span>{isHi ? 'अतिथि जनसांख्यिकी व प्रारूप' : 'Guest Demographics & Meal Format'}</span>
            </h3>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              {isHi ? 'विभिन्न आयु वर्ग के भोजन सेवन के अनुसार कैटरिंग की सटीक मात्रा तय करें' : 'Tailor food weights by age group and dining format to prevent excess prep'}
            </p>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-[var(--ink)] mb-1">
                <span>{isHi ? 'वयस्क (18 - 60 वर्ष)' : 'Adults (18 - 60 yrs)'}</span>
                <span className="font-mono text-[#1c5340]">{adults} guests</span>
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                value={adults}
                onChange={(e) => handleUpdateDemographics(Number(e.target.value), children, seniors, mealType)}
                className="w-full accent-[#1c5340] cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold text-[var(--ink)] mb-1">
                <span>{isHi ? 'बच्चे (3 - 17 वर्ष)' : 'Children (3 - 17 yrs)'}</span>
                <span className="font-mono text-[#1c5340]">{children} kids</span>
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={children}
                onChange={(e) => handleUpdateDemographics(adults, Number(e.target.value), seniors, mealType)}
                className="w-full accent-[#1c5340] cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold text-[var(--ink)] mb-1">
                <span>{isHi ? 'वरिष्ठ नागरिक (60+ वर्ष)' : 'Seniors (60+ yrs)'}</span>
                <span className="font-mono text-[#1c5340]">{seniors} elders</span>
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={seniors}
                onChange={(e) => handleUpdateDemographics(adults, children, Number(e.target.value), mealType)}
                className="w-full accent-[#1c5340] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-2">
                {isHi ? 'भोजन सेवा प्रारूप' : 'Dining Service Format'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'buffet', label: 'Grand Buffet' },
                  { id: 'plated', label: 'Plated Sit-Down' },
                  { id: 'cocktail', label: 'Cocktail Snacks' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => handleUpdateDemographics(adults, children, seniors, fmt.id as any)}
                    className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      mealType === fmt.id
                        ? 'border-[#1c5340] bg-[#1c5340]/10 text-[#1c5340] font-bold'
                        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Eco Alternatives List */}
          <div className="pt-3 border-t border-[var(--line)] space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#b49a45] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHi ? 'शून्य-प्लास्टिक वेंडर विकल्प' : 'Zero-Plastic Alternatives'}</span>
            </div>
            <div className="space-y-2">
              {ecoAlternatives.map((alt, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--line)] text-xs">
                  <div className="font-bold text-[var(--ink)]">{alt.title}</div>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">{alt.description}</p>
                  <div className="text-[10px] font-semibold text-[#1c5340] mt-1">{alt.impact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Leftover Food Donation Integration */}
        <div className="lg:col-span-7 bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[var(--line)] flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#1c5340]" />
                <span>{isHi ? 'अधिशेष भोजन दान व एनजीओ पिकअप' : 'Surplus Food Rescue & NGO Dispatch'}</span>
              </h3>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {isHi ? 'उत्सव समाप्त होने पर अतिरिक्त भोजन स्थानीय फूड बैंकों को तुरंत सौंपें' : 'Connect with verified food banks to collect and distribute untouched banquet surplus'}
              </p>
            </div>
          </div>

          {/* Status Box */}
          <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
            donationRequested 
              ? 'bg-[#1c5340]/10 border-[#1c5340]/30 text-[#1c5340]' 
              : 'bg-[var(--bg-app)] border-[var(--line)] text-[var(--ink)]'
          }`}>
            <div className="flex items-start gap-3">
              <Truck className={`w-5 h-5 shrink-0 mt-0.5 ${donationRequested ? 'text-[#1c5340]' : 'text-[#b49a45]'}`} />
              <div>
                <h4 className="font-serif font-bold text-sm">
                  {donationRequested
                    ? (isHi ? 'पिकअप अनुरोध सफलतापूर्वक दर्ज किया गया!' : `Surplus Rescue Dispatched to ${selectedNgo}!`)
                    : (isHi ? 'भोजन बचाव पिकअप तैयार है' : 'Ready to Request Surplus Pickup')}
                </h4>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {donationRequested
                    ? (isHi ? 'स्वयंसेवक टीम कार्यक्रम समाप्ति के 45 मिनट के भीतर स्वच्छ कंटेनरों के साथ पहुंचेगी।' : 'A local volunteer team will arrive with food-safe containers ~45 mins post-event.')
                    : (isHi ? `लगभग ${estimatedSurplus} भोजन पैकेट्स जरूरतमंदों तक पहुँचाए जा सकते हैं।` : `Approximately ${estimatedSurplus} untouched surplus meal portions ready for immediate rescue.`)}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] shrink-0">
              {donationRequested ? 'Scheduled' : 'Standby'}
            </span>
          </div>

          {/* NGO Selection Cards */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
              {isHi ? 'संबद्ध एनजीओ भागीदार चुनें' : 'Select Food Bank Partner'}
            </label>

            {ngos.map((ngo) => (
              <div
                key={ngo.name}
                onClick={() => setSelectedNgo(ngo.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedNgo === ngo.name
                    ? 'border-[#1c5340] bg-[#1c5340]/5 ring-1 ring-[#1c5340]/40'
                    : 'border-[var(--line)] bg-[var(--surface)] hover:border-[#b49a45]/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">{ngo.logo}</span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[var(--ink)]">{ngo.name}</h4>
                    <p className="text-[11px] text-[var(--muted)]">{ngo.focus}</p>
                    <span className="text-[10px] text-[#8a7226] font-medium">{ngo.coverage}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-semibold text-[var(--muted)] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#1c5340]" />
                    <span>{ngo.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Request Button */}
          <button
            onClick={handleRequestDonation}
            className="w-full py-3 rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Truck className="w-4 h-4 text-[#ffd97d]" />
            <span>
              {donationRequested
                ? (isHi ? 'पिकअप विवरण अपडेट करें' : `Update Pickup with ${selectedNgo}`)
                : (isHi ? `1-क्लिक पिकअप अनुरोध भेजें (${estimatedSurplus} भोजन)` : `Request 1-Click Food Rescue Pickup (~${estimatedSurplus} meals)`)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
