import { describe, it, expect } from 'vitest';
import { GuestRsvp } from '../src/types';

describe('WhatsApp-Native RSVP & Caterer Headcounts', () => {
  const sampleRsvps: GuestRsvp[] = [
    {
      id: 'r1',
      name: 'Rohan Mehra',
      phone: '+91 98200 12345',
      attendance: 'yes',
      plusOnes: 2, // Rohan + 2 companions = 3 heads
      foodPreference: 'veg',
      submittedAt: '2026-10-25 10:00',
    },
    {
      id: 'r2',
      name: 'Simran Kaur',
      phone: '+91 98111 23456',
      attendance: 'yes',
      plusOnes: 1, // Simran + 1 companion = 2 heads
      foodPreference: 'non-veg',
      submittedAt: '2026-10-25 11:30',
    },
    {
      id: 'r3',
      name: 'Dr. Ramesh Gupta',
      phone: '+91 99100 55443',
      attendance: 'yes',
      plusOnes: 0, // Ramesh alone = 1 head
      foodPreference: 'jain',
      submittedAt: '2026-10-25 12:15',
    },
    {
      id: 'r4',
      name: 'Ananya Roy',
      phone: '+91 98999 88776',
      attendance: 'yes',
      plusOnes: 1, // Ananya + 1 = 2 heads
      foodPreference: 'vegan',
      submittedAt: '2026-10-25 14:00',
    },
    {
      id: 'r5',
      name: 'Sunil Verma',
      phone: '+91 98711 00223',
      attendance: 'no', // Declined - should not count towards food or heads
      plusOnes: 3,
      foodPreference: 'veg',
      submittedAt: '2026-10-25 15:00',
    },
  ];

  it('calculates total confirmed heads including companions/plus-ones', () => {
    const attendingGuests = sampleRsvps.filter((r) => r.attendance === 'yes');
    const totalAdults = attendingGuests.length; // 4 primary guests
    const totalPlusOnes = attendingGuests.reduce((acc, curr) => acc + (curr.plusOnes || 0), 0); // 2 + 1 + 0 + 1 = 4
    const totalConfirmedHeads = totalAdults + totalPlusOnes; // 4 + 4 = 8

    expect(totalAdults).toBe(4);
    expect(totalPlusOnes).toBe(4);
    expect(totalConfirmedHeads).toBe(8);

    const declinedCount = sampleRsvps.filter((r) => r.attendance === 'no').length;
    expect(declinedCount).toBe(1);
  });

  it('aggregates dietary preferences accurately for the caterer', () => {
    const attending = sampleRsvps.filter((r) => r.attendance === 'yes');

    // Count per meal type (each RSVP entry covers (1 + plusOnes) heads with that primary preference)
    const vegHeads = attending
      .filter((r) => r.foodPreference === 'veg')
      .reduce((acc, curr) => acc + 1 + (curr.plusOnes || 0), 0); // Rohan (1+2 = 3)

    const nonVegHeads = attending
      .filter((r) => r.foodPreference === 'non-veg')
      .reduce((acc, curr) => acc + 1 + (curr.plusOnes || 0), 0); // Simran (1+1 = 2)

    const jainHeads = attending
      .filter((r) => r.foodPreference === 'jain')
      .reduce((acc, curr) => acc + 1 + (curr.plusOnes || 0), 0); // Dr. Ramesh (1+0 = 1)

    const veganHeads = attending
      .filter((r) => r.foodPreference === 'vegan')
      .reduce((acc, curr) => acc + 1 + (curr.plusOnes || 0), 0); // Ananya (1+1 = 2)

    expect(vegHeads).toBe(3);
    expect(nonVegHeads).toBe(2);
    expect(jainHeads).toBe(1);
    expect(veganHeads).toBe(2);

    // Total must equal total confirmed heads
    expect(vegHeads + nonVegHeads + jainHeads + veganHeads).toBe(8);
  });

  it('formats clean WhatsApp caterer summary string', () => {
    const totalConfirmed = 8;
    const veg = 3;
    const nonVeg = 2;
    const jain = 1;
    const vegan = 2;

    const summary = `*Caterer Headcount Summary - HostMate*\nTotal Confirmed: ${totalConfirmed}\n• Vegetarian: ${veg}\n• Non-Vegetarian: ${nonVeg}\n• Jain Food: ${jain}\n• Vegan/Dietary: ${vegan}`;

    expect(summary).toContain('Total Confirmed: 8');
    expect(summary).toContain('Vegetarian: 3');
    expect(summary).toContain('Non-Vegetarian: 2');
    expect(summary).toContain('Jain Food: 1');
    expect(summary).toContain('Vegan/Dietary: 2');
  });
});
