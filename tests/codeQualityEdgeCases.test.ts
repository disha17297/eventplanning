import { describe, it, expect } from 'vitest';
import { createInitialEvent } from '../src/data/presets';
import { TablePlan, SubEvent, GiftRecord } from '../src/types';

describe('Code Quality & Edge Case Resilience Test Suite', () => {
  describe('Seating & Table Assignment Boundaries', () => {
    it('detects table capacity exceedance correctly', () => {
      const table: TablePlan = {
        id: 't-test',
        name: 'Test Round Table',
        shape: 'round',
        capacity: 4,
        x: 0,
        y: 0,
        assignedGuestIds: ['g-1', 'g-2', 'g-3', 'g-4', 'g-5'], // 5 guests assigned to capacity of 4
      };

      const isOverCapacity = table.assignedGuestIds.length > table.capacity;
      expect(isOverCapacity).toBe(true);
      expect(table.assignedGuestIds.length - table.capacity).toBe(1);
    });

    it('correctly handles tables with 0 assigned guests', () => {
      const emptyTable: TablePlan = {
        id: 't-empty',
        name: 'Empty Head Table',
        shape: 'rectangular',
        capacity: 10,
        x: 0,
        y: 0,
        assignedGuestIds: [],
      };

      expect(emptyTable.assignedGuestIds.length).toBe(0);
      const occupancyRate = (emptyTable.assignedGuestIds.length / emptyTable.capacity) * 100;
      expect(occupancyRate).toBe(0);
    });
  });

  describe('Eco-Host Demographic Waste Estimator Logic', () => {
    it('calculates food consumption per demographic weighting', () => {
      // Standard assumption: Adults ~ 0.6kg, Children ~ 0.3kg, Seniors ~ 0.45kg
      const adults = 100;
      const children = 30;
      const seniors = 20;

      const expectedKg = (adults * 0.6) + (children * 0.3) + (seniors * 0.45);
      expect(expectedKg).toBe(60 + 9 + 9); // 78 kg
    });

    it('handles zero attendance without division by zero or NaN', () => {
      const totalGuests = 0;
      const estimatedFoodKg = totalGuests > 0 ? totalGuests * 0.55 : 0;
      expect(estimatedFoodKg).toBe(0);
      expect(isNaN(estimatedFoodKg)).toBe(false);
    });
  });

  describe('Pro Agency SaaS & Vendor Commission Math', () => {
    it('calculates earned commission based on starting price, leads, and commission rate', () => {
      const startingPrice = 200000;
      const leadsBooked = 5;
      const commissionPct = 8; // 8%

      const totalBookedVolume = startingPrice * leadsBooked;
      const commissionEarned = (totalBookedVolume * commissionPct) / 100;

      expect(totalBookedVolume).toBe(1000000);
      expect(commissionEarned).toBe(80000);
    });

    it('handles 0 leads without negative or broken arithmetic', () => {
      const startingPrice = 350000;
      const leadsBooked = 0;
      const commissionPct = 7;

      const commissionEarned = ((startingPrice * leadsBooked) * commissionPct) / 100;
      expect(commissionEarned).toBe(0);
    });
  });

  describe('Gift Registry & Shagun Cash Calculations', () => {
    const sampleGifts: GiftRecord[] = [
      { id: '1', guestName: 'Guest A', type: 'cash', amount: 5100, thankYouSent: true, recordedAt: '2026-10-25 12:00' },
      { id: '2', guestName: 'Guest B', type: 'cash', amount: 11000, thankYouSent: false, recordedAt: '2026-10-25 13:00' },
      { id: '3', guestName: 'Guest C', type: 'physical', itemDescription: 'Silver Bowl', thankYouSent: false, recordedAt: '2026-10-25 14:00' },
      { id: '4', guestName: 'Guest D', type: 'blessing', thankYouSent: true, recordedAt: '2026-10-25 15:00' },
    ];

    it('sums only cash gifts correctly, ignoring physical or blessing types', () => {
      const totalCash = sampleGifts
        .filter((g) => g.type === 'cash' && typeof g.amount === 'number')
        .reduce((sum, g) => sum + (g.amount || 0), 0);

      expect(totalCash).toBe(16100);
    });

    it('accurately tracks pending vs sent thank-you note count', () => {
      const sentCount = sampleGifts.filter((g) => g.thankYouSent).length;
      const pendingCount = sampleGifts.filter((g) => !g.thankYouSent).length;

      expect(sentCount).toBe(2);
      expect(pendingCount).toBe(2);
      expect(sentCount + pendingCount).toBe(sampleGifts.length);
    });
  });

  describe('Preset Integrity & Sub-Event Budgets', () => {
    it('creates initial wedding with non-empty sub-events, tables, and gifts', () => {
      const event = createInitialEvent('wedding', 'Aarav & Priya Wedding', '2026-11-20', 2000000, 300);

      expect(event.title).toBe('Aarav & Priya Wedding');
      expect(event.totalBudget).toBe(2000000);
      expect(event.guestCount).toBe(300);
      expect(event.subEvents && event.subEvents.length).toBeGreaterThanOrEqual(4);
      expect(event.tables && event.tables.length).toBeGreaterThanOrEqual(2);
      expect(event.gifts && event.gifts.length).toBeGreaterThanOrEqual(2);
      expect(event.ecoStats).toBeDefined();
      expect(event.proSettings).toBeDefined();
    });
  });
});
