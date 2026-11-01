import React, { useState } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Crown, 
  DollarSign, 
  Percent, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Sparkles,
  Phone,
  Mail,
  Palette,
  ExternalLink
} from 'lucide-react';
import { EventData, Language, ProAgencySettings, PromotedVendor } from '../types';
import { formatCurrency } from '../utils/storage';

interface ProAgencyHubProps {
  event: EventData;
  allEvents: EventData[];
  onSelectEvent: (id: string) => void;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
}

export const ProAgencyHub: React.FC<ProAgencyHubProps> = ({
  event,
  allEvents,
  onSelectEvent,
  onUpdateEvent,
  lang,
}) => {
  const isHi = lang === 'hi';
  const proSettings = event.proSettings || {
    isProEnabled: true,
    agencyName: 'Aura Event Architects',
    plannerName: 'Pooja Verma',
    agencyLogo: '',
    primaryColor: '#1c5340',
    contactEmail: 'pooja@auraevents.in',
    contactPhone: '+91 98111 22334',
    activeClientCount: 9,
    managedBudgetTotal: 18500000,
    customWatermark: false,
  };

  const promotedVendors = event.promotedVendors || [];

  const [agencyName, setAgencyName] = useState(proSettings.agencyName);
  const [plannerName, setPlannerName] = useState(proSettings.plannerName);
  const [isWhiteLabelActive, setIsWhiteLabelActive] = useState(proSettings.isProEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ProAgencySettings = {
      ...proSettings,
      agencyName,
      plannerName,
      isProEnabled: isWhiteLabelActive,
    };
    onUpdateEvent({ ...event, proSettings: updated });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Commission Metrics
  const totalEarnedCommission = promotedVendors.reduce((acc, v) => acc + v.earnedCommission, 0);
  const totalBookedLeads = promotedVendors.reduce((acc, v) => acc + v.bookedLeadsCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b49a45]/20 text-[#8a7226] flex items-center justify-center font-bold">
              <Crown className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--ink)]">
              {isHi ? 'होस्टमेट प्रो व वेंडर कमीशन हब' : 'HostMate Pro & Vendor Monetization Hub'}
            </h2>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            {isHi 
              ? 'पेशेवर इवेंट प्लानर्स के लिए व्हाइट-लेबल ब्रांडिंग, 10+ मल्टी-क्लाइंट प्रबंधन और वेंडर कमीशन ट्रैकिंग।' 
              : 'SaaS for professional wedding planners: White-label agency branding, multi-client workspace, and booked vendor commission pipelines.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#1c5340]/10 text-[#1c5340] border border-[#1c5340]/30 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HostMate Pro Agency Edition</span>
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'प्रबंधित क्लाइंट्स' : 'Managed Clients'}
          </div>
          <div className="text-xl font-mono font-bold text-[var(--ink)] mt-1">
            {proSettings.activeClientCount} {isHi ? 'इवेंट्स' : 'Events'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'प्रबंधित कुल बजट' : 'Managed Portfolios'}
          </div>
          <div className="text-xl font-mono font-bold text-[var(--ink)] mt-1">
            {formatCurrency(proSettings.managedBudgetTotal, event.currency)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'कुल अर्जित कमीशन' : 'Earned Commission'}
          </div>
          <div className="text-xl font-mono font-bold text-[#1c5340] mt-1">
            {formatCurrency(totalEarnedCommission, event.currency)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'सफल वेंडर लीड्स' : 'Booked Vendor Leads'}
          </div>
          <div className="text-xl font-mono font-bold text-[#8a7226] mt-1">
            {totalBookedLeads} {isHi ? 'लीड्स' : 'Bookings'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Agency White-Label Customization */}
        <div className="lg:col-span-5 bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[var(--line)] flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#b49a45]" />
              <span>{isHi ? 'एजेंसी व्हाइट-लेबल ब्रांडिंग' : 'White-Label Agency Branding'}</span>
            </h3>
            {savedSuccess && (
              <span className="text-xs text-[#1c5340] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveBranding} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                {isHi ? 'एजेंसी / कंपनी का नाम' : 'Agency / Firm Name'}
              </label>
              <input
                type="text"
                required
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                {isHi ? 'लीड प्लानर का नाम' : 'Lead Event Architect'}
              </label>
              <input
                type="text"
                required
                value={plannerName}
                onChange={(e) => setPlannerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[var(--ink)]">
                    {isHi ? 'होस्टमेट वाटरमार्क हटाएं' : 'Remove HostMate Watermark'}
                  </div>
                  <div className="text-[10px] text-[var(--muted)]">
                    {isHi ? 'क्लाइंट पोर्टल्स पर केवल आपकी एजेंसी दिखेगी' : 'Display exclusively your agency branding on client portals'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isWhiteLabelActive}
                  onChange={(e) => setIsWhiteLabelActive(e.target.checked)}
                  className="w-4 h-4 text-[#1c5340] rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
            >
              {isHi ? 'ब्रांडिंग सहेजें' : 'Save White-Label Branding'}
            </button>
          </form>

          {/* Managed Client Events Switcher */}
          <div className="pt-4 border-t border-[var(--line)] space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {isHi ? 'सक्रिय क्लाइंट इवेंट्स (10+ समर्थन)' : 'Concurrent Client Workspaces'}
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    ev.id === event.id
                      ? 'border-[#b49a45] bg-[var(--gold-light)]/40 font-bold'
                      : 'border-[var(--line)] bg-[var(--surface)] hover:border-[#b49a45]/50'
                  }`}
                >
                  <div className="truncate min-w-0 pr-2">
                    <div className="truncate text-[var(--ink)]">{ev.title}</div>
                    <div className="text-[10px] text-[var(--muted)] font-normal">{ev.date} • {ev.guestCount} guests</div>
                  </div>
                  <span className="font-mono text-[11px] text-[#1c5340] shrink-0">
                    {formatCurrency(ev.totalBudget, ev.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Promoted Vendor Directory & Referral Commissions */}
        <div className="lg:col-span-7 bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[var(--line)] flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#1c5340]" />
                <span>{isHi ? 'प्रमोटेड वेंडर्स व कमीशन पाइपलाइन' : 'Promoted Vendors & Commission Tracker'}</span>
              </h3>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {isHi ? 'बुक की गई वेंडर लीड्स पर 5-8% रेफरल कमीशन अर्जित करें' : 'Earn 5-8% referral commission on client bookings with verified partners'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {promotedVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[#b49a45]/50 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-[var(--ink)]">{vendor.name}</h4>
                      {vendor.isFeatured && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#b49a45]/20 text-[#8a7226]">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{vendor.tagline}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-[#1c5340] bg-[#1c5340]/10 px-2.5 py-1 rounded-lg">
                      {vendor.commissionRatePct}% Comm.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--line)] text-xs">
                  <div>
                    <div className="text-[10px] text-[var(--muted)] uppercase font-semibold">City</div>
                    <div className="font-medium text-[var(--ink)] truncate">{vendor.city}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--muted)] uppercase font-semibold">Booked Leads</div>
                    <div className="font-mono font-bold text-[var(--ink)]">{vendor.bookedLeadsCount} deals</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--muted)] uppercase font-semibold">Earned Payout</div>
                    <div className="font-mono font-bold text-[#1c5340]">
                      {formatCurrency(vendor.earnedCommission, event.currency)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
