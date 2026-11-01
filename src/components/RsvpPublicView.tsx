import React, { useState } from 'react';
import { CheckCircle2, Heart, Calendar, Users, Utensils, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { EventData, FoodPreference, GuestRsvp, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RsvpPublicViewProps {
  event: EventData;
  lang: Language;
  onAddRsvp: (rsvp: GuestRsvp) => void;
  onBackToDashboard?: () => void;
  isStandalone?: boolean;
}

export const RsvpPublicView: React.FC<RsvpPublicViewProps> = ({
  event,
  lang,
  onAddRsvp,
  onBackToDashboard,
  isStandalone = false,
}) => {
  const t = TRANSLATIONS[lang];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes');
  const [plusOnes, setPlusOnes] = useState(0);
  const [foodPreference, setFoodPreference] = useState<FoodPreference>('veg');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [wishes, setWishes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRsvp: GuestRsvp = {
      id: `rsvp-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || undefined,
      attendance,
      plusOnes: attendance === 'yes' ? Number(plusOnes) || 0 : 0,
      foodPreference: attendance === 'yes' ? foodPreference : 'veg',
      dietaryNotes: dietaryNotes.trim() || undefined,
      wishes: wishes.trim() || undefined,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onAddRsvp(newRsvp);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-landing)] text-[var(--ink)] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      {onBackToDashboard && (
        <div className="w-full max-w-lg mb-4">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 text-xs font-bold text-[var(--ink)] hover:text-[#b49a45] transition-colors bg-[var(--surface)] px-3 py-1.5 rounded-xl border border-[var(--line)] shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#b49a45]" />
            <span>{lang === 'hi' ? '← आयोजक डैशबोर्ड पर वापस जाएं' : '← Back to Organizer Dashboard'}</span>
          </button>
        </div>
      )}

      <div className="bg-[var(--surface)] text-[var(--ink)] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-[var(--line)] relative">
        {/* Event Invitation Banner */}
        <div className="text-center pb-6 border-b border-[#EFEAE1]">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1A1D20] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-sm mb-3.5">
            <Heart className="w-7 h-7 fill-[#D4AF37]/20" />
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#9A813A] mb-1">
            {lang === 'hi' ? 'सादर आमंत्रण' : 'Cordial Invitation'}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1D20] tracking-tight">
            {event.title}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs text-slate-500 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {event.date}
            </span>
            <span>·</span>
            <span className="capitalize">{event.type}</span>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-[#EBF5F0] text-[#1B4332] rounded-full flex items-center justify-center mx-auto shadow-2xs border border-[#CDE5D8]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1A1D20]">
              {attendance === 'yes'
                ? lang === 'hi'
                  ? 'आपकी उपस्थिति दर्ज हो गई है!'
                  : 'RSVP Confirmed!'
                : lang === 'hi'
                ? 'आपकी प्रतिक्रिया सहेजी गई'
                : 'Response Recorded'}
            </h2>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              {attendance === 'yes'
                ? lang === 'hi'
                  ? `धन्यवाद ${name}! हम उत्सव में आपका स्वागत करने के लिए उत्सुक हैं।`
                  : `Thank you, ${name}! We look forward to celebrating together.`
                : lang === 'hi'
                ? `धन्यवाद ${name}! आपकी शुभकामनाओं के लिए आभार।`
                : `Thank you, ${name}! Your warm wishes have been shared with the host.`}
            </p>

            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setPhone('');
                  setPlusOnes(0);
                  setWishes('');
                  setDietaryNotes('');
                }}
                className="text-xs font-bold text-[#1A1D20] hover:text-[#9A813A] underline"
              >
                {lang === 'hi' ? 'दूसरा RSVP फॉर्म भरें' : 'Submit another response'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Guest Name */}
            <div>
              <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                {t.rsvp.guestName} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                {lang === 'hi' ? 'व्हाट्सएप / मोबाइल नंबर' : 'Phone / WhatsApp'} ({t.common.optional})
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
              />
            </div>

            {/* Attendance Choice with Specification Document Question */}
            <div>
              <label className="block text-xs font-bold text-[#1A1D20] mb-2">
                {lang === 'hi' ? 'क्या आप शामिल होंगे? (Will you be attending?)' : 'Will you be attending?'} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance('yes')}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    attendance === 'yes'
                      ? 'border-[#1B4332] bg-[#EBF5F0] text-[#1B4332] shadow-sm ring-1 ring-[#1B4332]'
                      : 'border-[#E2E8F0] text-slate-600 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
                  <span>{t.rsvp.attending}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance('no')}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    attendance === 'no'
                      ? 'border-[#1A1D20] bg-[#1A1D20] text-white shadow-sm'
                      : 'border-[#E2E8F0] text-slate-600 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>{t.rsvp.notAttending}</span>
                </button>
              </div>
            </div>

            {attendance === 'yes' && (
              <>
                {/* Plus-Ones */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5 flex items-center justify-between">
                    <span>{t.rsvp.plusOnes} ({lang === 'hi' ? 'साथ आने वाले अन्य व्यक्ति' : 'Additional companions'})</span>
                    <span className="font-mono text-[#D4AF37] font-bold text-sm">+{plusOnes}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPlusOnes(num)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                          plusOnes === num
                            ? 'border-[#1A1D20] bg-[#1A1D20] text-[#D4AF37]'
                            : 'border-[#E2E8F0] bg-[#FAF8F5] text-slate-600 hover:bg-white'
                        }`}
                      >
                        +{num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Preference (Veg / Non-Veg / Jain / Vegan) */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{lang === 'hi' ? 'भोजन वरीयता (शाकाहारी / मांसाहारी):' : 'Food Preference (Veg / Non-Veg):'}</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'veg' as FoodPreference, labelEn: 'Pure Veg', labelHi: 'शाकाहारी' },
                      { id: 'non-veg' as FoodPreference, labelEn: 'Non-Veg', labelHi: 'मांसाहारी' },
                      { id: 'jain' as FoodPreference, labelEn: 'Jain Meal', labelHi: 'जैन भोजन' },
                      { id: 'vegan' as FoodPreference, labelEn: 'Vegan / Allergy', labelHi: 'वीगन' },
                    ].map((food) => (
                      <button
                        key={food.id}
                        type="button"
                        onClick={() => setFoodPreference(food.id)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                          foodPreference === food.id
                            ? 'border-[#D4AF37] bg-[#1A1D20] text-[#D4AF37] shadow-sm'
                            : 'border-[#E2E8F0] bg-[#FAF8F5] text-slate-700 hover:bg-white'
                        }`}
                      >
                        {lang === 'hi' ? food.labelHi : food.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary notes */}
                <div>
                  <input
                    type="text"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    placeholder={
                      lang === 'hi'
                        ? 'विशिष्ट खाद्य एलर्जी या परहेज (वैकल्पिक)'
                        : 'Specific allergy or dietary notes (e.g., peanut allergy, gluten-free)'
                    }
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                  />
                </div>
              </>
            )}

            {/* Warm Wishes */}
            <div>
              <label className="block text-xs font-bold text-[#1A1D20] mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.rsvp.wishes} ({t.common.optional})</span>
              </label>
              <textarea
                rows={2}
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'मेजबान परिवार के लिए शुभकामना संदेश...'
                    : 'A sweet wish or note for the host...'
                }
                className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#1A1D20] hover:bg-[#2A2F35] active:bg-black shadow-md border border-[#D4AF37]/40 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Send className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'hi' ? 'RSVP सबमिट करें' : 'Submit RSVP Response'}</span>
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#EFEAE1] text-center text-[10px] text-slate-400">
          Powered by HostMate · "Budget fit, event hit!"
        </div>
      </div>
    </div>
  );
};
