import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Users, 
  Utensils, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Phone,
  MessageCircle,
  Search
} from 'lucide-react';
import { EventData, FoodPreference, GuestRsvp, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RsvpDashboardProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
  onPreviewPublicForm: () => void;
}

export const RsvpDashboard: React.FC<RsvpDashboardProps> = ({
  event,
  onUpdateEvent,
  lang,
  onPreviewPublicForm,
}) => {
  const t = TRANSLATIONS[lang];
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCatererMsg, setCopiedCatererMsg] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add manual RSVP state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualAttendance, setManualAttendance] = useState<'yes' | 'no'>('yes');
  const [manualPlusOnes, setManualPlusOnes] = useState(0);
  const [manualFood, setManualFood] = useState<FoodPreference>('veg');
  const [manualNotes, setManualNotes] = useState('');

  // Computations
  const attendingGuests = event.rsvps.filter((r) => r.attendance === 'yes');
  const declinedGuests = event.rsvps.filter((r) => r.attendance === 'no');

  const totalAttendingAdults = attendingGuests.length;
  const totalPlusOnes = attendingGuests.reduce((acc, r) => acc + (r.plusOnes || 0), 0);
  const totalConfirmedPax = totalAttendingAdults + totalPlusOnes;

  // Food breakdown (estimating plus ones follow similar food category unless specified)
  const vegCount = attendingGuests.filter((r) => r.foodPreference === 'veg').reduce((acc, r) => acc + 1 + (r.plusOnes || 0), 0);
  const nonVegCount = attendingGuests.filter((r) => r.foodPreference === 'non-veg').reduce((acc, r) => acc + 1 + (r.plusOnes || 0), 0);
  const jainCount = attendingGuests.filter((r) => r.foodPreference === 'jain').reduce((acc, r) => acc + 1 + (r.plusOnes || 0), 0);
  const veganCount = attendingGuests.filter((r) => r.foodPreference === 'vegan').reduce((acc, r) => acc + 1 + (r.plusOnes || 0), 0);

  // Dietary special notes list
  const specialDietNotes = attendingGuests.filter((r) => r.dietaryNotes).map((r) => `${r.name}: ${r.dietaryNotes}`);

  // RSVP URL
  const rsvpUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?rsvp=${event.id}`
    : `https://hostmate.app/?rsvp=${event.id}`;

  // WhatsApp Invite Text
  const inviteText = lang === 'hi'
    ? `✨ सादर आमंत्रण! आप ${event.title} के शुभ अवसर पर सादर आमंत्रित हैं।\n📅 दिनांक: ${event.date}\nकृपया अपनी उपस्थिति व भोजन वरीयता दर्ज करने के लिए इस लिंक पर क्लिक करें: ${rsvpUrl}\n\nसादर,\nआयोजक परिवार`
    : `✨ Warm Greetings! You are cordially invited to celebrate ${event.title}.\n📅 Date: ${event.date}\nPlease confirm your attendance and meal preference via this quick RSVP link: ${rsvpUrl}\n\nWarm regards,\nHost Family`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(rsvpUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleLaunchWhatsAppInvite = () => {
    const encoded = encodeURIComponent(inviteText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Caterer summary message for WhatsApp
  const catererMsg = lang === 'hi'
    ? `🍽️ *केटरिंग हेडकाउंट अपडेट — ${event.title}*\n📅 दिनांक: ${event.date}\n👥 कुल पुष्ट मेहमान (Total Pax): *${totalConfirmedPax}*\n\n🥗 शुद्ध शाकाहारी (Veg): *${vegCount}*\n🍗 मांसाहारी (Non-Veg): *${nonVegCount}*\n🌱 जैन भोजन (Jain): *${jainCount}*\n🥑 वीगन / अन्य: *${veganCount}*\n\n${specialDietNotes.length > 0 ? `⚠️ *विशेष आहार निर्देश:*\n${specialDietNotes.map((n) => `• ${n}`).join('\n')}\n\n` : ''}— HostMate Live RSVP Dispatch`
    : `🍽️ *Catering Headcount Summary — ${event.title}*\n📅 Date: ${event.date}\n👥 Total Confirmed Pax: *${totalConfirmedPax}*\n\n🥗 Pure Veg Meals: *${vegCount}*\n🍗 Non-Veg Meals: *${nonVegCount}*\n🌱 Jain Meals: *${jainCount}*\n🥑 Vegan / Allergy Diets: *${veganCount}*\n\n${specialDietNotes.length > 0 ? `⚠️ *Special Dietary Notes:*\n${specialDietNotes.map((n) => `• ${n}`).join('\n')}\n\n` : ''}— HostMate Live RSVP Dispatch`;

  const handleCopyCatererMsg = async () => {
    try {
      await navigator.clipboard.writeText(catererMsg);
      setCopiedCatererMsg(true);
      setTimeout(() => setCopiedCatererMsg(false), 2500);
    } catch {}
  };

  const handleAddManualRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const newRsvp: GuestRsvp = {
      id: `rsvp-${Date.now()}`,
      name: manualName.trim(),
      phone: manualPhone.trim() || undefined,
      attendance: manualAttendance,
      plusOnes: manualAttendance === 'yes' ? Number(manualPlusOnes) || 0 : 0,
      foodPreference: manualAttendance === 'yes' ? manualFood : 'veg',
      dietaryNotes: manualNotes.trim() || undefined,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onUpdateEvent({ ...event, rsvps: [newRsvp, ...event.rsvps] });
    setManualName('');
    setManualPhone('');
    setManualPlusOnes(0);
    setManualNotes('');
    setShowManualModal(false);
  };

  const handleDeleteRsvp = (id: string) => {
    const updated = event.rsvps.filter((r) => r.id !== id);
    onUpdateEvent({ ...event, rsvps: updated });
  };

  const filteredRsvps = event.rsvps.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.phone && r.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* WhatsApp Share & Unique Link Box (Emerald Accent #1B4332 + Champagne Gold) */}
      <div className="bg-[#1B4332] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#D4AF37]/30">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                {t.rsvp.uniqueLinkTitle}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">{t.rsvp.title}</h2>
            <p className="text-xs text-emerald-100/90 mt-1">{t.rsvp.uniqueLinkDesc}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2 bg-black/30 p-2 rounded-2xl backdrop-blur-sm border border-emerald-400/20">
              <input
                type="text"
                readOnly
                value={rsvpUrl}
                className="bg-transparent text-xs font-mono text-emerald-100 px-3 py-1 flex-1 min-w-[200px] outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#D4AF37] text-[#1A1D20] hover:bg-[#E5C768] rounded-xl shadow-xs transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-[#1A1D20]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? t.common.copied : t.rsvp.copyLink}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleLaunchWhatsAppInvite}
              className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold bg-[#25D366] hover:bg-[#20BD5A] text-slate-950 rounded-xl shadow-lg transition-all active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>{t.rsvp.shareWhatsApp}</span>
            </button>

            <button
              onClick={onPreviewPublicForm}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.rsvp.previewForm}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Caterer Live Headcount Summary Card */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFEAE1]">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-base font-bold text-[#1A1D20]">{t.rsvp.catererSummaryTitle}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'hi'
                ? 'केटरिंग वेंडर के साथ तुरंत व्हाट्सएप पर साझा करने के लिए तैयार सारांश'
                : 'Formatted specifically for instant WhatsApp sharing with catering chefs'}
            </p>
          </div>

          <button
            onClick={handleCopyCatererMsg}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#FAF8EE] hover:bg-[#F3EEDD] text-[#1A1D20] border border-[#E8DEBE] transition-colors self-start sm:self-auto shadow-2xs"
          >
            {copiedCatererMsg ? <Check className="w-3.5 h-3.5 text-[#1B4332]" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
            <span>{copiedCatererMsg ? t.common.copied : t.rsvp.copyCatererMessage}</span>
          </button>
        </div>

        {/* 5 Key Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-5">
          <div className="p-4 rounded-2xl bg-[#1A1D20] text-white border border-[#D4AF37]/30 col-span-2 sm:col-span-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider">
              {t.rsvp.totalConfirmed}
            </span>
            <div className="text-2xl font-black font-mono tabular-nums text-white mt-1">
              {totalConfirmedPax}
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">
              {totalAttendingAdults} {lang === 'hi' ? 'मुख्य' : 'hosts'} + {totalPlusOnes} plus
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EBF5F0] border border-[#CDE5D8]">
            <span className="text-[10px] font-bold uppercase text-[#1B4332] tracking-wider">
              {t.rsvp.vegCount}
            </span>
            <div className="text-2xl font-black font-mono tabular-nums text-[#1B4332] mt-1">
              {vegCount}
            </div>
            <div className="text-[10px] text-[#2D6A4F] font-medium">Pure Vegetarian</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF0E6] border border-[#EED7C5]">
            <span className="text-[10px] font-bold uppercase text-[#8B4513] tracking-wider">
              {t.rsvp.nonVegCount}
            </span>
            <div className="text-2xl font-black font-mono tabular-nums text-[#8B4513] mt-1">
              {nonVegCount}
            </div>
            <div className="text-[10px] text-[#8B4513]/80 font-medium">Non-Vegetarian</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4EFFB] border border-[#E3D6F5]">
            <span className="text-[10px] font-bold uppercase text-[#5E35B1] tracking-wider">
              {t.rsvp.jainCount}
            </span>
            <div className="text-2xl font-black font-mono tabular-nums text-[#5E35B1] mt-1">
              {jainCount}
            </div>
            <div className="text-[10px] text-[#5E35B1]/80 font-medium">No root veg/onion</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0]">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              {t.rsvp.declinedCount}
            </span>
            <div className="text-2xl font-black font-mono tabular-nums text-[#1A1D20] mt-1">
              {declinedGuests.length}
            </div>
            <div className="text-[10px] text-slate-400">Cannot attend</div>
          </div>
        </div>

        {/* Special Dietary Notes Callout */}
        {specialDietNotes.length > 0 && (
          <div className="mt-3.5 p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs">
            <div className="font-bold text-amber-900 mb-1">
              ⚠️ {lang === 'hi' ? 'विशेष खान-पान आवश्यकताएं:' : 'Special Dietary / Allergy Alerts:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {specialDietNotes.map((note, idx) => (
                <span key={idx} className="bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-800 font-medium text-[11px]">
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guest Response Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">{t.rsvp.guestListTitle}</h3>
            <span className="text-xs text-slate-500 font-mono">
              ({event.rsvps.length} {lang === 'hi' ? 'कुल प्रतिक्रियाएं' : 'responses'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.common.search}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
              />
            </div>

            <button
              onClick={() => setShowManualModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.rsvp.addGuestManual}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{t.rsvp.guestName}</th>
                <th className="py-3 px-3">{t.rsvp.attendance}</th>
                <th className="py-3 px-3">{t.rsvp.plusOnes}</th>
                <th className="py-3 px-3">{t.rsvp.foodPreference}</th>
                <th className="py-3 px-3">{t.rsvp.wishes}</th>
                <th className="py-3 px-3 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRsvps.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{rsvp.name}</div>
                    {rsvp.phone && (
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{rsvp.phone}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    {rsvp.attendance === 'yes' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t.rsvp.attending}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <XCircle className="w-3 h-3" />
                        <span>{t.rsvp.notAttending}</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 font-mono tabular-nums">
                    {rsvp.attendance === 'yes' ? `+${rsvp.plusOnes}` : '—'}
                  </td>

                  <td className="py-3.5 px-3">
                    {rsvp.attendance === 'yes' ? (
                      <div>
                        <span className="capitalize font-semibold text-slate-800">
                          {rsvp.foodPreference}
                        </span>
                        {rsvp.dietaryNotes && (
                          <div className="text-[10px] text-amber-700 mt-0.5">{rsvp.dietaryNotes}</div>
                        )}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 italic max-w-xs truncate">
                    {rsvp.wishes ? `"${rsvp.wishes}"` : '—'}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleDeleteRsvp(rsvp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Manual RSVP */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t.rsvp.addGuestManual}</h3>
            <p className="text-xs text-slate-500 mb-4">{t.rsvp.subtitle}</p>

            <form onSubmit={handleAddManualRsvp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.rsvp.guestName}
                </label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="+91 98..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attendance
                  </label>
                  <select
                    value={manualAttendance}
                    onChange={(e) => setManualAttendance(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="yes">{t.rsvp.attending}</option>
                    <option value="no">{t.rsvp.notAttending}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.rsvp.plusOnes}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={manualPlusOnes}
                    onChange={(e) => setManualPlusOnes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.rsvp.foodPreference}
                </label>
                <select
                  value={manualFood}
                  onChange={(e) => setManualFood(e.target.value as FoodPreference)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="veg">Pure Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="jain">Jain</option>
                  <option value="vegan">Vegan / Allergy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dietary / Special Notes
                </label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Diabetics / Jain elderly"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  {t.common.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
