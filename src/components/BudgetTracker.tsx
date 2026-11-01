import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Wallet,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { BudgetCategory, EventData, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { formatCurrency } from '../utils/storage';

interface BudgetTrackerProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
  onOpenAiBudgetModal: () => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  event,
  onUpdateEvent,
  lang,
  onOpenAiBudgetModal,
}) => {
  const t = TRANSLATIONS[lang];
  const currency = event.currency || '₹';

  // Calculate totals
  const totalBudget = Number(event.totalBudget) || 1;
  const totalEstimated = event.budgetItems.reduce((acc, curr) => acc + (Number(curr.estimatedCost) || 0), 0);
  const totalActual = event.budgetItems.reduce((acc, curr) => acc + (Number(curr.actualCost) || 0), 0);
  const totalAdvance = event.budgetItems.reduce((acc, curr) => acc + (Number(curr.advancePaid) || 0), 0);
  const totalBalanceDue = Math.max(0, totalActual - totalAdvance);

  const spentPercentage = Math.round((totalActual / totalBudget) * 100);

  // Status helper according to Section 5.3
  let statusText = lang === 'hi' ? 'बजट में (On Track)' : 'On Track';
  let statusBadgeClass = 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40';

  if (spentPercentage > 100) {
    statusText = lang === 'hi' ? `बजट से अधिक (${spentPercentage}%)` : `Over Budget (${spentPercentage}%)`;
    statusBadgeClass = 'bg-rose-900/60 text-rose-300 border-rose-500/40';
  } else if (spentPercentage >= 85) {
    statusText = lang === 'hi' ? `सीमा के निकट (${spentPercentage}%)` : `Approaching Limit (${spentPercentage}%)`;
    statusBadgeClass = 'bg-amber-900/60 text-amber-300 border-amber-500/40';
  }

  // Adding new item state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemEst, setNewItemEst] = useState('');
  const [newItemAct, setNewItemAct] = useState('');
  const [newItemAdv, setNewItemAdv] = useState('');
  const [newItemDue, setNewItemDue] = useState(event.date || '');
  const [newItemNotes, setNewItemNotes] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const est = Number(newItemEst) || 0;
    const act = Number(newItemAct) || est;
    const adv = Number(newItemAdv) || 0;

    const newItem: BudgetCategory = {
      id: `budget-${Date.now()}`,
      name: newItemName.trim(),
      nameHi: newItemName.trim(),
      recommendedPct: Math.round((est / totalBudget) * 100) || 5,
      estimatedCost: est,
      actualCost: act,
      advancePaid: adv,
      dueDate: newItemDue || event.date,
      notes: newItemNotes.trim(),
    };

    const updatedItems = [...event.budgetItems, newItem];
    onUpdateEvent({ ...event, budgetItems: updatedItems });

    setNewItemName('');
    setNewItemEst('');
    setNewItemAct('');
    setNewItemAdv('');
    setNewItemNotes('');
    setShowAddModal(false);
  };

  const handleUpdateItemField = (id: string, field: keyof BudgetCategory, val: any) => {
    const updated = event.budgetItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  const handleDeleteItem = (id: string) => {
    const updated = event.budgetItems.filter((i) => i.id !== id);
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  // Circular gauge math (180px gauge, r=70, circumference=439.82)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const safePct = Math.min(100, Math.max(0, spentPercentage));
  const strokeOffset = circumference - (safePct / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* 5.3 BUDGET VAULT: Dark Emerald Panel (#12392d to #0c2a21 gradient, 1px gold border, radius 28px) */}
      <div className="bg-gradient-to-br from-[#12392d] via-[#103429] to-[#0c2a21] text-white rounded-[28px] p-6 sm:p-8 shadow-xl border border-[#b78f3b]/60 relative overflow-hidden">
        {/* Subtle decorative gold ambient glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#b78f3b]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header Row of Vault */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd97d]">
                  {lang === 'hi' ? 'होस्टमेट वित्तीय वॉल्ट' : 'HostMate Budget Vault'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeClass}`}>
                  {statusText}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                {t.budget.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">{t.budget.subtitle}</p>
            </div>

            {/* Action buttons on Vault */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={onOpenAiBudgetModal}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#ffd97d] hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-all border border-[#ffd97d]/40 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#ffd97d]" />
                <span>{t.budget.getAiAdvice}</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#12100d] bg-[#ffd97d] hover:bg-[#ffe094] rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#12100d]" />
                <span>{t.budget.addItem}</span>
              </button>
            </div>
          </div>

          {/* Core Row: 180px Circular Gauge + 4 Financial KPI Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
            {/* 180px Circular Gauge (Col 1-4 on lg) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-xs">
              <div className="relative w-[180px] h-[180px] flex items-center justify-center">
                <svg className="w-[180px] h-[180px] -rotate-90 transform" viewBox="0 0 180 180">
                  {/* Background Track */}
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* Animated Gold Arc */}
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    stroke={spentPercentage > 100 ? '#f43f5e' : spentPercentage >= 85 ? '#f59e0b' : '#ffd97d'}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono tabular-nums text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {spentPercentage}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#ffd97d] tracking-wider mt-0.5">
                    {spentPercentage > 100 ? 'Over Limit' : 'Budget Used'}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono mt-0.5">
                    of {formatCurrency(totalBudget, currency)}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-center">
                <div className="text-xs font-semibold text-slate-200">
                  {lang === 'hi' ? 'कुल वास्तविक खर्च' : 'Total Committed Spend'}
                </div>
                <div className="text-sm font-mono font-bold text-[#ffd97d]">
                  {formatCurrency(totalActual, currency)}
                </div>
              </div>
            </div>

            {/* 4 KPI Cards (Col 5-12 on lg) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1: Total Budget */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ffd97d]/40 transition-colors">
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between">
                  <span>{t.budget.totalBudget}</span>
                  <Wallet className="w-4 h-4 text-[#ffd97d]" />
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1.5">
                  {formatCurrency(totalBudget, currency)}
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  {event.guestCount} {t.common.guests} · {currency}{Math.round(totalBudget / (event.guestCount || 1))}/guest
                </div>
              </div>

              {/* Card 2: Actual Spent */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ffd97d]/40 transition-colors">
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between">
                  <span>{t.budget.totalSpent}</span>
                  <TrendingUp className="w-4 h-4 text-[#ffd97d]" />
                </div>
                <div className={`text-2xl font-bold font-mono tabular-nums mt-1.5 ${spentPercentage > 100 ? 'text-rose-400' : 'text-white'}`}>
                  {formatCurrency(totalActual, currency)}
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Est: {formatCurrency(totalEstimated, currency)} ({Math.round((totalEstimated / totalBudget) * 100)}% est)
                </div>
              </div>

              {/* Card 3: Advance Deposits */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ffd97d]/40 transition-colors">
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between">
                  <span>{t.budget.totalAdvance}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-300 mt-1.5">
                  {formatCurrency(totalAdvance, currency)}
                </div>
                <div className="text-[11px] text-emerald-300/80 mt-1">
                  {totalActual > 0 ? `${Math.round((totalAdvance / totalActual) * 100)}% paid so far` : 'No payments yet'}
                </div>
              </div>

              {/* Card 4: Balance Remaining Due */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ffd97d]/40 transition-colors">
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between">
                  <span>{t.budget.balanceDue}</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-[#ffd97d] mt-1.5">
                  {formatCurrency(totalBalanceDue, currency)}
                </div>
                <div className="text-[11px] text-amber-300/80 mt-1">
                  {lang === 'hi' ? 'वेंडर्स को देय शेष राशि' : 'Outstanding vendor balances'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Split Info Tip */}
      <div className="text-xs text-[var(--ink)] bg-[var(--gold-light)] border border-[#b49a45]/30 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <span className="flex items-center gap-2">
          <span className="text-[#b49a45] font-bold text-base">✦</span>
          <span>{t.budget.autoPresetTip}</span>
        </span>
        <button
          onClick={() => {
            const updated = event.budgetItems.map((item) => {
              if (item.recommendedPct) {
                const rec = Math.round((totalBudget * item.recommendedPct) / 100);
                return { ...item, estimatedCost: rec };
              }
              return item;
            });
            onUpdateEvent({ ...event, budgetItems: updated });
          }}
          className="text-[#1c5340] hover:text-[#b49a45] font-bold underline shrink-0 cursor-pointer"
        >
          {lang === 'hi' ? 'बजट कैप्स पुनः लागू करें' : 'Re-apply Cap Splits'}
        </button>
      </div>

      {/* Itemized Category Breakdown & Payments Table */}
      <div className="bg-[var(--surface)] rounded-3xl border border-[var(--line)] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface-card)]">
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--ink)]">
              {lang === 'hi' ? 'श्रेणीवार बजट विभाजन व भुगतान' : 'Itemized Category Breakdown & Payments'}
            </h3>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              {lang === 'hi' ? 'प्रत्येक श्रेणी का अनुमानित, वास्तविक और दिया गया एडवांस' : 'Manage line-item caps, actual commitments, and balance settlement dates'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[var(--muted)] bg-[var(--bg-app)] px-2.5 py-1 rounded-lg border border-[var(--line)]">
            {event.budgetItems.length} {lang === 'hi' ? 'मदें' : 'categories'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-app)] border-b border-[var(--line)] text-[var(--muted)] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">{t.budget.category}</th>
                <th className="py-3.5 px-3 text-center">{t.budget.recommendedSplit}</th>
                <th className="py-3.5 px-3">{t.budget.estimatedCost}</th>
                <th className="py-3.5 px-3">{t.budget.actualCost}</th>
                <th className="py-3.5 px-3">{t.budget.advancePaid}</th>
                <th className="py-3.5 px-3">{t.budget.balanceRemaining}</th>
                <th className="py-3.5 px-3">{t.budget.balanceDueDate}</th>
                <th className="py-3.5 px-3 text-center">{t.common.status}</th>
                <th className="py-3.5 px-5 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {event.budgetItems.map((item) => {
                const remaining = Math.max(0, (Number(item.actualCost) || 0) - (Number(item.advancePaid) || 0));
                const itemPctOfBudget = Math.round(((Number(item.actualCost) || 0) / totalBudget) * 100);
                const isPaidFull = Number(item.actualCost) > 0 && remaining === 0;
                const isDepositPaid = Number(item.advancePaid) > 0 && remaining > 0;

                return (
                  <tr key={item.id} className="hover:bg-[var(--bg-app)]/50 transition-colors">
                    {/* Category Name */}
                    <td className="py-3.5 px-5 font-bold text-[var(--ink)] min-w-[170px]">
                      <div>{lang === 'hi' && item.nameHi ? item.nameHi : item.name}</div>
                      {item.notes && <div className="text-[11px] text-[var(--muted)] font-normal">{item.notes}</div>}
                    </td>

                    {/* Cap Split % */}
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-[var(--muted)] min-w-[80px]">
                      <span className="bg-[var(--bg-app)] border border-[var(--line)] px-2 py-0.5 rounded text-[11px] font-bold text-[var(--ink)]">
                        {item.recommendedPct ? `${item.recommendedPct}%` : `${itemPctOfBudget}%`}
                      </span>
                    </td>

                    {/* Estimated Cost */}
                    <td className="py-3.5 px-3 min-w-[120px]">
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--muted)] font-mono text-[11px]">{currency}</span>
                        <input
                          type="number"
                          value={item.estimatedCost || ''}
                          onChange={(e) => handleUpdateItemField(item.id, 'estimatedCost', Number(e.target.value))}
                          className="w-24 px-2 py-1 font-mono tabular-nums text-[var(--ink)] bg-[var(--surface)] border border-[var(--line)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b49a45]"
                        />
                      </div>
                    </td>

                    {/* Actual Cost */}
                    <td className="py-3.5 px-3 min-w-[120px]">
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--muted)] font-mono text-[11px]">{currency}</span>
                        <input
                          type="number"
                          value={item.actualCost || ''}
                          onChange={(e) => handleUpdateItemField(item.id, 'actualCost', Number(e.target.value))}
                          className="w-24 px-2 py-1 font-mono tabular-nums font-bold text-[var(--ink)] bg-[var(--surface)] border border-[var(--line)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b49a45]"
                        />
                      </div>
                    </td>

                    {/* Advance Paid */}
                    <td className="py-3.5 px-3 min-w-[120px]">
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--muted)] font-mono text-[11px]">{currency}</span>
                        <input
                          type="number"
                          value={item.advancePaid || ''}
                          onChange={(e) => handleUpdateItemField(item.id, 'advancePaid', Number(e.target.value))}
                          className="w-24 px-2 py-1 font-mono tabular-nums text-[#1c5340] font-semibold bg-[var(--surface)] border border-[var(--line)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1c5340]"
                        />
                      </div>
                    </td>

                    {/* Balance Left */}
                    <td className="py-3.5 px-3 font-mono tabular-nums font-bold min-w-[110px]">
                      {remaining === 0 ? (
                        <span className="text-[#1c5340] flex items-center gap-1 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1c5340]" />
                          <span>{lang === 'hi' ? 'पूर्ण' : 'Paid'}</span>
                        </span>
                      ) : (
                        <span className="text-[#b49a45]">{formatCurrency(remaining, currency)}</span>
                      )}
                    </td>

                    {/* Balance Due Date */}
                    <td className="py-3.5 px-3 min-w-[130px]">
                      <input
                        type="date"
                        value={item.dueDate || ''}
                        onChange={(e) => handleUpdateItemField(item.id, 'dueDate', e.target.value)}
                        className="px-2 py-1 text-[11px] font-mono text-[var(--ink)] border border-[var(--line)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[#b49a45]"
                      />
                    </td>

                    {/* Status Chip (Paid in Full vs Deposit Paid vs Pending) */}
                    <td className="py-3.5 px-3 text-center min-w-[110px]">
                      {isPaidFull ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1c5340]/15 text-[#1c5340] border border-[#1c5340]/30">
                          {lang === 'hi' ? 'पूर्ण भुगतान' : 'Paid in Full'}
                        </span>
                      ) : isDepositPaid ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b49a45]/20 text-[#8a7226] border border-[#b49a45]/40">
                          {lang === 'hi' ? 'एडवांस जमा' : 'Deposit Paid'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--bg-app)] text-[var(--muted)] border border-[var(--line)]">
                          {lang === 'hi' ? 'लंबित' : 'Pending'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-[var(--muted)] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] text-[var(--ink)] max-w-md w-full rounded-3xl border border-[var(--line)] p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold mb-4">
              {t.budget.addItem}
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">{t.budget.category}</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Traditional Band & Dhol Players"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[#b49a45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">{t.budget.estimatedCost} ({currency})</label>
                  <input
                    type="number"
                    value={newItemEst}
                    onChange={(e) => setNewItemEst(e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">{t.budget.actualCost} ({currency})</label>
                  <input
                    type="number"
                    value={newItemAct}
                    onChange={(e) => setNewItemAct(e.target.value)}
                    placeholder="45000"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">{t.budget.advancePaid} ({currency})</label>
                  <input
                    type="number"
                    value={newItemAdv}
                    onChange={(e) => setNewItemAdv(e.target.value)}
                    placeholder="15000"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">{t.budget.balanceDueDate}</label>
                  <input
                    type="date"
                    value={newItemDue}
                    onChange={(e) => setNewItemDue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">{t.common.notes}</label>
                <input
                  type="text"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="e.g. 50% advance given on booking receipt"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] font-semibold cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white font-bold transition-all shadow-sm cursor-pointer"
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
