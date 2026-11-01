import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles, 
  Printer, 
  Calendar,
  AlertCircle,
  User,
  ListTodo,
  Timer
} from 'lucide-react';
import { ChecklistTask, EventData, Language, RunSheetItem, TaskPhase } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { RunSheetPrintModal } from './RunSheetPrintModal';

interface MilestoneTimelineProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  event,
  onUpdateEvent,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeSubTab, setActiveSubTab] = useState<'checklist' | 'runSheet'>('checklist');

  // Print modal state
  const [showPrintModal, setShowPrintModal] = useState(false);

  // New task form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPhase, setTaskPhase] = useState<TaskPhase>('early');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(event.date || '');

  // New schedule item state
  const [showAddRun, setShowAddRun] = useState(false);
  const [runTime, setRunTime] = useState('10:00 AM');
  const [runActivity, setRunActivity] = useState('');
  const [runLead, setRunLead] = useState('Coordinator');
  const [runNotes, setRunNotes] = useState('');
  const [runCritical, setRunCritical] = useState(false);

  // AI loading state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Stats
  const totalTasks = event.tasks.length;
  const completedTasks = event.tasks.filter((t) => t.completed).length;
  const taskProgressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = (taskId: string) => {
    const updated = event.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    onUpdateEvent({ ...event, tasks: updated });
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = event.tasks.filter((t) => t.id !== taskId);
    onUpdateEvent({ ...event, tasks: updated });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: ChecklistTask = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      titleHi: taskTitle.trim(),
      phase: taskPhase,
      completed: false,
      assignedTo: taskAssignee.trim() || undefined,
      dueDate: taskDueDate || event.date,
    };

    onUpdateEvent({ ...event, tasks: [...event.tasks, newTask] });
    setTaskTitle('');
    setTaskAssignee('');
    setShowAddTask(false);
  };

  const handleCreateRunItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!runActivity.trim()) return;

    const newItem: RunSheetItem = {
      id: `run-${Date.now()}`,
      time: runTime.trim(),
      activity: runActivity.trim(),
      activityHi: runActivity.trim(),
      leadPerson: runLead.trim(),
      notes: runNotes.trim() || undefined,
      isCritical: runCritical,
    };

    onUpdateEvent({ ...event, runSheet: [...event.runSheet, newItem] });
    setRunActivity('');
    setRunNotes('');
    setRunCritical(false);
    setShowAddRun(false);
  };

  const handleDeleteRunItem = (itemId: string) => {
    const updated = event.runSheet.filter((i) => i.id !== itemId);
    onUpdateEvent({ ...event, runSheet: updated });
  };

  // AI Generate / Optimize Run Sheet
  const handleAiGenerateSchedule = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/day-of-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.type,
          eventName: event.title,
          date: event.date,
          guestCount: event.guestCount,
          startTime: '11:00 AM',
          specialRituals: `${event.type} celebration with key highlights`,
          lang,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.timeline) {
        const newRunSheet: RunSheetItem[] = data.data.timeline.map((item: any, idx: number) => ({
          id: `ai-run-${idx + 1}-${Date.now()}`,
          time: item.time,
          activity: item.activity,
          activityHi: item.activity,
          leadPerson: item.leadPerson || 'Coordinator',
          notes: item.notes,
          isCritical: !!item.critical,
        }));
        onUpdateEvent({ ...event, runSheet: newRunSheet });
      } else {
        setAiError(data.error || 'Failed to generate schedule');
      }
    } catch (err: any) {
      setAiError(err.message || 'Network error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Group tasks by phase
  const earlyTasks = event.tasks.filter((t) => t.phase === 'early');
  const midTasks = event.tasks.filter((t) => t.phase === 'mid');
  const finalTasks = event.tasks.filter((t) => t.phase === 'final');

  const renderTaskRow = (task: ChecklistTask) => {
    const title = lang === 'hi' && task.titleHi ? task.titleHi : task.title;

    return (
      <div
        key={task.id}
        className={`group p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all relative ${
          task.completed ? 'bg-[#FAF8F5]/80 border-[#E2E8F0]' : 'bg-white border-[#E2E8F0] hover:border-[#D4AF37] shadow-2xs'
        }`}
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => handleToggleTask(task.id)}
            className="mt-0.5 text-slate-300 hover:text-[#1B4332] transition-colors shrink-0"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-[#1B4332] fill-[#EBF5F0]" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 group-hover:text-[#D4AF37]" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div
              className={`text-xs sm:text-sm font-semibold transition-colors ${
                task.completed ? 'line-through text-slate-400' : 'text-[#1A1D20]'
              }`}
            >
              {title}
            </div>
            <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-400">
              {task.assignedTo && (
                <span className="flex items-center gap-1 text-[#1A1D20] bg-[#F8F6F1] px-2 py-0.5 rounded-md font-medium border border-[#E2E8F0]">
                  <User className="w-3 h-3 text-[#D4AF37]" />
                  <span>{task.assignedTo}</span>
                </span>
              )}
              {task.dueDate && (
                <span className="font-mono text-slate-500">
                  {lang === 'hi' ? 'अंतिम तिथि' : 'Due'}: {task.dueDate}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleDeleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 transition-opacity rounded-md"
          title={t.common.delete}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher: Milestones vs Day-Of Run Sheet */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1D20]">{t.tasks.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.tasks.subtitle}</p>
          </div>

          {/* Segmented Subtab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] rounded-xl self-start sm:self-auto border border-[#E2E8F0]">
            <button
              onClick={() => setActiveSubTab('checklist')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeSubTab === 'checklist'
                  ? 'bg-[#1A1D20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#1A1D20]'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.tasks.tabMilestones}</span>
              <span className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activeSubTab === 'checklist' ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
              }`}>
                {completedTasks}/{totalTasks}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('runSheet')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeSubTab === 'runSheet'
                  ? 'bg-[#1A1D20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#1A1D20]'
              }`}
            >
              <Timer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.tasks.tabRunSheet}</span>
              <span className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activeSubTab === 'runSheet' ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
              }`}>
                {event.runSheet.length}
              </span>
            </button>
          </div>
        </div>

        {/* Milestone Progress Bar (shown when checklist is active) */}
        {activeSubTab === 'checklist' && (
          <div className="mt-5 pt-4 border-t border-[#EFEAE1] flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                <span>{t.tasks.progress}</span>
                <span className="font-mono font-bold text-[#1A1D20]">{taskProgressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E2E8F0]">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#1B4332] rounded-full transition-all duration-300"
                  style={{ width: `${taskProgressPct}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1A1D20] hover:bg-[#2A2F35] rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.tasks.addTask}</span>
            </button>
          </div>
        )}

        {/* Day-Of Actions (shown when run sheet is active) */}
        {activeSubTab === 'runSheet' && (
          <div className="mt-5 pt-4 border-t border-[#EFEAE1] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPrintModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-[#E2E8F0] hover:bg-[#FAF8F5] text-[#1A1D20] transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.tasks.printRunSheet}</span>
              </button>

              <button
                disabled={isAiLoading}
                onClick={handleAiGenerateSchedule}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#1A1D20] bg-[#FAF8EE] hover:bg-[#F3EEDD] rounded-xl transition-colors border border-[#E8DEBE] disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isAiLoading ? t.common.loading : t.tasks.aiGenerateSchedule}</span>
              </button>
            </div>

            <button
              onClick={() => setShowAddRun(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1A1D20] hover:bg-[#2A2F35] rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.tasks.addRunItem}</span>
            </button>
          </div>
        )}
      </div>

      {aiError && (
        <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{aiError}</span>
        </div>
      )}

      {/* SUBTAB 1: MILESTONE CHECKLIST (Vertical Thread Layout with Phase Collapsibles) */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-6">
          {/* Phase 1: Early Phase */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEAE1] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1A1D20] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center font-serif font-bold text-xs">
                  01
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A813A]">
                    {lang === 'hi' ? 'चरण १' : 'Phase 01'}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#1A1D20] block leading-tight">
                    {t.tasks.earlyPhase}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#1A1D20] bg-[#FAF8F5] border border-[#E2E8F0] px-3 py-1 rounded-lg">
                {earlyTasks.filter((t) => t.completed).length} / {earlyTasks.length} {lang === 'hi' ? 'पूर्ण' : 'Done'}
              </span>
            </div>

            {/* Vertical Thread Connector */}
            <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#E2E8F0]">
              {earlyTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">No tasks in this phase</div>
              ) : (
                earlyTasks.map(renderTaskRow)
              )}
            </div>
          </div>

          {/* Phase 2: Mid Phase */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEAE1] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1A1D20] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center font-serif font-bold text-xs">
                  02
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A813A]">
                    {lang === 'hi' ? 'चरण २' : 'Phase 02'}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#1A1D20] block leading-tight">
                    {t.tasks.midPhase}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#1A1D20] bg-[#FAF8F5] border border-[#E2E8F0] px-3 py-1 rounded-lg">
                {midTasks.filter((t) => t.completed).length} / {midTasks.length} {lang === 'hi' ? 'पूर्ण' : 'Done'}
              </span>
            </div>

            <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#E2E8F0]">
              {midTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">No tasks in this phase</div>
              ) : (
                midTasks.map(renderTaskRow)
              )}
            </div>
          </div>

          {/* Phase 3: Final Week */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEAE1] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1A1D20] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center font-serif font-bold text-xs">
                  03
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A813A]">
                    {lang === 'hi' ? 'चरण ३' : 'Phase 03'}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#1A1D20] block leading-tight">
                    {t.tasks.finalWeek}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#1A1D20] bg-[#FAF8F5] border border-[#E2E8F0] px-3 py-1 rounded-lg">
                {finalTasks.filter((t) => t.completed).length} / {finalTasks.length} {lang === 'hi' ? 'पूर्ण' : 'Done'}
              </span>
            </div>

            <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#E2E8F0]">
              {finalTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">No tasks in this phase</div>
              ) : (
                finalTasks.map(renderTaskRow)
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DAY-OF RUN SHEET */}
      {activeSubTab === 'runSheet' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.tasks.runSheetTitle}</h3>
              <p className="text-xs text-slate-500">{t.tasks.runSheetSubtitle}</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {event.runSheet.length} {lang === 'hi' ? 'टाइमलाइन स्लॉट्स' : 'timeline events'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {event.runSheet.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors ${
                  item.isCritical ? 'bg-amber-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="font-mono tabular-nums text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-lg shrink-0">
                    {item.time}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {lang === 'hi' && item.activityHi ? item.activityHi : item.activity}
                      </span>
                      {item.isCritical && (
                        <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          {lang === 'hi' ? 'महत्वपूर्ण' : 'Critical'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{lang === 'hi' ? 'प्रभारी' : 'Lead'}:</strong> {item.leadPerson}
                      </span>
                      {item.notes && (
                        <span className="text-slate-400 italic">
                          "{item.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteRunItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title={t.common.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Task */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t.tasks.addTask}</h3>
            <p className="text-xs text-slate-500 mb-4">{t.tasks.subtitle}</p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.tasks.taskPlaceholder}
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Confirm guest count with caterer"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Countdown Phase
                </label>
                <select
                  value={taskPhase}
                  onChange={(e) => setTaskPhase(e.target.value as TaskPhase)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="early">{t.tasks.earlyPhase}</option>
                  <option value="mid">{t.tasks.midPhase}</option>
                  <option value="final">{t.tasks.finalWeek}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.tasks.assignedTo}
                  </label>
                  <input
                    type="text"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    placeholder="e.g. Sibling / Lead"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.tasks.dueDate}
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
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

      {/* Modal: Add Day-Of Run Item */}
      {showAddRun && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t.tasks.addRunItem}</h3>
            <p className="text-xs text-slate-500 mb-4">{t.tasks.runSheetSubtitle}</p>

            <form onSubmit={handleCreateRunItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.tasks.time}
                  </label>
                  <input
                    type="text"
                    required
                    value={runTime}
                    onChange={(e) => setRunTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.tasks.leadPerson}
                  </label>
                  <input
                    type="text"
                    required
                    value={runLead}
                    onChange={(e) => setRunLead(e.target.value)}
                    placeholder="e.g. DJ / Decorator / Host"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.tasks.activity}
                </label>
                <input
                  type="text"
                  required
                  value={runActivity}
                  onChange={(e) => setRunActivity(e.target.value)}
                  placeholder="e.g. Cake arrival & cold storage check"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.common.notes} ({t.common.optional})
                </label>
                <input
                  type="text"
                  value={runNotes}
                  onChange={(e) => setRunNotes(e.target.value)}
                  placeholder="e.g. Wireless mic in green room"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="critical"
                  checked={runCritical}
                  onChange={(e) => setRunCritical(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="critical" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Mark as Critical Milestone (High Priority)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRun(false)}
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

      {/* Printable Run Sheet Modal */}
      <RunSheetPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        event={event}
        lang={lang}
      />
    </div>
  );
};
