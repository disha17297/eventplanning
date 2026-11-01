import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Send, 
  Copy, 
  Check, 
  MapPin, 
  Hotel, 
  Clock, 
  Sparkles, 
  Share2, 
  ExternalLink,
  MessageCircle,
  Shirt,
  Calendar,
  Compass
} from 'lucide-react';
import { EventData, Language } from '../types';

interface DigitalInvitesAndBroadcastProps {
  event: EventData;
  lang: Language;
}

export const DigitalInvitesAndBroadcast: React.FC<DigitalInvitesAndBroadcastProps> = ({
  event,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Broadcast message composer
  const [broadcastTemplate, setBroadcastTemplate] = useState<'starting_soon' | 'venue_update' | 'dress_code' | 'photo_wall' | 'thank_you'>('starting_soon');
  const [customSubEventName, setCustomSubEventName] = useState(event.subEvents?.[1]?.name || 'Sangeet Ceremony');
  const [customMinutes, setCustomMinutes] = useState('15');
  const [customVenue, setCustomVenue] = useState(event.subEvents?.[1]?.venue || 'Grand Ballroom');

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(event.date || '2026-11-20').getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event.date]);

  // Compute broadcast text based on template
  const getBroadcastText = () => {
    switch (broadcastTemplate) {
      case 'starting_soon':
        return `✨ HostMate Live Announcement ✨\n\nDear Friends & Family, the *${customSubEventName}* starts in *${customMinutes} minutes* at *${customVenue}*! 🎊\n\nPlease join us to begin the celebrations: ${window.location.origin}?rsvp=${event.id}`;
      case 'venue_update':
        return `📢 Venue Announcement for ${event.title}:\nThe *${customSubEventName}* will now assemble at *${customVenue}*. Kindly proceed to the venue.\n\nEvent details: ${window.location.origin}?rsvp=${event.id}`;
      case 'dress_code':
        return `👗 Dress Code Reminder for ${event.title}:\nFor today's celebrations, our theme is *${event.subEvents?.[0]?.dressCode || 'Traditional Festive Pastels'}*! We can't wait to see your stunning looks. ✨`;
      case 'photo_wall':
        return `📸 Live Photo Wall is LIVE! Scan & upload your candid selfies, ceremony videos, and blessings directly onto the live stage screen:\n👉 ${window.location.origin}?rsvp=${event.id}#gallery`;
      case 'thank_you':
        return `❤️ Thank You from ${event.title}!\nYour presence, blessings, and joyful spirit made our special day unforgettable. Heartfelt thanks from the entire family! 🙏`;
    }
  };

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}?rsvp=${event.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyBroadcast = () => {
    navigator.clipboard.writeText(getBroadcastText());
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleOpenWhatsAppBroadcast = () => {
    const text = encodeURIComponent(getBroadcastText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Curated stay recommendations
  const accommodations = [
    {
      name: 'The Grand Heritage Palace & Suites',
      dist: '1.2 km from venue',
      rating: '4.8 ★',
      price: '₹ 4,500 / night',
      phone: '+91 98110 54321',
      perk: 'Special discount code "HOSTMATE2026"',
    },
    {
      name: 'Courtyard by Marriott & Spa',
      dist: '2.8 km from venue',
      rating: '4.9 ★',
      price: '₹ 6,200 / night',
      phone: '+91 98220 99887',
      perk: 'Complimentary airport pickup & late checkout',
    },
    {
      name: 'Royal Orchid Residency',
      dist: '3.5 km from venue',
      rating: '4.6 ★',
      price: '₹ 3,200 / night',
      phone: '+91 98330 11223',
      perk: 'Family interconnecting rooms & buffet breakfast',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1c5340]/10 text-[#1c5340] flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--ink)]">
              {isHi ? 'डिजिटल ई-इनवाइट व लाइव व्हाट्सएप ब्रॉडकास्ट' : 'Digital E-Invites & Live WhatsApp Broadcast'}
            </h2>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            {isHi 
              ? 'आधुनिक काउंटडाउन, गूगल मैप्स, होटल ठहरने की जानकारी और एक-क्लिक व्हाट्सएप घोषणाएं।' 
              : 'Public guest microsite with live countdown, map links, hotel stays, plus 1-click WhatsApp announcement blasts.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyPublicLink}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white shadow-xs cursor-pointer transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (isHi ? 'लिंक कॉपी हो गया!' : 'Link Copied!') : (isHi ? 'पब्लिक लिंक कॉपी करें' : 'Copy Microsite Link')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Custom Event Page Microsite Preview */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-xs">
            {/* Phone/Tablet Header Bar */}
            <div className="px-4 py-2.5 bg-[var(--bg-app)] border-b border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Globe className="w-3 h-3 text-[#b49a45]" />
                hostmate.app/e/{event.id.replace('event-', '')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c5340]">
                {isHi ? 'लाइव प्रीव्यू' : 'Live Guest View'}
              </span>
            </div>

            {/* Simulated Microsite Content */}
            <div className="p-6 space-y-6">
              {/* Hero Banner */}
              <div className="text-center space-y-2 py-4">
                <div className="w-12 h-12 rounded-full bg-[#12100d] text-[#b49a45] font-serif font-bold text-lg flex items-center justify-center mx-auto border border-[#b49a45]/30">
                  HM
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#b49a45]">
                  {isHi ? 'विवाह व उत्सव आमंत्रण' : 'Wedding & Celebration Invitation'}
                </span>
                <h1 className="text-3xl font-serif font-bold text-[var(--ink)] tracking-tight">
                  {event.title}
                </h1>
                <p className="text-xs text-[var(--muted)] flex items-center justify-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#b49a45]" />
                  <span>{event.date}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-[#b49a45]" />
                  <span>The Grand Palace Resort & Lawns</span>
                </p>
              </div>

              {/* Countdown Ticker */}
              <div className="bg-[var(--gold-light)]/40 dark:bg-zinc-900/50 rounded-2xl border border-[#b49a45]/30 p-4">
                <div className="text-center text-[10px] font-bold uppercase tracking-widest text-[#8a7226] mb-2">
                  {isHi ? 'उत्सव शुरू होने में शेष समय' : 'Countdown to Celebrations'}
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--line)] shadow-2xs">
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--ink)]">{timeLeft.days}</div>
                    <div className="text-[9px] uppercase tracking-wider text-[var(--muted)]">{isHi ? 'दिन' : 'Days'}</div>
                  </div>
                  <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--line)] shadow-2xs">
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--ink)]">{timeLeft.hours}</div>
                    <div className="text-[9px] uppercase tracking-wider text-[var(--muted)]">{isHi ? 'घंटे' : 'Hours'}</div>
                  </div>
                  <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--line)] shadow-2xs">
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--ink)]">{timeLeft.minutes}</div>
                    <div className="text-[9px] uppercase tracking-wider text-[var(--muted)]">{isHi ? 'मिनट' : 'Mins'}</div>
                  </div>
                  <div className="bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--line)] shadow-2xs">
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--ink)]">{timeLeft.seconds}</div>
                    <div className="text-[9px] uppercase tracking-wider text-[var(--muted)]">{isHi ? 'सेकंड' : 'Secs'}</div>
                  </div>
                </div>
              </div>

              {/* Sub-Events Schedule Card */}
              {event.subEvents && event.subEvents.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#b49a45]" />
                    <span>{isHi ? 'शुभ कार्यक्रम समय-सारणी' : 'Celebration Schedule'}</span>
                  </h3>
                  <div className="space-y-2.5">
                    {event.subEvents.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-serif font-bold text-sm text-[var(--ink)]">
                            {isHi && sub.nameHi ? sub.nameHi : sub.name}
                          </div>
                          <div className="text-[var(--muted)] mt-0.5 flex items-center gap-2">
                            <span>{sub.startTime} - {sub.endTime}</span>
                            <span>•</span>
                            <span>{sub.venue}</span>
                          </div>
                          {sub.dressCode && (
                            <div className="mt-1 text-[11px] font-semibold text-[#1c5340] flex items-center gap-1">
                              <Shirt className="w-3 h-3" />
                              <span>Dress code: {sub.dressCode}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1c5340]/10 text-[#1c5340] shrink-0">
                          {sub.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Venue Map & Directions */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#b49a45]" />
                  <span>{isHi ? 'स्थान व दिशा निर्देश' : 'Venue & Navigation'}</span>
                </h3>
                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-[var(--ink)]">The Grand Palace Resort & Convention Lawns</h4>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5">
                        Golf Course Extension Road, Sector 65, Gurugram, Delhi NCR 122001
                      </p>
                    </div>
                    <a
                      href="https://maps.google.com/?q=The+Grand+Palace+Resort"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1c5340] text-white hover:bg-[#164233] cursor-pointer shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{isHi ? 'मैप में खोलें' : 'Get Directions'}</span>
                    </a>
                  </div>
                  <div className="w-full h-32 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-[var(--line)] relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" 
                      alt="Venue Map Preview" 
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-white/90 text-black text-xs font-bold shadow-md flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                        Click for Google Maps Live Turn-by-Turn
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Hotel Stays */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-1.5">
                  <Hotel className="w-4 h-4 text-[#b49a45]" />
                  <span>{isHi ? 'आस-पास होटल व ठहरने की व्यवस्था' : 'Nearby Accommodations & Hotel Recommendations'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {accommodations.map((acc, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs space-y-1">
                      <div className="font-bold text-[var(--ink)] line-clamp-1">{acc.name}</div>
                      <div className="text-[10px] text-[var(--muted)]">{acc.dist} • {acc.rating}</div>
                      <div className="text-[11px] font-mono font-bold text-[#1c5340]">{acc.price}</div>
                      <div className="text-[10px] text-[#8a7226] font-medium pt-1 border-t border-[var(--line)]">
                        {acc.perk}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): WhatsApp Broadcast Announcements Hub */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <div>
                <h3 className="font-serif font-bold text-base text-[var(--ink)]">
                  {isHi ? 'लाइव व्हाट्सएप घोषणाएं (One-Click Blast)' : 'Live WhatsApp Broadcast'}
                </h3>
                <p className="text-[11px] text-[var(--muted)]">
                  {isHi ? 'मेहमानों को समय पर सूचित करने के लिए तुरंत संदेश भेजें' : 'Send instant ceremony alerts & updates to your guest groups'}
                </p>
              </div>
            </div>

            {/* Preset Announcement Templates */}
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-2">
                {isHi ? 'घोषणा टेम्प्लेट चुनें' : 'Choose Blast Template'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'starting_soon', label: isHi ? '15 मिनट में शुरू' : 'Starting in 15 mins' },
                  { id: 'venue_update', label: isHi ? 'स्थान / हॉल अपडेट' : 'Venue / Hall Shift' },
                  { id: 'dress_code', label: isHi ? 'ड्रेस कोड स्मरण' : 'Dress Code Reminder' },
                  { id: 'photo_wall', label: isHi ? 'फोटो वॉल आमंत्रण' : 'Photo Wall QR Alert' },
                  { id: 'thank_you', label: isHi ? 'धन्यवाद संदेश' : 'Thank You Message' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setBroadcastTemplate(tpl.id as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      broadcastTemplate === tpl.id
                        ? 'border-[#1c5340] bg-[#1c5340]/10 text-[#1c5340] font-bold'
                        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Inputs */}
            {broadcastTemplate === 'starting_soon' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-[var(--muted)] uppercase mb-1">
                    {isHi ? 'कार्यक्रम' : 'Sub-Event'}
                  </label>
                  <input
                    type="text"
                    value={customSubEventName}
                    onChange={(e) => setCustomSubEventName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--muted)] uppercase mb-1">
                    {isHi ? 'मिनट' : 'Minutes'}
                  </label>
                  <input
                    type="text"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>
              </div>
            )}

            {/* Generated WhatsApp Text Preview */}
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                {isHi ? 'संदेश प्रीव्यू (WhatsApp Text)' : 'Broadcast Message Preview'}
              </label>
              <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--line)] font-mono text-xs text-[var(--ink)] whitespace-pre-line leading-relaxed">
                {getBroadcastText()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleOpenWhatsAppBroadcast}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>{isHi ? 'व्हाट्सएप ग्रुप्स में भेजें' : 'Launch WhatsApp Blast'}</span>
              </button>

              <button
                onClick={handleCopyBroadcast}
                className="w-full py-2 px-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5 text-[#1c5340]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMessage ? (isHi ? 'कॉपी हो गया!' : 'Message Copied!') : (isHi ? 'टेक्स्ट कॉपी करें' : 'Copy Broadcast Text')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
