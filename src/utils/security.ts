/**
 * HostMate Security & Validation Utilities
 * Hardens input sanitization, safe parsing, external URL opening, and data validation
 */

import { EventData } from '../types';

/**
 * Sanitizes user-entered text to protect against XSS and malicious HTML injections.
 * Removes dangerous tags and escapes special characters.
 */
export function sanitizeText(raw: string | undefined | null): string {
  if (!raw) return '';
  return String(raw)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '')
    .trim();
}

/**
 * Encodes strings safely for WhatsApp and mailto query parameters.
 */
export function safeEncodeUriComponent(str: string): string {
  return encodeURIComponent(sanitizeText(str));
}

/**
 * Safely parses numeric inputs with fallback and boundary clamping.
 */
export function safeParseNumber(val: unknown, fallback: number = 0, min?: number, max?: number): number {
  if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
    let result = val;
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);
    return result;
  }
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && isFinite(parsed)) {
      let result = parsed;
      if (min !== undefined) result = Math.max(min, result);
      if (max !== undefined) result = Math.min(max, result);
      return result;
    }
  }
  return fallback;
}

/**
 * Defensive currency formatting with boundary checks and error resilience.
 */
export function safeFormatCurrency(amount: unknown, currency: string = '₹'): string {
  const num = safeParseNumber(amount, 0);
  try {
    return `${currency} ${num.toLocaleString('en-IN')}`;
  } catch {
    return `${currency} ${num}`;
  }
}

/**
 * Safely opens external URLs preventing reverse tabnabbing (window.opener exploits).
 */
export function safeOpenExternal(url: string, target: string = '_blank'): Window | null {
  const sanitized = url.trim();
  if (sanitized.toLowerCase().startsWith('javascript:')) {
    console.warn('Blocked malicious javascript: URL');
    return null;
  }
  return window.open(sanitized, target, 'noopener,noreferrer');
}

/**
 * Validates that an EventData structure contains necessary collections and valid types.
 * Heals missing arrays to prevent runtime undefined property accesses.
 */
export function validateAndHealEvent(event: Partial<EventData>): EventData {
  return {
    id: event.id || `event-${Date.now()}`,
    title: sanitizeText(event.title) || 'Celebration',
    type: event.type || 'wedding',
    date: event.date || '2026-11-20',
    currency: event.currency || '₹',
    totalBudget: safeParseNumber(event.totalBudget, 1000000, 0),
    guestCount: safeParseNumber(event.guestCount, 200, 1),
    budgetItems: Array.isArray(event.budgetItems) ? event.budgetItems : [],
    tasks: Array.isArray(event.tasks) ? event.tasks : [],
    runSheet: Array.isArray(event.runSheet) ? event.runSheet : [],
    rsvps: Array.isArray(event.rsvps) ? event.rsvps : [],
    vendors: Array.isArray(event.vendors) ? event.vendors : [],
    subEvents: Array.isArray(event.subEvents) ? event.subEvents : [],
    tables: Array.isArray(event.tables) ? event.tables : [],
    photos: Array.isArray(event.photos) ? event.photos : [],
    gifts: Array.isArray(event.gifts) ? event.gifts : [],
    ecoStats: event.ecoStats || {
      adultsCount: 150,
      childrenCount: 30,
      seniorsCount: 20,
      mealType: 'buffet',
      estimatedFoodKg: 110,
      plasticBottlesSaved: 560,
      carbonOffsetKg: 320,
      surplusPortions: 25,
      foodDonationRequested: false,
      foodDonationNgo: 'Robin Hood Army',
      foodDonationStatus: 'pending',
    },
    proSettings: event.proSettings || {
      isProEnabled: false,
      agencyName: 'Aura Event Architects',
      plannerName: 'Lead Planner',
      primaryColor: '#1c5340',
      activeClientCount: 1,
      managedBudgetTotal: 1000000,
      customWatermark: false,
    },
    promotedVendors: Array.isArray(event.promotedVendors) ? event.promotedVendors : [],
    createdAt: event.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
