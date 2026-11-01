import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  FileText, 
  Upload, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ExternalLink,
  Eye,
  FileCheck,
  Building,
  Utensils,
  Camera,
  Music,
  Palette,
  Sparkle,
  Truck,
  Cake,
  Mic,
  Briefcase,
  X,
  Download
} from 'lucide-react';
import { EventData, Language, Vendor, VendorCategory, VendorDocument } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { formatCurrency } from '../utils/storage';

interface VendorHubProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
  onReviewVendorAi: (vendor: Vendor) => void;
}

export const VendorHub: React.FC<VendorHubProps> = ({
  event,
  onUpdateEvent,
  lang,
  onReviewVendorAi,
}) => {
  const t = TRANSLATIONS[lang];
  const currency = event.currency || '₹';

  // Add vendor modal state
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('catering');
  const [phone, setPhone] = useState('');
  const [agreedPrice, setAgreedPrice] = useState('');
  const [advancePaid, setAdvancePaid] = useState('');
  const [dueDate, setDueDate] = useState(event.date || '');
  const [deliverables, setDeliverables] = useState('');
  const [notes, setNotes] = useState('');

  // Document preview lightbox
  const [previewDoc, setPreviewDoc] = useState<VendorDocument | null>(null);

  // Upcoming payment reminders check
  const today = new Date();
  const upcomingReminders = event.vendors
    .map((v) => {
      const balance = Math.max(0, (v.agreedPrice || 0) - (v.advancePaid || 0));
      if (balance <= 0 || !v.balanceDueDate) return null;
      const due = new Date(v.balanceDueDate);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        vendor: v,
        balance,
        diffDays,
        isOverdue: diffDays < 0,
        isDueSoon: diffDays >= 0 && diffDays <= 7,
      };
    })
    .filter(Boolean) as {
      vendor: Vendor;
      balance: number;
      diffDays: number;
      isOverdue: boolean;
      isDueSoon: boolean;
    }[];

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const price = Number(agreedPrice) || 0;
    const advance = Number(advancePaid) || 0;

    const newVendor: Vendor = {
      id: `vendor-${Date.now()}`,
      name: name.trim(),
      category,
      phone: phone.trim(),
      agreedPrice: price,
      advancePaid: advance,
      balanceDueDate: dueDate || event.date,
      status: 'booked',
      deliverables: deliverables.trim() || undefined,
      notes: notes.trim() || undefined,
      documents: [],
    };

    onUpdateEvent({ ...event, vendors: [...event.vendors, newVendor] });

    setName('');
    setPhone('');
    setAgreedPrice('');
    setAdvancePaid('');
    setDeliverables('');
    setNotes('');
    setShowAddVendor(false);
  };

  const handleDeleteVendor = (id: string) => {
    const updated = event.vendors.filter((v) => v.id !== id);
    onUpdateEvent({ ...event, vendors: updated });
  };

  const handleMarkPaid = (id: string) => {
    const updated = event.vendors.map((v) => {
      if (v.id === id) {
        return { ...v, advancePaid: v.agreedPrice, status: 'completed' as const };
      }
      return v;
    });
    onUpdateEvent({ ...event, vendors: updated });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, vendorId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      const isPdf = file.type.includes('pdf');
      const isImg = file.type.includes('image');

      const doc: VendorDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        fileType: isPdf ? 'pdf' : isImg ? 'image' : 'doc',
        dataUrl,
        uploadDate: new Date().toISOString().substring(0, 10),
        sizeKb: Math.round(file.size / 1024),
      };

      const updated = event.vendors.map((v) => {
        if (v.id === vendorId) {
          return { ...v, documents: [...(v.documents || []), doc] };
        }
        return v;
      });

      onUpdateEvent({ ...event, vendors: updated });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDoc = (vendorId: string, docId: string) => {
    const updated = event.vendors.map((v) => {
      if (v.id === vendorId) {
        return { ...v, documents: v.documents.filter((d) => d.id !== docId) };
      }
      return v;
    });
    onUpdateEvent({ ...event, vendors: updated });
  };

  const getCategoryIcon = (cat: VendorCategory) => {
    switch (cat) {
      case 'venue': return Building;
      case 'catering': return Utensils;
      case 'decor': return Palette;
      case 'photography': return Camera;
      case 'music': return Music;
      case 'makeup': return Sparkle;
      case 'transport': return Truck;
      case 'cake': return Cake;
      case 'anchor': return Mic;
      default: return Briefcase;
    }
  };

  return (
    <div className="space-y-6">
      {/* Concierge Header & Payment Reminders Ribbon */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                {lang === 'hi' ? 'विक्रेता निर्देशिका' : 'Concierge Directory'}
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1A1D20]">{t.vendors.title}</h2>
            <p className="text-xs text-[#1A1D20]/65 mt-0.5">{t.vendors.subtitle}</p>
          </div>

          <button
            onClick={() => setShowAddVendor(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1A1D20] hover:bg-[#1A1D20]/90 rounded-xl transition-all shadow-sm border border-[#1A1D20] hover:border-[#D4AF37] self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.vendors.addVendor}</span>
          </button>
        </div>

        {/* Auto Payment Alerts Ribbon */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
          <div className="text-xs font-bold text-[#1A1D20] flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.vendors.upcomingReminders}</span>
            {upcomingReminders.length > 0 && (
              <span className="bg-[#D4AF37]/15 text-[#8F741C] border border-[#D4AF37]/30 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                {upcomingReminders.length}
              </span>
            )}
          </div>

          {upcomingReminders.length === 0 ? (
            <div className="text-xs text-[#1A1D20]/60 bg-white/70 p-3 rounded-xl border border-[#E2E8F0] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
              <span>{t.vendors.noReminders}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingReminders.map(({ vendor, balance, diffDays, isOverdue }) => (
                <div
                  key={vendor.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                    isOverdue
                      ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                      : 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#1A1D20]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold truncate text-sm">{vendor.name}</div>
                    <div className="text-[11px] font-mono tabular-nums mt-0.5">
                      {formatCurrency(balance, currency)} {lang === 'hi' ? 'बकाया' : 'due'}{' '}
                      <span className="font-bold underline decoration-[#D4AF37]">
                        {isOverdue ? t.vendors.overdue : `${t.vendors.dueInDays} ${diffDays} ${t.vendors.days}`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMarkPaid(vendor.id)}
                    className="px-2.5 py-1 text-[11px] font-bold bg-white text-[#1A1D20] hover:bg-[#FAF8F5] rounded-lg shadow-xs border border-[#E2E8F0] shrink-0 cursor-pointer"
                  >
                    {t.vendors.markPaid}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3-Column Grid Card Portfolio View (as specified in Design Doc Section 4.5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {event.vendors.map((vendor) => {
          const Icon = getCategoryIcon(vendor.category);
          const balance = Math.max(0, (vendor.agreedPrice || 0) - (vendor.advancePaid || 0));
          const isPaid = balance === 0;

          return (
            <div
              key={vendor.id}
              className="bg-[#FAF8F5] rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A1D20] text-[#D4AF37] flex items-center justify-center shrink-0 border border-[#D4AF37]/30 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1A1D20] leading-tight">
                        {vendor.name}
                      </h4>
                      <span className="text-[11px] font-medium text-[#1A1D20]/60 capitalize tracking-wide">
                        {vendor.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onReviewVendorAi(vendor)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#8F741C] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 rounded-lg transition-colors border border-[#D4AF37]/40 cursor-pointer"
                      title="AI Quote & Contract Review"
                    >
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>{lang === 'hi' ? 'एआई समीक्षा' : 'AI Review'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="p-1 text-[#1A1D20]/40 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Agreed Pricing Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3.5 border-b border-[#E2E8F0] text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#1A1D20]/60 block font-semibold">
                      {t.vendors.agreedPrice}
                    </span>
                    <strong className="font-mono tabular-nums text-[#1A1D20] text-sm mt-0.5 block">
                      {formatCurrency(vendor.agreedPrice, currency)}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#1A1D20]/60 block font-semibold">
                      {t.vendors.advancePaid}
                    </span>
                    <span className="font-mono tabular-nums text-[#1B4332] font-bold text-sm mt-0.5 block">
                      {formatCurrency(vendor.advancePaid, currency)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#1A1D20]/60 block font-semibold">
                      {t.vendors.balanceDue}
                    </span>
                    {isPaid ? (
                      <span className="text-[#1B4332] font-bold text-xs flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332]" />
                        <span>Paid</span>
                      </span>
                    ) : (
                      <span className="font-mono tabular-nums text-[#8F741C] font-bold text-sm mt-0.5 block">
                        {formatCurrency(balance, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Deliverables / Scope */}
                {vendor.deliverables && (
                  <div className="py-2.5 text-xs text-[#1A1D20]/75 border-b border-[#E2E8F0]">
                    <strong className="text-[#1A1D20] block text-[10px] uppercase tracking-wider mb-0.5 font-semibold">
                      {lang === 'hi' ? 'डिलीवरेबल्स / दायरा:' : 'Deliverables:'}
                    </strong>
                    <p className="line-clamp-2 text-xs leading-relaxed">{vendor.deliverables}</p>
                  </div>
                )}

                {/* Attached Documents / Quotes */}
                <div className="py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1D20]/70 flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-[#D4AF37]" />
                      <span>{t.vendors.documents} ({vendor.documents?.length || 0})</span>
                    </span>

                    <label className="text-[11px] font-semibold text-[#8F741C] hover:text-[#1A1D20] cursor-pointer flex items-center gap-1 transition-colors">
                      <Upload className="w-3 h-3 text-[#D4AF37]" />
                      <span>{t.vendors.uploadDoc}</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, vendor.id)}
                      />
                    </label>
                  </div>

                  {vendor.documents && vendor.documents.length > 0 ? (
                    <div className="space-y-1.5">
                      {vendor.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E2E8F0] text-xs hover:border-[#D4AF37]/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCheck className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
                            <span className="truncate font-medium text-[#1A1D20]">{doc.name}</span>
                            {doc.sizeKb && (
                              <span className="text-[10px] text-[#1A1D20]/50 font-mono">({doc.sizeKb} KB)</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="text-[#1A1D20]/60 hover:text-[#D4AF37] p-1 rounded transition-colors cursor-pointer"
                              title="Preview Document Lightbox"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoc(vendor.id, doc.id)}
                              className="text-[#1A1D20]/40 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#1A1D20]/50 italic bg-white/50 p-2 rounded-lg border border-dashed border-[#E2E8F0]">
                      {lang === 'hi' ? 'कोई कोटेशन अटैच नहीं है (PDF/फ़ोटो अपलोड करें)' : 'No quote PDF attached (Upload quote/contract)'}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Footer: Phone & WhatsApp Direct Links */}
              <div className="pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                <div className="text-xs text-[#1A1D20]/65 font-mono">
                  {vendor.balanceDueDate ? (
                    <span>Due: {vendor.balanceDueDate}</span>
                  ) : (
                    <span>No due date</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {vendor.phone && (
                    <>
                      <a
                        href={`tel:${vendor.phone}`}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-[#1A1D20] border border-[#E2E8F0] transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[#1A1D20]/70" />
                        <span>{t.vendors.call}</span>
                      </a>

                      <a
                        href={`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1B4332] hover:bg-[#1B4332]/90 text-white transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3 h-3 text-[#D4AF37]" />
                        <span>{t.vendors.chatWhatsApp}</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Vendor */}
      {showAddVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1D20]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1A1D20]">{t.vendors.addVendor}</h3>
                <p className="text-xs text-[#1A1D20]/60 mt-0.5">{t.vendors.subtitle}</p>
              </div>
              <button
                onClick={() => setShowAddVendor(false)}
                className="p-1 text-[#1A1D20]/50 hover:text-[#1A1D20] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1D20] mb-1">
                  {t.vendors.vendorName}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Caterers / ShutterBug Studios"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white text-[#1A1D20] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1D20] mb-1">
                    {t.vendors.category}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VendorCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white text-[#1A1D20] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="catering">Catering & Food</option>
                    <option value="venue">Venue & Hall</option>
                    <option value="decor">Decor & Flowers</option>
                    <option value="photography">Photography & Video</option>
                    <option value="music">DJ & Sound</option>
                    <option value="makeup">Makeup & Styling</option>
                    <option value="cake">Cake & Baker</option>
                    <option value="transport">Transport</option>
                    <option value="anchor">Anchor / Emcee</option>
                    <option value="other">Other Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1D20] mb-1">
                    {t.vendors.phone}
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white text-[#1A1D20] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1D20] mb-1">
                    {t.vendors.agreedPrice} ({currency})
                  </label>
                  <input
                    type="number"
                    required
                    value={agreedPrice}
                    onChange={(e) => setAgreedPrice(e.target.value)}
                    placeholder="75000"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E2E8F0] bg-white text-[#1A1D20] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1D20] mb-1">
                    {t.vendors.advancePaid} ({currency})
                  </label>
                  <input
                    type="number"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                    placeholder="30000"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E2E8F0] bg-white text-[#1A1D20] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1D20] mb-1">
                  {t.vendors.dueDate}
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E2E8F0] bg-white text-[#1A1D20] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1D20] mb-1">
                  Scope / Deliverables
                </label>
                <textarea
                  rows={2}
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="e.g. 4 live food stations, dinner for 200 guests, crew food included"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white text-[#1A1D20] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVendor(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#1A1D20]/70 hover:text-[#1A1D20] rounded-lg cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1A1D20] hover:bg-[#1A1D20]/90 rounded-xl shadow-xs border border-[#D4AF37]/40 cursor-pointer"
                >
                  {t.common.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Document Preview Lightbox (Design Doc Section 4.5) */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1D20]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#1A1D20] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h4 className="font-serif font-bold text-sm text-[#1A1D20] truncate">{previewDoc.name}</h4>
                  <span className="text-[10px] text-[#1A1D20]/60 uppercase tracking-wider font-mono">
                    {previewDoc.fileType} · {previewDoc.sizeKb} KB · Uploaded {previewDoc.uploadDate}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setPreviewDoc(null)}
                className="text-[#1A1D20]/50 hover:text-[#1A1D20] p-1.5 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-center min-h-[220px]">
              {previewDoc.fileType === 'image' ? (
                <img
                  src={previewDoc.dataUrl}
                  alt={previewDoc.name}
                  className="max-h-[360px] object-contain rounded-lg shadow-xs"
                />
              ) : (
                <div className="text-center space-y-3 py-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 text-[#8F741C] border border-[#D4AF37]/30 flex items-center justify-center mx-auto">
                    <FileCheck className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-sm font-serif font-bold text-[#1A1D20]">{previewDoc.name}</div>
                    <div className="text-xs text-[#1A1D20]/60 mt-0.5">PDF Contract & Quote Document</div>
                  </div>
                  <a
                    href={previewDoc.dataUrl}
                    download={previewDoc.name}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1A1D20] text-white rounded-xl shadow-xs hover:bg-[#1A1D20]/90 transition-colors border border-[#D4AF37]/40 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Download Document</span>
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-[#1A1D20] bg-white hover:bg-slate-100 rounded-xl border border-[#E2E8F0] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
