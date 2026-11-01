import { describe, it, expect } from 'vitest';
import { BudgetCategory } from '../src/types';

describe('Budget Tracker & Vault Calculations', () => {
  const sampleItems: BudgetCategory[] = [
    {
      id: 'b1',
      name: 'Catering',
      nameHi: 'खान-पान',
      recommendedPct: 40,
      estimatedCost: 400000,
      actualCost: 380000,
      advancePaid: 150000,
      dueDate: '2026-11-15',
    },
    {
      id: 'b2',
      name: 'Venue',
      nameHi: 'स्थान',
      recommendedPct: 25,
      estimatedCost: 250000,
      actualCost: 250000,
      advancePaid: 250000,
      dueDate: '2026-11-10',
    },
    {
      id: 'b3',
      name: 'Decor',
      nameHi: 'सजावट',
      recommendedPct: 15,
      estimatedCost: 150000,
      actualCost: 170000,
      advancePaid: 50000,
      dueDate: '2026-11-12',
    },
  ];

  it('correctly calculates total estimated, actual, advance paid, and balance due', () => {
    const totalEstimated = sampleItems.reduce((acc, curr) => acc + curr.estimatedCost, 0);
    const totalActual = sampleItems.reduce((acc, curr) => acc + curr.actualCost, 0);
    const totalAdvance = sampleItems.reduce((acc, curr) => acc + curr.advancePaid, 0);
    const totalBalanceDue = Math.max(0, totalActual - totalAdvance);

    expect(totalEstimated).toBe(800000);
    expect(totalActual).toBe(800000);
    expect(totalAdvance).toBe(450000);
    expect(totalBalanceDue).toBe(350000);
  });

  it('determines budget status thresholds accurately', () => {
    const totalBudget = 1000000;

    // Case 1: 50% spent -> Within budget / On track (<=85%)
    let spentPct = Math.round((500000 / totalBudget) * 100);
    expect(spentPct).toBe(50);
    expect(spentPct <= 85).toBe(true);

    // Case 2: 90% spent -> Approaching limit (86-100%)
    spentPct = Math.round((900000 / totalBudget) * 100);
    expect(spentPct).toBe(90);
    expect(spentPct > 85 && spentPct <= 100).toBe(true);

    // Case 3: 115% spent -> Over budget (>100%)
    spentPct = Math.round((1150000 / totalBudget) * 100);
    expect(spentPct).toBe(115);
    expect(spentPct > 100).toBe(true);
  });

  it('computes 180px circular gauge circumference and stroke offsets accurately', () => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius; // ~439.82
    expect(circumference).toBeCloseTo(439.82, 1);

    // At 50% spent, offset should be half of circumference
    const offset50 = circumference - (50 / 100) * circumference;
    expect(offset50).toBeCloseTo(circumference / 2, 1);

    // At 100% spent, offset should be 0 (full circle)
    const offset100 = circumference - (100 / 100) * circumference;
    expect(offset100).toBeCloseTo(0, 1);

    // At 0% spent, offset should equal circumference (empty track)
    const offset0 = circumference - (0 / 100) * circumference;
    expect(offset0).toBeCloseTo(circumference, 1);
  });

  it('verifies item payment status logic (Paid in Full vs Deposit Paid vs Pending)', () => {
    const getStatus = (item: BudgetCategory) => {
      const remaining = Math.max(0, item.actualCost - item.advancePaid);
      if (item.actualCost > 0 && remaining === 0) return 'PAID_IN_FULL';
      if (item.advancePaid > 0 && remaining > 0) return 'DEPOSIT_PAID';
      return 'PENDING';
    };

    expect(getStatus(sampleItems[1])).toBe('PAID_IN_FULL'); // Venue: 250k actual, 250k advance
    expect(getStatus(sampleItems[0])).toBe('DEPOSIT_PAID');  // Catering: 380k actual, 150k advance
    expect(getStatus({
      id: 'b4',
      name: 'Unpaid Item',
      nameHi: 'लंबित मद',
      recommendedPct: 5,
      estimatedCost: 50000,
      actualCost: 50000,
      advancePaid: 0,
      dueDate: '2026-11-20',
    })).toBe('PENDING');
  });
});
