import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Move, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Crown, 
  Utensils, 
  Printer, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { EventData, Language, TablePlan, TableShape, GuestRsvp, FoodPreference } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SeatingPlannerProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
}

export const SeatingPlanner: React.FC<SeatingPlannerProps> = ({
  event,
  onUpdateEvent,
  lang,
}) => {
  const isHi = lang === 'hi';
  const tables = event.tables || [];
  const rsvps = event.rsvps.filter((r) => r.attendance === 'yes');

  const [selectedTableId, setSelectedTableId] = useState<string | null>(tables[0]?.id || null);
  const [searchGuest, setSearchGuest] = useState('');
  const [filterDiet, setFilterDiet] = useState<'all' | FoodPreference>('all');
  const [isAddingTable, setIsAddingTable] = useState(false);

  // New table form
  const [newTableName, setNewTableName] = useState('');
  const [newTableShape, setNewTableShape] = useState<TableShape>('round');
  const [newTableCapacity, setNewTableCapacity] = useState<number>(8);
  const [newTableCategory, setNewTableCategory] = useState<'family' | 'friends' | 'vip' | 'colleagues' | 'kids'>('family');

  // Track assigned guests across all tables
  const allAssignedGuestIds = new Set<string>();
  tables.forEach((t) => {
    t.assignedGuestIds.forEach((id) => allAssignedGuestIds.add(id));
  });

  // Unassigned confirmed guests
  const unassignedGuests = rsvps.filter((g) => !allAssignedGuestIds.has(g.id));

  // Filtered unassigned guests
  const filteredUnassigned = unassignedGuests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(searchGuest.toLowerCase());
    const matchDiet = filterDiet === 'all' || g.foodPreference === filterDiet;
    return matchSearch && matchDiet;
  });

  const selectedTable = tables.find((t) => t.id === selectedTableId) || null;

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    const newTable: TablePlan = {
      id: `tbl-${Date.now()}`,
      name: newTableName.trim(),
      shape: newTableShape,
      capacity: Number(newTableCapacity),
      x: 100 + (tables.length % 3) * 160,
      y: 100 + Math.floor(tables.length / 3) * 140,
      assignedGuestIds: [],
      category: newTableCategory,
    };

    const updatedTables = [...tables, newTable];
    onUpdateEvent({ ...event, tables: updatedTables });
    setSelectedTableId(newTable.id);
    setIsAddingTable(false);
    setNewTableName('');
  };

  const handleDeleteTable = (tableId: string) => {
    const updatedTables = tables.filter((t) => t.id !== tableId);
    onUpdateEvent({ ...event, tables: updatedTables });
    if (selectedTableId === tableId) {
      setSelectedTableId(updatedTables[0]?.id || null);
    }
  };

  const handleAssignGuest = (guestId: string, tableId: string) => {
    const targetTable = tables.find((t) => t.id === tableId);
    if (!targetTable) return;
    if (targetTable.assignedGuestIds.length >= targetTable.capacity) {
      return;
    }

    const updatedTables = tables.map((t) => {
      // Remove from any previous table if already there
      const filtered = t.assignedGuestIds.filter((id) => id !== guestId);
      if (t.id === tableId) {
        return { ...t, assignedGuestIds: [...filtered, guestId] };
      }
      return { ...t, assignedGuestIds: filtered };
    });

    onUpdateEvent({ ...event, tables: updatedTables });
  };

  const handleUnassignGuest = (guestId: string, tableId: string) => {
    const updatedTables = tables.map((t) => {
      if (t.id === tableId) {
        return {
          ...t,
          assignedGuestIds: t.assignedGuestIds.filter((id) => id !== guestId),
        };
      }
      return t;
    });

    onUpdateEvent({ ...event, tables: updatedTables });
  };

  const getDietBadge = (pref: FoodPreference) => {
    switch (pref) {
      case 'veg':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#1c5340]/10 text-[#1c5340] border border-[#1c5340]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1c5340]" />
            Veg
          </span>
        );
      case 'jain':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#b49a45]/15 text-[#8a7226] border border-[#b49a45]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b49a45]" />
            Jain
          </span>
        );
      case 'non-veg':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Non-Veg
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-[var(--muted)]">
            {pref}
          </span>
        );
    }
  };

  // Stats
  const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);
  const totalSeated = allAssignedGuestIds.size;
  const confirmedCount = rsvps.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1c5340]/10 text-[#1c5340] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--ink)]">
              {isHi ? 'इंटरैक्टिव सिटिंग व टेबल प्लानर' : 'Interactive Seating & Table Planner'}
            </h2>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            {isHi 
              ? 'टेबल मैप करें, क्षमता तय करें और मेहमानों को वेज/जैन डाइट टैग के साथ व्यवस्थित करें।' 
              : 'Map tables (Round, Rectangular, Head), seat confirmed guests, and balance Veg/Jain requirements.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddingTable(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#ffd97d]" />
            <span>{isHi ? '+ नई टेबल जोड़ें' : '+ Add Table'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#b49a45]" />
            <span>{isHi ? 'चार्ट प्रिंट करें' : 'Print Layout'}</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'कुल टेबल्स' : 'Total Tables'}
          </div>
          <div className="text-xl font-mono font-bold text-[var(--ink)] mt-1">{tables.length}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'सिटिंग क्षमता' : 'Total Capacity'}
          </div>
          <div className="text-xl font-mono font-bold text-[var(--ink)] mt-1">{totalCapacity} {isHi ? 'सीटें' : 'seats'}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'आवंटित मेहमान' : 'Assigned Guests'}
          </div>
          <div className="text-xl font-mono font-bold text-[#1c5340] mt-1">{totalSeated} / {confirmedCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
            {isHi ? 'बाकी बिना सीट' : 'Unassigned'}
          </div>
          <div className="text-xl font-mono font-bold text-[#8a7226] mt-1">{unassignedGuests.length}</div>
        </div>
      </div>

      {/* Main Layout: 2D Canvas on Left, Side Guest Drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas & Table Cards (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {isHi ? '2D फ्लोर लेआउट व टेबल व्यू' : '2D Floor Layout & Table Canvas'}
              </span>
              <span className="text-xs text-[#b49a45] flex items-center gap-1 font-medium">
                <Crown className="w-3.5 h-3.5" />
                {isHi ? 'टेबल पर क्लिक करके मेहमान बैठाएं' : 'Click table to manage seats'}
              </span>
            </div>

            {/* Visual Floor Grid */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {tables.map((tbl) => {
                const isSelected = tbl.id === selectedTableId;
                const isFull = tbl.assignedGuestIds.length >= tbl.capacity;
                const tableGuests = rsvps.filter((g) => tbl.assignedGuestIds.includes(g.id));

                return (
                  <div
                    key={tbl.id}
                    onClick={() => setSelectedTableId(tbl.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#b49a45] bg-[var(--gold-light)]/40 shadow-sm ring-2 ring-[#b49a45]/30'
                        : 'border-[var(--line)] bg-[var(--surface)] hover:border-[#b49a45]/50'
                    }`}
                  >
                    {/* Table Shape Graphical Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            tbl.shape === 'round'
                              ? 'rounded-full bg-[#1c5340]/10 text-[#1c5340] border border-[#1c5340]/20'
                              : tbl.shape === 'head'
                              ? 'bg-[#b49a45]/20 text-[#8a7226] border border-[#b49a45]/40'
                              : 'rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[var(--ink)]'
                          }`}
                        >
                          {tbl.shape === 'round' ? '⭕' : tbl.shape === 'head' ? '👑' : '▭'}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[var(--ink)]">{tbl.name}</h4>
                          <span className="text-[10px] font-semibold text-[var(--muted)] capitalize">
                            {tbl.category || 'Standard'} • {tbl.shape}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                            isFull
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                              : 'bg-[#1c5340]/10 text-[#1c5340]'
                          }`}
                        >
                          {tbl.assignedGuestIds.length} / {tbl.capacity}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(isHi ? 'क्या आप इस टेबल को हटाना चाहते हैं?' : 'Remove this table?')) {
                              handleDeleteTable(tbl.id);
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-600 transition-colors"
                          title="Delete Table"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Visual Seat Dots */}
                    <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                      {Array.from({ length: tbl.capacity }).map((_, idx) => {
                        const guest = tableGuests[idx];
                        return (
                          <div
                            key={idx}
                            title={guest ? `${guest.name} (${guest.foodPreference})` : 'Empty Seat'}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                              guest
                                ? guest.foodPreference === 'veg'
                                  ? 'bg-[#1c5340] text-white border-[#1c5340]'
                                  : guest.foodPreference === 'jain'
                                  ? 'bg-[#b49a45] text-white border-[#b49a45]'
                                  : 'bg-rose-600 text-white border-rose-600'
                                : 'bg-[var(--bg-app)] border-dashed border-[var(--line)] text-[var(--muted)]'
                            }`}
                          >
                            {guest ? guest.name.charAt(0).toUpperCase() : idx + 1}
                          </div>
                        );
                      })}
                    </div>

                    {/* Assigned Guest Chips */}
                    {tableGuests.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[var(--line)] space-y-1">
                        {tableGuests.map((g) => (
                          <div
                            key={g.id}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-[var(--bg-app)] text-[var(--ink)]"
                          >
                            <span className="truncate max-w-[140px] font-medium">{g.name}</span>
                            <div className="flex items-center gap-1.5">
                              {getDietBadge(g.foodPreference)}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnassignGuest(g.id, tbl.id);
                                }}
                                className="text-zinc-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                                title="Unseat guest"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Panel: Unassigned Guests Drawer & Seating Controls */}
        <div className="space-y-4">
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[var(--ink)]">
                {isHi ? 'सीट के लिए उपलब्ध मेहमान' : 'Unassigned Confirmed Guests'}
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#8a7226]/10 text-[#8a7226]">
                {filteredUnassigned.length}
              </span>
            </div>

            {selectedTable && (
              <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[#b49a45]/30 text-xs">
                <span className="text-[var(--muted)]">{isHi ? 'चुनी हुई टेबल:' : 'Selected Table:'} </span>
                <strong className="text-[var(--ink)] font-serif">{selectedTable.name}</strong>{' '}
                <span className="font-mono text-[#1c5340]">
                  ({selectedTable.capacity - selectedTable.assignedGuestIds.length} {isHi ? 'सीटें खाली' : 'seats left'})
                </span>
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--muted)]" />
              <input
                type="text"
                placeholder={isHi ? 'मेहमान का नाम खोजें...' : 'Search guest...'}
                value={searchGuest}
                onChange={(e) => setSearchGuest(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-hidden focus:border-[#b49a45]"
              />
            </div>

            {/* Dietary Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'veg', 'jain', 'non-veg'] as const).map((diet) => (
                <button
                  key={diet}
                  onClick={() => setFilterDiet(diet)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                    filterDiet === diet
                      ? 'bg-[#1c5340] text-white'
                      : 'bg-[var(--bg-app)] text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line)]'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>

            {/* Guest List Items */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredUnassigned.length === 0 ? (
                <div className="text-center py-8 text-xs text-[var(--muted)]">
                  {unassignedGuests.length === 0
                    ? isHi ? '🎉 सभी मेहमानों को सीट मिल चुकी है!' : '🎉 All confirmed guests are seated!'
                    : isHi ? 'कोई मेहमान नहीं मिला' : 'No matching guests found'}
                </div>
              ) : (
                filteredUnassigned.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[#b49a45] transition-all flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[var(--ink)] truncate">{guest.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getDietBadge(guest.foodPreference)}
                        {guest.plusOnes > 0 && (
                          <span className="text-[10px] text-[var(--muted)] font-mono">
                            +{guest.plusOnes} {isHi ? 'अतिरिक्त' : 'plus'}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      disabled={!selectedTable || selectedTable.assignedGuestIds.length >= selectedTable.capacity}
                      onClick={() => selectedTable && handleAssignGuest(guest.id, selectedTable.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1c5340] hover:bg-[#164233] text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
                      title={selectedTable ? `Seat at ${selectedTable.name}` : 'Select a table first'}
                    >
                      {isHi ? 'बैठाएं' : 'Seat'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Table Modal */}
      {isAddingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <h3 className="text-lg font-serif font-bold text-[var(--ink)]">
                {isHi ? 'नई टेबल जोड़ें' : 'Add New Table'}
              </h3>
              <button
                onClick={() => setIsAddingTable(false)}
                className="text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'टेबल का नाम / लेबल' : 'Table Name / Label'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 5: Bride's School Friends"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-hidden focus:border-[#b49a45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'आकार' : 'Table Shape'}
                  </label>
                  <select
                    value={newTableShape}
                    onChange={(e) => setNewTableShape(e.target.value as TableShape)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  >
                    <option value="round">{isHi ? 'गोल (Round)' : 'Round'}</option>
                    <option value="rectangular">{isHi ? 'आयताकार (Rectangular)' : 'Rectangular'}</option>
                    <option value="head">{isHi ? 'हेड टेबल (VIP Head)' : 'Head Table'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'सीट क्षमता' : 'Capacity (Seats)'}
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'श्रेणी' : 'Category'}
                </label>
                <select
                  value={newTableCategory}
                  onChange={(e) => setNewTableCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                >
                  <option value="family">{isHi ? 'परिवार (Family)' : 'Family'}</option>
                  <option value="friends">{isHi ? 'दोस्त (Friends)' : 'Friends'}</option>
                  <option value="vip">{isHi ? 'वीआईपी (VIP)' : 'VIP / Elders'}</option>
                  <option value="colleagues">{isHi ? 'सहकर्मी (Colleagues)' : 'Colleagues'}</option>
                  <option value="kids">{isHi ? 'बच्चे (Kids Table)' : 'Kids'}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsAddingTable(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#1c5340] text-white hover:bg-[#164233] cursor-pointer shadow-xs"
                >
                  {isHi ? 'टेबल सहेजें' : 'Save Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
