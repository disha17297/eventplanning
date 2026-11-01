import React, { useState } from 'react';
import { 
  Heart, 
  Gift, 
  Send, 
  Check, 
  Plus, 
  Download, 
  FileText, 
  BookOpen, 
  Sparkles, 
  MessageCircle, 
  Trash2,
  Printer,
  Copy
} from 'lucide-react';
import { EventData, Language, GiftRecord } from '../types';
import { formatCurrency } from '../utils/storage';

interface MemoryShagunVaultProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
}

export const MemoryShagunVault: React.FC<MemoryShagunVaultProps> = ({
  event,
  onUpdateEvent,
  lang,
}) => {
  const isHi = lang === 'hi';
  const gifts = event.gifts || [];

  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false);
  const [selectedGiftForNote, setSelectedGiftForNote] = useState<GiftRecord | null>(null);
  const [copiedNote, setCopiedNote] = useState(false);

  // New Gift Form
  const [guestName, setGuestName] = useState('');
  const [giftType, setGiftType] = useState<'cash' | 'physical' | 'voucher' | 'blessing'>('cash');
  const [amount, setAmount] = useState<number>(5100);
  const [itemDescription, setItemDescription] = useState('Shagun Lifafa (Gold Envelope)');

  const totalCashCollected = gifts
    .filter((g) => g.type === 'cash' && g.amount)
    .reduce((acc, g) => acc + (g.amount || 0), 0);

  const thankYouSentCount = gifts.filter((g) => g.thankYouSent).length;

  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newGift: GiftRecord = {
      id: `gift-${Date.now()}`,
      guestName: guestName.trim(),
      type: giftType,
      amount: giftType === 'cash' ? Number(amount) : undefined,
      itemDescription: itemDescription.trim() || undefined,
      thankYouSent: false,
      thankYouMessage: `Dear ${guestName.trim()}, thank you so much for blessing our celebrations with your gracious presence and for your generous ${
        giftType === 'cash' ? `shagun of ${formatCurrency(amount, event.currency)}` : itemDescription.trim()
      }! Heartfelt gratitude from our family. 🙏❤️`,
      recordedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    const updated = [newGift, ...gifts];
    onUpdateEvent({ ...event, gifts: updated });
    setIsAddGiftOpen(false);
    setGuestName('');
    setItemDescription('Shagun Lifafa (Gold Envelope)');
    setAmount(5100);
  };

  const handleToggleThankYou = (giftId: string) => {
    const updated = gifts.map((g) => {
      if (g.id === giftId) {
        return { ...g, thankYouSent: !g.thankYouSent };
      }
      return g;
    });
    onUpdateEvent({ ...event, gifts: updated });
  };

  const handleDeleteGift = (giftId: string) => {
    const updated = gifts.filter((g) => g.id !== giftId);
    onUpdateEvent({ ...event, gifts: updated });
  };

  const handleSendWhatsAppThankYou = (gift: GiftRecord) => {
    const message = gift.thankYouMessage || `Dear ${gift.guestName}, thank you for your warm presence and thoughtful blessings at ${event.title}! 🙏`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    if (!gift.thankYouSent) {
      handleToggleThankYou(gift.id);
    }
  };

  const handleCopyNote = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2500);
  };

  const handleDownloadCapsule = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b49a45]/20 text-[#8a7226] flex items-center justify-center font-bold">
              <Gift className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--ink)]">
              {isHi ? 'डिजिटल मेमोरी वॉल्ट व शगुन / थैंक-यू असिस्टेंट' : 'Digital Memory Vault & Thank-You Assistant'}
            </h2>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            {isHi 
              ? 'आए हुए शगुन और उपहारों को दर्ज करें, 1-क्लिक व्यक्तिगत व्हाट्सएप धन्यवाद संदेश भेजें और डिजिटल मेमोरी बुक प्रिंट करें।' 
              : 'Track shagun cash & gifts, send personalized WhatsApp thank-you notes with one tap, and archive a permanent Digital Event Capsule.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddGiftOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#ffd97d]" />
            <span>{isHi ? '+ शगुन / उपहार दर्ज करें' : '+ Record Shagun / Gift'}</span>
          </button>

          <button
            onClick={handleDownloadCapsule}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] shadow-2xs cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#b49a45]" />
            <span>{isHi ? 'मेमोरी बुक डाउनलोड करें' : 'Export Memory Capsule'}</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'कुल शगुन नकद राशि' : 'Total Cash Shagun'}
          </div>
          <div className="text-xl font-mono font-bold text-[#1c5340] mt-1">
            {formatCurrency(totalCashCollected, event.currency)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'कुल उपहार प्रविष्टियां' : 'Total Gifts Recorded'}
          </div>
          <div className="text-xl font-mono font-bold text-[var(--ink)] mt-1">{gifts.length}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'धन्यवाद संदेश भेजे गए' : 'Thank-You Sent'}
          </div>
          <div className="text-xl font-mono font-bold text-[#8a7226] mt-1">
            {thankYouSentCount} / {gifts.length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'बाकी धन्यवाद' : 'Pending Thank-Yous'}
          </div>
          <div className="text-xl font-mono font-bold text-rose-600 mt-1">
            {gifts.length - thankYouSentCount}
          </div>
        </div>
      </div>

      {/* Shagun & Gift Registry Table */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            {isHi ? 'शगुन व उपहार रजिस्टर' : 'Shagun & Gift Registry'}
          </span>
          <span className="text-xs text-[var(--muted)] font-mono">
            {gifts.length} {isHi ? 'रिकॉर्ड्स' : 'entries'}
          </span>
        </div>

        <div className="space-y-3">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[#b49a45]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-[var(--ink)] truncate">{gift.guestName}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1c5340]/10 text-[#1c5340]">
                    {gift.type}
                  </span>
                </div>

                <div className="text-xs text-[var(--muted)] mt-1 flex items-center gap-2 flex-wrap">
                  {gift.amount && (
                    <strong className="font-mono text-[#1c5340]">
                      {formatCurrency(gift.amount, event.currency)}
                    </strong>
                  )}
                  {gift.itemDescription && <span>• {gift.itemDescription}</span>}
                  <span>• {gift.recordedAt}</span>
                </div>
              </div>

              {/* Actions: Send WhatsApp, Toggle Sent, Delete */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSendWhatsAppThankYou(gift)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xs cursor-pointer transition-colors"
                  title="Send Personalized WhatsApp Thank-You Note"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent" />
                  <span>{isHi ? 'धन्यवाद भेजें' : 'Send WhatsApp Thank-You'}</span>
                </button>

                <button
                  onClick={() => handleToggleThankYou(gift.id)}
                  className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    gift.thankYouSent
                      ? 'bg-[#1c5340]/10 text-[#1c5340] border-[#1c5340]/30'
                      : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                  title={gift.thankYouSent ? 'Marked as Sent' : 'Mark as Sent'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteGift(gift.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Digital Event Capsule Preview */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#b49a45]" />
            <h3 className="font-serif font-bold text-base text-[var(--ink)]">
              {isHi ? 'डिजिटल मेमोरी कैप्सूल बुक' : 'Archived Digital Event Capsule'}
            </h3>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg-app)] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#b49a45]" />
            <span>{isHi ? 'प्रिंट करें' : 'Print Book'}</span>
          </button>
        </div>

        <div className="p-5 rounded-xl bg-[var(--bg-app)] border border-[var(--line)] text-xs space-y-3 font-serif">
          <div className="text-center pb-3 border-b border-[var(--line)]">
            <h2 className="text-xl font-bold text-[var(--ink)]">{event.title}</h2>
            <p className="text-[11px] text-[var(--muted)] font-sans mt-0.5">
              Celebrated on {event.date} • {event.guestCount} Guests Hosted
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-sans text-xs">
            <div>
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase">Total Budget Settled</div>
              <div className="font-mono font-bold text-[var(--ink)] mt-0.5">
                {formatCurrency(event.totalBudget, event.currency)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase">Confirmed RSVPs</div>
              <div className="font-mono font-bold text-[var(--ink)] mt-0.5">
                {event.rsvps.filter((r) => r.attendance === 'yes').length} Guests
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase">Shagun Registry Total</div>
              <div className="font-mono font-bold text-[#1c5340] mt-0.5">
                {formatCurrency(totalCashCollected, event.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Gift Modal */}
      {isAddGiftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-serif font-bold text-[var(--ink)] pb-2 border-b border-[var(--line)]">
              {isHi ? 'शगुन या उपहार दर्ज करें' : 'Record Shagun / Gift'}
            </h3>

            <form onSubmit={handleAddGift} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'मेहमान का नाम' : 'Guest / Family Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gupta Family"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'उपहार प्रकार' : 'Gift Type'}
                  </label>
                  <select
                    value={giftType}
                    onChange={(e) => setGiftType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  >
                    <option value="cash">{isHi ? 'नकद शगुन (Cash Shagun)' : 'Cash Shagun'}</option>
                    <option value="physical">{isHi ? 'भौतिक उपहार (Physical Gift)' : 'Physical Gift'}</option>
                    <option value="voucher">{isHi ? 'गिफ्ट वाउचर (Voucher)' : 'Gift Voucher'}</option>
                    <option value="blessing">{isHi ? 'शुभकामनाएं (Blessings)' : 'Blessings Only'}</option>
                  </select>
                </div>

                {giftType === 'cash' && (
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                      {isHi ? 'राशि' : 'Shagun Amount'} ({event.currency})
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="100"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'विवरण' : 'Description / Lifafa Details'}
                </label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="e.g. Gold Shagun Lifafa with 1 Re coin"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsAddGiftOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#1c5340] text-white hover:bg-[#164233] cursor-pointer shadow-xs"
                >
                  {isHi ? 'सहेजें' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
