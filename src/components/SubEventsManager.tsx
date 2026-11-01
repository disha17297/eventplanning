import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Check, 
  X, 
  Shirt, 
  Wallet,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { EventData, Language, SubEvent, GuestRsvp } from '../types';
import { formatCurrency } from '../utils/storage';

interface SubEventsManagerProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
}

export const SubEventsManager: React.FC<SubEventsManagerProps> = ({
  event,
  onUpdateEvent,
  lang,
}) => {
  const isHi = lang === 'hi';
  const subEvents = event.subEvents || [];
  const rsvps = event.rsvps || [];

  const [selectedSubEventId, setSelectedSubEventId] = useState<string>(subEvents[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubEvent, setEditingSubEvent] = useState<SubEvent | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [date, setDate] = useState(event.date || '');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('02:00 PM');
  const [venue, setVenue] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [allocatedBudget, setAllocatedBudget] = useState<number>(100000);
  const [description, setDescription] = useState('');

  const activeSubEvent = subEvents.find((s) => s.id === selectedSubEventId) || subEvents[0] || null;

  const handleOpenAddModal = () => {
    setEditingSubEvent(null);
    setName('');
    setNameHi('');
    setDate(event.date || '');
    setStartTime('10:00 AM');
    setEndTime('02:00 PM');
    setVenue('');
    setDressCode('');
    setAllocatedBudget(150000);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sub: SubEvent) => {
    setEditingSubEvent(sub);
    setName(sub.name);
    setNameHi(sub.nameHi || '');
    setDate(sub.date);
    setStartTime(sub.startTime);
    setEndTime(sub.endTime);
    setVenue(sub.venue);
    setDressCode(sub.dressCode || '');
    setAllocatedBudget(sub.allocatedBudget || 0);
    setDescription(sub.description || '');
    setIsModalOpen(true);
  };

  const handleSaveSubEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubEvent) {
      const updatedList = subEvents.map((s) => {
        if (s.id === editingSubEvent.id) {
          return {
            ...s,
            name: name.trim(),
            nameHi: nameHi.trim() || undefined,
            date,
            startTime,
            endTime,
            venue: venue.trim(),
            dressCode: dressCode.trim() || undefined,
            allocatedBudget: Number(allocatedBudget),
            description: description.trim() || undefined,
          };
        }
        return s;
      });
      onUpdateEvent({ ...event, subEvents: updatedList });
    } else {
      const newSub: SubEvent = {
        id: `sub-${Date.now()}`,
        name: name.trim(),
        nameHi: nameHi.trim() || undefined,
        date,
        startTime,
        endTime,
        venue: venue.trim() || 'Main Banquet Hall',
        dressCode: dressCode.trim() || undefined,
        allocatedBudget: Number(allocatedBudget),
        invitedGuestIds: rsvps.map((r) => r.id), // By default invite all guests
        description: description.trim() || undefined,
      };
      const updatedList = [...subEvents, newSub];
      onUpdateEvent({ ...event, subEvents: updatedList });
      setSelectedSubEventId(newSub.id);
    }

    setIsModalOpen(false);
  };

  const handleDeleteSubEvent = (subId: string) => {
    if (window.confirm(isHi ? 'क्या आप इस उप-कार्यक्रम को हटाना चाहते हैं?' : 'Delete this sub-event?')) {
      const updatedList = subEvents.filter((s) => s.id !== subId);
      onUpdateEvent({ ...event, subEvents: updatedList });
      if (selectedSubEventId === subId) {
        setSelectedSubEventId(updatedList[0]?.id || '');
      }
    }
  };

  // Toggle guest access to a specific sub-event
  const handleToggleGuestInvitation = (subId: string, guestId: string) => {
    const updatedList = subEvents.map((s) => {
      if (s.id === subId) {
        const isInvited = s.invitedGuestIds.includes(guestId);
        const newIds = isInvited
          ? s.invitedGuestIds.filter((id) => id !== guestId)
          : [...s.invitedGuestIds, guestId];
        return { ...s, invitedGuestIds: newIds };
      }
      return s;
    });

    onUpdateEvent({ ...event, subEvents: updatedList });
  };

  // Bulk invite / remove all for active sub event
  const handleSelectAllGuests = (subId: string, inviteAll: boolean) => {
    const updatedList = subEvents.map((s) => {
      if (s.id === subId) {
        return {
          ...s,
          invitedGuestIds: inviteAll ? rsvps.map((r) => r.id) : [],
        };
      }
      return s;
    });
    onUpdateEvent({ ...event, subEvents: updatedList });
  };

  const totalSubEventsBudget = subEvents.reduce((acc, s) => acc + (s.allocatedBudget || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b49a45]/15 text-[#8a7226] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--ink)]">
              {isHi ? 'बहु-दिवसीय कार्यक्रम व लक्षित आमंत्रण' : 'Multi-Event & Sub-Schedule Hub'}
            </h2>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            {isHi 
              ? 'हल्दी, संगीत, विवाह व रिसेप्शन जैसे अलग-अलग उत्सवों के अलग बजट व विशिष्ट मेहमानों की सूची बनाएं।' 
              : 'Manage sub-events (Haldi, Sangeet, Wedding, Reception) with dedicated dress codes, budgets, and targeted guest invitations.'}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#1c5340] hover:bg-[#164233] text-white shadow-xs cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-[#ffd97d]" />
          <span>{isHi ? '+ नया उप-कार्यक्रम जोड़ें' : '+ Add Sub-Event'}</span>
        </button>
      </div>

      {/* Sub-Events Horizontal Timeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subEvents.map((sub, idx) => {
          const isSelected = sub.id === activeSubEvent?.id;
          const invitedCount = sub.invitedGuestIds.length;

          return (
            <div
              key={sub.id}
              onClick={() => setSelectedSubEventId(sub.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#b49a45] bg-[var(--gold-light)]/40 shadow-sm ring-2 ring-[#b49a45]/30'
                  : 'border-[var(--line)] bg-[var(--surface)] hover:border-[#b49a45]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1c5340]/10 text-[#1c5340]">
                    {isHi ? `उत्सव ${idx + 1}` : `Event ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(sub);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-[var(--ink)] cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubEvent(sub.id);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-rose-600 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-base text-[var(--ink)] mt-2">
                  {isHi && sub.nameHi ? sub.nameHi : sub.name}
                </h3>

                <div className="space-y-1.5 text-xs text-[var(--muted)] mt-2.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#b49a45]" />
                    <span>{sub.date} • {sub.startTime} - {sub.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#b49a45] shrink-0" />
                    <span className="truncate">{sub.venue}</span>
                  </div>
                  {sub.dressCode && (
                    <div className="flex items-center gap-1.5">
                      <Shirt className="w-3.5 h-3.5 text-[#1c5340]" />
                      <span className="text-[11px] font-medium text-[var(--ink)] truncate">{sub.dressCode}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-mono font-bold text-[#1c5340]">
                  <Users className="w-3.5 h-3.5" />
                  {invitedCount} {isHi ? 'मेहमान' : 'invited'}
                </span>
                <span className="font-mono text-[var(--muted)]">
                  {formatCurrency(sub.allocatedBudget, event.currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Targeted RSVP Invitations Matrix for the selected sub-event */}
      {activeSubEvent && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  {isHi ? 'लक्षित आमंत्रण सूची (Targeted Invites)' : 'Targeted RSVP Guest List'}
                </span>
                <span className="text-xs font-serif font-bold text-[#b49a45]">
                  • {isHi && activeSubEvent.nameHi ? activeSubEvent.nameHi : activeSubEvent.name}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {isHi 
                  ? 'चुनें कि कौन से मेहमान इस विशेष उप-कार्यक्रम में आमंत्रित हैं (जैसे केवल परिवार संगीत में, सभी रिसेप्शन में)।'
                  : 'Select which specific guests receive an RSVP invite to this sub-event.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectAllGuests(activeSubEvent.id, true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-app)] hover:bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] cursor-pointer"
              >
                {isHi ? 'सभी को आमंत्रित करें' : 'Invite All'}
              </button>
              <button
                onClick={() => handleSelectAllGuests(activeSubEvent.id, false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-app)] hover:bg-[var(--surface)] text-rose-600 border border-[var(--line)] cursor-pointer"
              >
                {isHi ? 'सभी हटाएं' : 'Clear All'}
              </button>
            </div>
          </div>

          {/* Guest Checkbox Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rsvps.map((guest) => {
              const isInvited = activeSubEvent.invitedGuestIds.includes(guest.id);

              return (
                <div
                  key={guest.id}
                  onClick={() => handleToggleGuestInvitation(activeSubEvent.id, guest.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isInvited
                      ? 'border-[#1c5340] bg-[#1c5340]/5 dark:bg-[#1c5340]/15'
                      : 'border-[var(--line)] bg-[var(--surface)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--ink)] truncate">{guest.name}</div>
                    <div className="text-[10px] text-[var(--muted)] mt-0.5 capitalize">
                      {guest.foodPreference} • {guest.attendance === 'yes' ? 'Confirmed' : guest.attendance}
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isInvited ? 'bg-[#1c5340] text-white' : 'border border-[var(--line)] text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <h3 className="text-lg font-serif font-bold text-[var(--ink)]">
                {editingSubEvent 
                  ? (isHi ? 'उप-कार्यक्रम संपादित करें' : 'Edit Sub-Event') 
                  : (isHi ? 'नया उप-कार्यक्रम जोड़ें' : 'Create Sub-Event')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'कार्यक्रम का नाम (English)' : 'Event Name (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sangeet & Cocktail"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'कार्यक्रम का नाम (हिन्दी)' : 'Event Name (Hindi)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. संगीत व कॉकटेल"
                    value={nameHi}
                    onChange={(e) => setNameHi(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'दिनांक' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'शुरू समय' : 'Start Time'}
                  </label>
                  <input
                    type="text"
                    placeholder="07:00 PM"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'समाप्ति समय' : 'End Time'}
                  </label>
                  <input
                    type="text"
                    placeholder="11:30 PM"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'स्थान / हॉल' : 'Venue / Hall'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crystal Ballroom"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                    {isHi ? 'ड्रेस कोड' : 'Dress Code'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Traditional Festive / Indo-Western"
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'आवंटित बजट' : 'Allocated Budget'} ({event.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={allocatedBudget}
                  onChange={(e) => setAllocatedBudget(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  {isHi ? 'विवरण व मुख्य आकर्षण' : 'Highlights & Notes'}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. DJ dance battle, LED stage, chaat and drinks counter..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#1c5340] text-white hover:bg-[#164233] cursor-pointer shadow-xs"
                >
                  {isHi ? 'सहेजें' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
