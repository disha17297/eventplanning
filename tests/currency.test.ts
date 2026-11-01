import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../src/utils/storage';

describe('formatCurrency - Indian Numbering System', () => {
  it('formats amounts in Indian numbering system (Lakhs & Crores)', () => {
    // 15 Lakhs
    expect(formatCurrency(1500000, '₹')).toBe('₹ 15,00,000');

    // 1 Crore
    expect(formatCurrency(10000000, '₹')).toBe('₹ 1,00,00,000');

    // 50 Thousand
    expect(formatCurrency(50000, '₹')).toBe('₹ 50,000');

    // Hundreds
    expect(formatCurrency(500, '₹')).toBe('₹ 500');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0, '₹')).toBe('₹ 0');
  });

  it('handles custom currencies ($ and €)', () => {
    const formattedDollar = formatCurrency(50000, '$');
    expect(formattedDollar).toContain('$');
    expect(formattedDollar).toContain('50,000');

    const formattedEuro = formatCurrency(120000, '€');
    expect(formattedEuro).toContain('€');
  });

  it('gracefully handles NaN, null, or undefined by defaulting to 0', () => {
    // @ts-expect-error testing invalid input
    expect(formatCurrency(null, '₹')).toBe('₹ 0');
    // @ts-expect-error testing invalid input
    expect(formatCurrency(undefined, '₹')).toBe('₹ 0');
    expect(formatCurrency(NaN, '₹')).toBe('₹ 0');
  });
});
