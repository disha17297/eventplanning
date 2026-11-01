import { describe, it, expect } from 'vitest';
import { 
  sanitizeText, 
  safeParseNumber, 
  safeFormatCurrency, 
  validateAndHealEvent,
  safeEncodeUriComponent
} from '../src/utils/security';
import { EventData } from '../src/types';

describe('Security & Input Validation Test Suite', () => {
  describe('XSS & Input Sanitization', () => {
    it('strips malicious <script> tags from input strings', () => {
      const malicious = 'Grand Wedding <script>alert("xss")</script> Celebration';
      const cleaned = sanitizeText(malicious);
      expect(cleaned).toBe('Grand Wedding  Celebration');
      expect(cleaned).not.toContain('<script>');
    });

    it('strips <iframe> and <object> embed payloads', () => {
      const payload = 'Venue Lawns <iframe src="http://evil.com"></iframe>';
      const cleaned = sanitizeText(payload);
      expect(cleaned).toBe('Venue Lawns');
    });

    it('neutralizes inline event handlers like onload and onerror', () => {
      const payload = 'Guest Name <img src="x" onerror="stealCookies()" onload="pwn()" />';
      const cleaned = sanitizeText(payload);
      expect(cleaned).not.toContain('onerror=');
      expect(cleaned).not.toContain('onload=');
    });

    it('strips javascript: pseudo-protocol strings', () => {
      const link = 'javascript:document.location="http://evil.com"';
      const cleaned = sanitizeText(link);
      expect(cleaned).not.toContain('javascript:');
    });

    it('handles null, undefined, and non-string inputs safely without crashing', () => {
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
      expect(sanitizeText('')).toBe('');
      expect(sanitizeText('   Trimmed String   ')).toBe('Trimmed String');
    });

    it('safely encodes strings for WhatsApp and URI components', () => {
      const raw = 'Hello & Welcome! <script>alert(1)</script>';
      const encoded = safeEncodeUriComponent(raw);
      expect(encoded).not.toContain('<script>');
      expect(encoded).toContain('Hello%20%26%20Welcome!');
    });
  });

  describe('Defensive Numeric Parsing & Boundary Handling', () => {
    it('parses valid numbers and clamped boundaries correctly', () => {
      expect(safeParseNumber(5000, 0, 100, 10000)).toBe(5000);
      expect(safeParseNumber(50, 0, 100, 10000)).toBe(100); // clamped to min
      expect(safeParseNumber(25000, 0, 100, 10000)).toBe(10000); // clamped to max
    });

    it('parses string numbers with currency symbols and commas', () => {
      expect(safeParseNumber('₹ 1,50,000', 0)).toBe(150000);
      expect(safeParseNumber('$2,500.50', 0)).toBe(2500.5);
    });

    it('handles NaN, Infinity, null, and malformed strings gracefully with fallback', () => {
      expect(safeParseNumber(NaN, 100)).toBe(100);
      expect(safeParseNumber(Infinity, 100)).toBe(100);
      expect(safeParseNumber(-Infinity, 100)).toBe(100);
      expect(safeParseNumber('invalid-cost-abc', 500)).toBe(500);
      expect(safeParseNumber(undefined, 250)).toBe(250);
    });
  });

  describe('Defensive Currency Formatting', () => {
    it('formats standard amounts with en-IN numbering by default', () => {
      expect(safeFormatCurrency(1500000, '₹')).toBe('₹ 15,00,000');
      expect(safeFormatCurrency(25000, '$')).toBe('$ 25,000');
    });

    it('handles zero, negative numbers, and non-numeric inputs safely', () => {
      expect(safeFormatCurrency(0, '₹')).toBe('₹ 0');
      expect(safeFormatCurrency('abc', '₹')).toBe('₹ 0');
      expect(safeFormatCurrency(null, '₹')).toBe('₹ 0');
    });
  });

  describe('Schema Validation & Healing for Stored Data', () => {
    it('heals corrupted or partial event objects with missing arrays', () => {
      const brokenEvent: Partial<EventData> = {
        id: 'ev-test',
        title: 'Partial Event',
        // missing budgetItems, rsvps, tasks, subEvents, tables, etc.
      };

      const healed = validateAndHealEvent(brokenEvent);
      expect(healed.id).toBe('ev-test');
      expect(Array.isArray(healed.budgetItems)).toBe(true);
      expect(Array.isArray(healed.rsvps)).toBe(true);
      expect(Array.isArray(healed.tasks)).toBe(true);
      expect(Array.isArray(healed.subEvents)).toBe(true);
      expect(Array.isArray(healed.tables)).toBe(true);
      expect(Array.isArray(healed.gifts)).toBe(true);
      expect(healed.ecoStats).toBeDefined();
      expect(healed.proSettings).toBeDefined();
    });

    it('clamps negative budgets or invalid guest counts to safe minimums', () => {
      const invalidEvent: Partial<EventData> = {
        totalBudget: -50000,
        guestCount: -20,
      };

      const healed = validateAndHealEvent(invalidEvent);
      expect(healed.totalBudget).toBe(0);
      expect(healed.guestCount).toBe(1);
    });
  });
});
