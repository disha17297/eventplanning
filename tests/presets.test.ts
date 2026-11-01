import { describe, it, expect } from 'vitest';
import { createInitialEvent, EVENT_PRESETS } from '../src/data/presets';
import { BudgetCategory, ChecklistTask, RunSheetItem } from '../src/types';

describe('Smart Setup Wizard & Presets', () => {
  it('creates a ready-to-use workspace for Wedding with recommended 40/25/15/10 splits', () => {
    const event = createInitialEvent('wedding', 'Aarav & Priya Wedding', '2026-12-15', 1500000, 250);

    expect(event.title).toBe('Aarav & Priya Wedding');
    expect(event.type).toBe('wedding');
    expect(event.totalBudget).toBe(1500000);
    expect(event.guestCount).toBe(250);

    // Verify budget items
    expect(event.budgetItems.length).toBeGreaterThan(0);
    const cateringItem = event.budgetItems.find((b: BudgetCategory) => b.name.includes('Catering'));
    expect(cateringItem).toBeDefined();
    expect(cateringItem?.recommendedPct).toBe(40);
    expect(cateringItem?.estimatedCost).toBe(600000); // 40% of 15,00,000

    const venueItem = event.budgetItems.find((b: BudgetCategory) => b.name.includes('Venue'));
    expect(venueItem).toBeDefined();
    expect(venueItem?.recommendedPct).toBe(25);
    expect(venueItem?.estimatedCost).toBe(375000); // 25% of 15,00,000

    const decorItem = event.budgetItems.find((b: BudgetCategory) => b.name.includes('Decor'));
    expect(decorItem).toBeDefined();
    expect(decorItem?.recommendedPct).toBe(15);
    expect(decorItem?.estimatedCost).toBe(225000); // 15% of 15,00,000

    const bufferItem = event.budgetItems.find((b: BudgetCategory) => b.name.includes('Buffer'));
    expect(bufferItem).toBeDefined();
    expect(bufferItem?.recommendedPct).toBe(10);
    expect(bufferItem?.estimatedCost).toBe(150000); // 10% of 15,00,000

    // Verify milestone tasks across early, mid, and final phases
    const earlyTasks = event.tasks.filter((t: ChecklistTask) => t.phase === 'early');
    const midTasks = event.tasks.filter((t: ChecklistTask) => t.phase === 'mid');
    const finalTasks = event.tasks.filter((t: ChecklistTask) => t.phase === 'final');

    expect(earlyTasks.length).toBeGreaterThan(0);
    expect(midTasks.length).toBeGreaterThan(0);
    expect(finalTasks.length).toBeGreaterThan(0);

    // Verify day-of run sheet
    expect(event.runSheet.length).toBeGreaterThan(0);
    expect(event.runSheet[0]).toHaveProperty('time');
    expect(event.runSheet[0]).toHaveProperty('activity');
    expect(event.runSheet[0]).toHaveProperty('leadPerson');
  });

  it('creates Birthday event with custom party defaults and tasks', () => {
    const event = createInitialEvent('birthday', "Rohan's 30th", '2026-11-10', 100000, 50);

    expect(event.type).toBe('birthday');
    expect(event.totalBudget).toBe(100000);
    expect(event.guestCount).toBe(50);

    const cakeItem = event.budgetItems.find((b: BudgetCategory) => b.name.toLowerCase().includes('cake'));
    expect(cakeItem).toBeDefined();

    expect(event.runSheet.some((r: RunSheetItem) => r.activity.toLowerCase().includes('cake'))).toBe(true);
  });

  it('creates Community event with safety & permit tasks', () => {
    const event = createInitialEvent('community', 'Diwali Mela', '2026-11-01', 500000, 400);

    expect(event.type).toBe('community');
    expect(event.totalBudget).toBe(500000);
    expect(event.guestCount).toBe(400);

    const safetyItem = event.budgetItems.find((b: BudgetCategory) => b.name.toLowerCase().includes('safety'));
    expect(safetyItem).toBeDefined();
  });

  it('falls back to preset defaults when optional arguments are omitted', () => {
    const event = createInitialEvent('wedding');

    expect(event.title).toBe(EVENT_PRESETS.wedding.title);
    expect(event.totalBudget).toBe(EVENT_PRESETS.wedding.defaultBudget);
    expect(event.guestCount).toBe(EVENT_PRESETS.wedding.defaultGuestCount);
    expect(event.currency).toBe('₹');
  });
});
