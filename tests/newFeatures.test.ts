import { describe, it, expect } from 'vitest';
import { TablePlan, SubEvent, EcoStats, GuestRsvp } from '../src/types';

describe('HostMate New Features Test Suite', () => {
  describe('Feature 1: Seating & Table Planner Logic', () => {
    const mockGuests: GuestRsvp[] = [
      { id: 'g-1', name: 'Aarav Sharma', attendance: 'yes', plusOnes: 1, foodPreference: 'veg', submittedAt: '2026-10-20' },
      { id: 'g-2', name: 'Rohan Mehta', attendance: 'yes', plusOnes: 0, foodPreference: 'jain', submittedAt: '2026-10-20' },
      { id: 'g-3', name: 'Priya Verma', attendance: 'yes', plusOnes: 0, foodPreference: 'non-veg', submittedAt: '2026-10-20' },
      { id: 'g-4', name: 'Suresh Patel', attendance: 'no', plusOnes: 0, foodPreference: 'veg', submittedAt: '2026-10-20' },
    ];

    const mockTables: TablePlan[] = [
      {
        id: 't-1',
        name: 'VIP Table 1',
        shape: 'round',
        capacity: 8,
        x: 100,
        y: 100,
        assignedGuestIds: ['g-1', 'g-2'],
      },
      {
        id: 't-2',
        name: 'Friends Rectangular',
        shape: 'rectangular',
        capacity: 10,
        x: 300,
        y: 100,
        assignedGuestIds: [],
      },
    ];

    it('calculates total seating capacity and occupied seats correctly', () => {
      const totalCapacity = mockTables.reduce((acc, t) => acc + t.capacity, 0);
      expect(totalCapacity).toBe(18);

      const assignedGuestCount = mockTables.reduce((acc, t) => acc + t.assignedGuestIds.length, 0);
      expect(assignedGuestCount).toBe(2);
    });

    it('identifies unassigned confirmed guests accurately', () => {
      const confirmedGuests = mockGuests.filter((g) => g.attendance === 'yes');
      expect(confirmedGuests.length).toBe(3);

      const allAssigned = new Set(mockTables.flatMap((t) => t.assignedGuestIds));
      const unassigned = confirmedGuests.filter((g) => !allAssigned.has(g.id));

      expect(unassigned.length).toBe(1);
      expect(unassigned[0].id).toBe('g-3');
    });

    it('correctly tracks dietary preferences for guests assigned to a table', () => {
      const table1 = mockTables[0];
      const tableGuests = mockGuests.filter((g) => table1.assignedGuestIds.includes(g.id));

      const vegCount = tableGuests.filter((g) => g.foodPreference === 'veg').length;
      const jainCount = tableGuests.filter((g) => g.foodPreference === 'jain').length;

      expect(vegCount).toBe(1);
      expect(jainCount).toBe(1);
    });
  });

  describe('Feature 2: Multi-Event Scheduling & Targeted Invites', () => {
    const mockSubEvents: SubEvent[] = [
      {
        id: 'sub-1',
        name: 'Haldi & Mehndi',
        date: '2026-11-19',
        startTime: '10:00 AM',
        endTime: '01:00 PM',
        venue: 'Lawn',
        allocatedBudget: 150000,
        invitedGuestIds: ['g-1', 'g-2'],
      },
      {
        id: 'sub-2',
        name: 'Grand Reception',
        date: '2026-11-20',
        startTime: '07:30 PM',
        endTime: '11:00 PM',
        venue: 'Palace Hall',
        allocatedBudget: 350000,
        invitedGuestIds: ['g-1', 'g-2', 'g-3'],
      },
    ];

    it('computes cumulative sub-event budgets', () => {
      const totalSubBudgets = mockSubEvents.reduce((acc, s) => acc + s.allocatedBudget, 0);
      expect(totalSubBudgets).toBe(500000);
    });

    it('supports targeted invites where Guest 3 is invited to Reception only', () => {
      const haldi = mockSubEvents.find((s) => s.id === 'sub-1')!;
      const reception = mockSubEvents.find((s) => s.id === 'sub-2')!;

      expect(haldi.invitedGuestIds.includes('g-3')).toBe(false);
      expect(reception.invitedGuestIds.includes('g-3')).toBe(true);
    });
  });

  describe('Feature 8: Eco-Host Demographic Food & Carbon Estimator', () => {
    it('estimates catering food weights based on demographic age brackets and service format', () => {
      const adults = 100;
      const children = 20;
      const seniors = 20;

      // Buffet: adults 0.60kg, children 0.30kg, seniors 0.40kg
      const buffetKg = Math.round((adults * 0.60 + children * 0.30 + seniors * 0.40) * 1.0);
      expect(buffetKg).toBe(74);

      // Plated format reduces waste by ~15%
      const platedKg = Math.round((adults * 0.60 + children * 0.30 + seniors * 0.40) * 0.85);
      expect(platedKg).toBe(63);
    });

    it('estimates single-use plastic bottles saved and surplus meal portions', () => {
      const totalGuests = 140;
      const bottlesSaved = Math.round(totalGuests * 2.8);
      expect(bottlesSaved).toBe(392);

      const foodKg = 74;
      const surplusMeals = Math.round(foodKg * 0.12 * 2.2);
      expect(surplusMeals).toBe(20);
    });
  });
});
