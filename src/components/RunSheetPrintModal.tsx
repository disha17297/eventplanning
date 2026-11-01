import React from 'react';
import { X, Printer, Copy, Check, Clock, Calendar, Users, Sparkles } from 'lucide-react';
import { EventData, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RunSheetPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
  lang: Language;
}

export const RunSheetPrintModal: React.FC<RunSheetPrintModalProps> = ({
  isOpen,
  onClose,
  event,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsAppText = () => {
    const isHi = lang === 'hi';
    let text = `📋 *${event.title} — ${isHi ? 'आधिकारिक कार्यक्रम दिवस रन शीट' : 'Official Day-Of Run Sheet'}*\n`;
    text += `📅 ${isHi ? 'दिनांक' : 'Date'}: ${event.date} | 👥 ${isHi ? 'मेहमान' : 'Guests'}: ${event.guestCount}\n`;
    text += `--------------------------------------\n\n`;

    event.runSheet.forEach((item) => {
      text += `⏱️ *${item.time}* - ${isHi && item.activityHi ? item.activityHi : item.activity}\n`;
      text += `   👤 ${isHi ? 'प्रभारी' : 'Lead'}: ${item.leadPerson}${item.notes ? ` (${item.notes})` : ''}\n\n`;
    });

    text += `✨ *HostMate* — ${isHi ? 'बजट सही, इवेंट हिट!' : 'Budget fit, event hit!'}`;
    return text;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateWhatsAppText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1D20]/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative flex flex-col max-h-[90vh]">
        {/* Modal Controls (No print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                {lang === 'hi' ? 'आधिकारिक रन शीट' : 'Official Run Sheet Exporter'}
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1A1D20]">
              {lang === 'hi' ? 'डे-ऑफ रन शीट (प्रिंट व शेयर)' : 'Day-Of Run Sheet (Print & Export)'}
            </h3>
            <p className="text-xs text-[#1A1D20]/65 mt-0.5">
              {lang === 'hi' ? 'क्लीन PDF प्रिंट या व्हाट्सएप सूची के रूप में कॉपी करें' : 'Clean printable sheet or one-click WhatsApp text format'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#FAF8F5] text-[#1A1D20] transition-colors shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1B4332]" /> : <Copy className="w-3.5 h-3.5 text-[#1A1D20]/70" />}
              <span>{copied ? t.common.copied : t.tasks.copyTextList}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#1A1D20] hover:bg-[#1A1D20]/90 text-white shadow-xs border border-[#D4AF37]/40 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.tasks.printRunSheet}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#1A1D20]/50 hover:text-[#1A1D20] rounded-lg hover:bg-black/5 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Run Sheet Canvas */}
        <div className="overflow-y-auto flex-1 py-4 pr-1">
          <div className="border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 bg-white shadow-xs print:border-none print:shadow-none print:p-0">
            {/* Run Sheet Header */}
            <div className="border-b-2 border-[#1A1D20] pb-5 mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1">
                    HostMate · Official Event Run Sheet
                  </div>
                  <h1 className="text-2xl font-serif font-bold text-[#1A1D20]">{event.title}</h1>
                </div>
                <div className="text-right text-xs text-[#1A1D20]/70">
                  <div className="font-semibold text-[#1A1D20] flex items-center justify-end gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {event.date}
                  </div>
                  <div className="text-[#1A1D20]/60 mt-1 font-mono">
                    {event.guestCount} {t.common.guests} · {event.type.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Run Sheet Schedule Items */}
            <div className="space-y-3">
              {event.runSheet.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3.5 transition-colors ${
                    item.isCritical 
                      ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10' 
                      : 'border-[#E2E8F0] bg-[#FAF8F5]'
                  }`}
                >
                  <div className="font-mono tabular-nums text-xs font-bold text-[#1A1D20] bg-white px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] shrink-0 shadow-xs">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-[#1A1D20]">
                        {lang === 'hi' && item.activityHi ? item.activityHi : item.activity}
                      </div>
                      {item.isCritical && (
                        <span className="text-[10px] uppercase font-bold text-[#8F741C] bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2 py-0.5 rounded-full">
                          {lang === 'hi' ? 'महत्वपूर्ण' : 'Critical'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#1A1D20]/65 mt-1 flex items-center gap-2">
                      <span>
                        <strong className="text-[#1A1D20]">{lang === 'hi' ? 'प्रभारी' : 'Lead'}:</strong> {item.leadPerson}
                      </span>
                      {item.notes && (
                        <>
                          <span className="text-[#E2E8F0]">•</span>
                          <span className="text-[#1A1D20]/50 italic">{item.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#1A1D20]/60">
              <span className="font-serif">
                HostMate · "{lang === 'hi' ? 'बजट सही, इवेंट हिट!' : 'Budget fit, event hit!'}"
              </span>
              <span>Generated for on-ground coordination team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
