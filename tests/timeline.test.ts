import { describe, it, expect } from 'vitest';
import { ChecklistTask, RunSheetItem } from '../src/types';

describe('Milestone Timeline & Day-Of Run Sheet', () => {
  const sampleTasks: ChecklistTask[] = [
    { id: 't1', title: 'Lock venue', titleHi: 'स्थान बुक करें', phase: 'early', completed: true, assignedTo: 'Host' },
    { id: 't2', title: 'Book caterer', titleHi: 'केटरर बुक करें', phase: 'early', completed: true, assignedTo: 'Host' },
    { id: 't3', title: 'Send digital invites', titleHi: 'डिजिटल आमंत्रण भेजें', phase: 'mid', completed: false, assignedTo: 'Coordinator' },
    { id: 't4', title: 'Freeze headcount', titleHi: 'गेस्ट संख्या फाइनल करें', phase: 'final', completed: false, assignedTo: 'Host' },
  ];

  it('correctly filters tasks by phase and computes progress', () => {
    const early = sampleTasks.filter((t) => t.phase === 'early');
    const mid = sampleTasks.filter((t) => t.phase === 'mid');
    const finalPhase = sampleTasks.filter((t) => t.phase === 'final');

    expect(early.length).toBe(2);
    expect(mid.length).toBe(1);
    expect(finalPhase.length).toBe(1);

    const completedEarly = early.filter((t) => t.completed).length;
    expect(completedEarly).toBe(2);
    const earlyProgress = Math.round((completedEarly / early.length) * 100);
    expect(earlyProgress).toBe(100);

    const totalCompleted = sampleTasks.filter((t) => t.completed).length;
    const overallProgress = Math.round((totalCompleted / sampleTasks.length) * 100);
    expect(overallProgress).toBe(50); // 2 out of 4
  });

  it('verifies day-of run sheet item structure and critical flags', () => {
    const sampleRunSheet: RunSheetItem[] = [
      { id: 'r1', time: '08:00 AM', activity: 'Decorator arrival', leadPerson: 'Decorator', isCritical: true },
      { id: 'r2', time: '11:00 AM', activity: 'Sound check', leadPerson: 'DJ lead' },
      { id: 'r3', time: '01:00 PM', activity: 'Couple entrance', leadPerson: 'Coordinator', isCritical: true },
    ];

    expect(sampleRunSheet.length).toBe(3);
    const criticalItems = sampleRunSheet.filter((r) => r.isCritical);
    expect(criticalItems.length).toBe(2);

    expect(sampleRunSheet[0].time).toBe('08:00 AM');
    expect(sampleRunSheet[2].time).toBe('01:00 PM');
  });
});
