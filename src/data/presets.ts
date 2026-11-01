import { BudgetCategory, ChecklistTask, EventType, RunSheetItem, Vendor } from '../types';

export interface EventPreset {
  type: EventType;
  title: string;
  titleHi: string;
  defaultGuestCount: number;
  defaultBudget: number;
  budgetCapSplits: {
    name: string;
    nameHi: string;
    pct: number;
    notes?: string;
  }[];
  tasks: {
    title: string;
    titleHi: string;
    phase: 'early' | 'mid' | 'final';
    assignedTo?: string;
  }[];
  runSheet: {
    time: string;
    activity: string;
    activityHi: string;
    leadPerson: string;
    isCritical?: boolean;
    notes?: string;
  }[];
  sampleVendors: Omit<Vendor, 'id' | 'documents'>[];
}

export const EVENT_PRESETS: Record<EventType, EventPreset> = {
  wedding: {
    type: 'wedding',
    title: "Aarav & Priya's Wedding",
    titleHi: 'आरव और प्रिया का विवाह',
    defaultGuestCount: 250,
    defaultBudget: 1500000,
    budgetCapSplits: [
      { name: 'Catering & Beverages', nameHi: 'खान-पान और पेय', pct: 40, notes: 'Includes welcome drinks, main banquet, late snacks' },
      { name: 'Venue & Lawns', nameHi: 'स्थान व मंडप', pct: 25, notes: 'Main marriage hall, guest rooms, electricity' },
      { name: 'Decor, Stage & Florals', nameHi: 'सजावट व पुष्प', pct: 15, notes: 'Mandap, entrance floral arch, lighting' },
      { name: 'Photography & Cinematography', nameHi: 'फ़ोटोग्राफ़ी और वीडियोग्राफ़ी', pct: 10, notes: 'Traditional + candid photographers, drone' },
      { name: 'Buffer & Contingency', nameHi: 'आपातकालीन रिज़र्व / बफ़र', pct: 10, notes: 'Last minute additions, gratuities, unexpected counts' },
    ],
    tasks: [
      // Early Phase
      { title: 'Lock wedding venue and secure contract', titleHi: 'विवाह स्थल बुक करें और अनुबंध सुरक्षित करें', phase: 'early', assignedTo: 'Host / Elder' },
      { title: 'Finalize catering menu and food tasting session', titleHi: 'केटरिंग मेनू तय करें और फूड टेस्टिंग करें', phase: 'early', assignedTo: 'Catering Lead' },
      { title: 'Book lead photographer & cinematography team', titleHi: 'फ़ोटोग्राफ़र और वीडियोग्राफ़ी टीम बुक करें', phase: 'early', assignedTo: 'Couple' },
      { title: 'Prepare preliminary guest count & contact directory', titleHi: 'अतिथियों की प्रारंभिक सूची व संपर्क तैयार करें', phase: 'early', assignedTo: 'Host' },
      // Mid Phase
      { title: 'Design and dispatch WhatsApp digital invites with RSVP link', titleHi: 'व्हाट्सएप डिजिटल आमंत्रण RSVP लिंक के साथ भेजें', phase: 'mid', assignedTo: 'Host / Digital' },
      { title: 'Finalize bridal & groom outfits with tailoring buffer', titleHi: 'वर-वधू के परिधान व फिटिंग फाइनल करें', phase: 'mid', assignedTo: 'Couple' },
      { title: 'Book DJ, sound system and wedding band', titleHi: 'डीजे, साउंड सिस्टम और बैंड बुक करें', phase: 'mid', assignedTo: 'Music Coordinator' },
      { title: 'Review floral & mandap theme mockup with decorator', titleHi: 'मंडप व फूलों की सजावट का मॉकअप फाइनल करें', phase: 'mid', assignedTo: 'Decor Lead' },
      // Final Week
      { title: 'Collect final RSVP headcount and freeze Veg/Non-Veg tally', titleHi: 'अंतिम RSVP संख्या लें और वेज/नॉन-वेज काउंट फ्रीज करें', phase: 'final', assignedTo: 'Host' },
      { title: 'Conduct confirmation calls with all primary vendors', titleHi: 'सभी मुख्य वेंडरों के साथ पुष्टि कॉल करें', phase: 'final', assignedTo: 'Coordinator' },
      { title: 'Prepare cash/cheques for advance balance settlements', titleHi: 'वेंडर्स के अंतिम भुगतान की व्यवस्था करें', phase: 'final', assignedTo: 'Finance Elder' },
      { title: 'Print Day-Of Run Sheet and distribute to core team', titleHi: 'डे-ऑफ रन शीट प्रिंट करें और टीम को सौंपें', phase: 'final', assignedTo: 'Coordinator' },
    ],
    runSheet: [
      { time: '07:30 AM', activity: 'Venue handover & decorator floral setup begins', activityHi: 'स्थल हैंडओवर व सजावट कार्य प्रारंभ', leadPerson: 'Venue Manager & Decorator', isCritical: true },
      { time: '09:00 AM', activity: 'Sound check & DJ equipment acoustic test', activityHi: 'साउंड चेक और डीजे ऑडियो परीक्षण', leadPerson: 'DJ lead', notes: 'Verify wireless mics for stage' },
      { time: '10:30 AM', activity: 'Catering team live counters set & breakfast ready', activityHi: 'केटरिंग काउंटर व नाश्ता व्यवस्था पूर्ण', leadPerson: 'Caterer Captain', isCritical: true },
      { time: '11:00 AM', activity: 'Guest arrival & welcome refreshment drinks', activityHi: 'अतिथियों का आगमन व स्वागत पेय', leadPerson: 'Host Family', notes: 'Keep RSVP registration desk active' },
      { time: '12:30 PM', activity: 'Baraat procession & grand couple entrance', activityHi: 'बारात आगमन व मुख्य प्रवेश', leadPerson: 'Event Emcee & Band', isCritical: true },
      { time: '01:30 PM', activity: 'Varmala / Exchange of rings ceremony on stage', activityHi: 'वरमाला / रिंग सेरेमनी', leadPerson: 'Lead Coordinator' },
      { time: '02:00 PM', activity: 'Grand banquet lunch opened for all guests', activityHi: 'शाही भोज व भोजन प्रारंभ', leadPerson: 'Catering Captain', notes: 'Check VIP and dietary tables' },
      { time: '04:30 PM', activity: 'Family photo sessions & token gift distribution', activityHi: 'पारिवारिक फ़ोटो सेशन व उपहार वितरण', leadPerson: 'Photographer' },
      { time: '06:00 PM', activity: 'Pheras / traditional main ritual', activityHi: 'मुख्य फेरे व रीति-रिवाज', leadPerson: 'Priest / Family', isCritical: true },
    ],
    sampleVendors: [
      {
        name: 'Royal Palace Banquet & Lawns',
        category: 'venue',
        phone: '+91 98765 43210',
        agreedPrice: 375000,
        advancePaid: 150000,
        balanceDueDate: '2026-11-10',
        status: 'booked',
        deliverables: 'Main AC hall + lawn for 300 pax, 4 green rooms, generator backup',
        notes: 'Sound curfew 10:00 PM strict',
      },
      {
        name: 'Annapurna Gourmet Caterers',
        category: 'catering',
        phone: '+91 98111 22334',
        agreedPrice: 550000,
        advancePaid: 200000,
        balanceDueDate: '2026-11-14',
        status: 'booked',
        deliverables: 'Live chaat, 4 starters, 8 main course dishes, 3 desserts, 250 plates',
        notes: 'Requested 180 Veg, 70 Non-Veg buffer',
      },
      {
        name: 'Utsav Floral & Stage Stylists',
        category: 'decor',
        phone: '+91 98222 33445',
        agreedPrice: 210000,
        advancePaid: 75000,
        balanceDueDate: '2026-11-12',
        status: 'booked',
        deliverables: 'Mandap draping, entrance marigold arch, stage sofa backdrop, 25 table centerpieces',
      },
      {
        name: 'LensCraft Moments Studio',
        category: 'photography',
        phone: '+91 98333 44556',
        agreedPrice: 140000,
        advancePaid: 50000,
        balanceDueDate: '2026-11-15',
        status: 'booked',
        deliverables: '2 candid, 1 traditional photographer, 1 cinematic drone operator, teaser reel + album',
      },
    ],
  },

  birthday: {
    type: 'birthday',
    title: "Rohan's Milestone 30th Birthday",
    titleHi: 'रोहन का 30वां जन्मदिन',
    defaultGuestCount: 60,
    defaultBudget: 150000,
    budgetCapSplits: [
      { name: 'Food & Appetizers', nameHi: 'भोजन व स्टार्टर्स', pct: 35, notes: 'Finger foods, appetizers, main dinner' },
      { name: 'Venue / Lounge Rental', nameHi: 'स्थान / लाउंज किराया', pct: 20, notes: 'Private terrace or party hall' },
      { name: 'DJ, Sound & Lights', nameHi: 'डीजे, साउंड और लाइट्स', pct: 15, notes: 'Sound equipment, party playlist, mood lighting' },
      { name: 'Custom Cake & Desserts', nameHi: 'कस्टम केक व मिठाई', pct: 10, notes: 'Theme tiered cake, dessert jars' },
      { name: 'Decor, Photo Backdrop & Props', nameHi: 'सजावट, फ़ोटो बूथ व प्रॉप्स', pct: 10, notes: 'Balloon garland, neon signage, polaroid booth' },
      { name: 'Buffer / Party Favors', nameHi: 'बफ़र / रिटर्न गिफ़्ट', pct: 10, notes: 'Extra drinks, sudden plus-ones, favors' },
    ],
    tasks: [
      { title: 'Reserve party lounge / rooftop space', titleHi: 'पार्टी लाउंज या रूफटॉप वेन्यू बुक करें', phase: 'early', assignedTo: 'Organizer' },
      { title: 'Confirm party theme and color palette', titleHi: 'पार्टी थीम व कलर पैलेट तय करें', phase: 'early', assignedTo: 'Organizer' },
      { title: 'Order custom designer theme cake', titleHi: 'कस्टम थीम केक का आर्डर दें', phase: 'mid', assignedTo: 'Best Friend' },
      { title: 'Send WhatsApp RSVP link to friends & family', titleHi: 'व्हाट्सएप RSVP लिंक दोस्तों को शेयर करें', phase: 'mid', assignedTo: 'Organizer' },
      { title: 'Book DJ or curate high-energy crowd playlist', titleHi: 'डीजे बुक करें या पार्टी प्लेलिस्ट तैयार करें', phase: 'mid', assignedTo: 'Music Pal' },
      { title: 'Assemble DIY photo booth props & polaroid camera', titleHi: 'फ़ोटो बूथ प्रॉप्स व पोलेरॉइड कैमरा इकट्ठा करें', phase: 'final', assignedTo: 'Sibling' },
      { title: 'Share final headcounts with lounge bartender & kitchen', titleHi: 'लाउंज व किचन को अंतिम गेस्ट संख्या भेजें', phase: 'final', assignedTo: 'Organizer' },
      { title: 'Confirm cake delivery slot & storage cooler', titleHi: 'केक डिलीवरी समय व फ्रिज स्टोरेज सुनिश्चित करें', phase: 'final', assignedTo: 'Cake Lead' },
    ],
    runSheet: [
      { time: '04:00 PM', activity: 'Venue access & balloon garland setup', activityHi: 'वेन्यू में प्रवेश व बैलून डेकोरेशन शुरू', leadPerson: 'Decorator / Friends' },
      { time: '05:30 PM', activity: 'Cake delivered and stored in temperature control', activityHi: 'केक डिलीवरी व सुरक्षित स्टोरेज', leadPerson: 'Organizer', isCritical: true },
      { time: '06:30 PM', activity: 'DJ sound check and playlist queue', activityHi: 'डीजे साउंड चेक व वार्म-अप संगीत', leadPerson: 'DJ' },
      { time: '07:00 PM', activity: 'Doors open & welcome drinks served', activityHi: 'अतिथियों का स्वागत व वेलकम ड्रिंक्स', leadPerson: 'Host' },
      { time: '08:30 PM', activity: 'Trivia game & birthday surprise video screening', activityHi: 'सरप्राइज वीडियो व मजेदार गेम', leadPerson: 'Emcee / Best Friend' },
      { time: '09:15 PM', activity: 'Grand cake cutting & toast', activityHi: 'भव्य केक कटिंग व टोस्ट', leadPerson: 'Birthday Star & Host', isCritical: true },
      { time: '09:45 PM', activity: 'Dinner buffet & open dance floor', activityHi: 'डिनर बुफे व डांस फ्लोर शुरू', leadPerson: 'Lounge Captain' },
      { time: '11:30 PM', activity: 'Wrap up, bill settlement & return favors', activityHi: 'समापन, बिल सेटलमेंट व रिटर्न गिफ़्ट', leadPerson: 'Organizer' },
    ],
    sampleVendors: [
      {
        name: 'Skyline Terrace Lounge',
        category: 'venue',
        phone: '+91 99887 76655',
        agreedPrice: 32000,
        advancePaid: 15000,
        balanceDueDate: '2026-11-05',
        status: 'booked',
        deliverables: 'Rooftop private deck for 60 guests, dedicated servers',
      },
      {
        name: 'Sweet Artistry Patisserie',
        category: 'cake',
        phone: '+91 99112 23344',
        agreedPrice: 12000,
        advancePaid: 6000,
        balanceDueDate: '2026-11-04',
        status: 'booked',
        deliverables: '3kg Dark Chocolate Truffle customized 30th themed cake with macarons',
      },
      {
        name: 'Beats & Bass DJ Services',
        category: 'music',
        phone: '+91 99223 34455',
        agreedPrice: 18000,
        advancePaid: 8000,
        balanceDueDate: '2026-11-05',
        status: 'booked',
        deliverables: 'DJ console, 2 subwoofers, 4 moving head party lights, 5 hours play',
      },
    ],
  },

  community: {
    type: 'community',
    title: 'Greenwood Diwali Community Gala',
    titleHi: 'ग्रीनवुड दिवाली सामुदायिक उत्सव',
    defaultGuestCount: 350,
    defaultBudget: 450000,
    budgetCapSplits: [
      { name: 'Catering, Snacks & Stalls', nameHi: 'केटरिंग, स्नैक्स व स्टॉल', pct: 30, notes: 'Food counters, tea/coffee, dinner boxes' },
      { name: 'Venue, Permissions & Sanitation', nameHi: 'स्थल, अनुमति व स्वच्छता', pct: 25, notes: 'Clubhouse grounds, municipality NOC, waste bins' },
      { name: 'Stage, Sound & LED Backdrop', nameHi: 'मंच, साउंड व एलईडी स्क्रीन', pct: 20, notes: 'Covered stage, wireless mics, spotlights' },
      { name: 'Print, Banners & Mementos', nameHi: 'बैनर, प्रिंटिंग व स्मृति चिन्ह', pct: 10, notes: 'Standees, volunteer badges, guest mementos' },
      { name: 'Safety, First Aid & Security', nameHi: 'सुरक्षा, प्राथमिक चिकित्सा', pct: 5, notes: 'Security guards, parking marshals, fire extinguishers' },
      { name: 'Buffer / Contingency', nameHi: 'आपातकालीन बफ़र', pct: 10, notes: 'Power generator fuel, weather backup' },
    ],
    tasks: [
      { title: 'Secure society board NOC and police sound permission', titleHi: 'सोसाइटी बोर्ड अनुमति व लाउडस्पीकर परमिशन लें', phase: 'early', assignedTo: 'Committee Secretary' },
      { title: 'Book staging and PA audio system vendor', titleHi: 'स्टेज व साउंड सिस्टम वेंडर बुक करें', phase: 'early', assignedTo: 'Tech Team' },
      { title: 'Launch community WhatsApp RSVP registration campaign', titleHi: 'व्हाट्सएप पर सोसाइटी RSVP रजिस्ट्रेशन शुरू करें', phase: 'mid', assignedTo: 'PR Coordinator' },
      { title: 'Audition society kids & talent for cultural performances', titleHi: 'सांस्कृतिक कार्यक्रमों के लिए बच्चों का अभ्यास', phase: 'mid', assignedTo: 'Cultural Head' },
      { title: 'Lock food stall menus and verify hygiene certs', titleHi: 'फूड स्टॉल मेनू व स्वच्छता नियम तय करें', phase: 'mid', assignedTo: 'Food Lead' },
      { title: 'Distribute volunteer badges and assign zone leads', titleHi: 'स्वयंसेवक बैज बांटें व जिम्मेदारी सौंपें', phase: 'final', assignedTo: 'Event Head' },
      { title: 'Inspect generator backup and emergency fire points', titleHi: 'जनरेटर बैकअप व आपातकालीन सुरक्षा जांचें', phase: 'final', assignedTo: 'Facility Manager' },
      { title: 'Print master run sheet for backstage coordinators', titleHi: 'बैकस्टेज टीम के लिए रन शीट प्रिंट करें', phase: 'final', assignedTo: 'Secretary' },
    ],
    runSheet: [
      { time: '08:00 AM', activity: 'Ground barricading & stall allocation', activityHi: 'मैदान व्यवस्था व स्टॉल आवंटन', leadPerson: 'Operations Team' },
      { time: '11:00 AM', activity: 'Stage assembly & LED screen test', activityHi: 'मंच निर्माण व एलईडी स्क्रीन टेस्ट', leadPerson: 'Stage Vendor', isCritical: true },
      { time: '03:00 PM', activity: 'Food stalls setup and electrical load check', activityHi: 'फूड स्टॉल इंस्टालेशन व बिजली जांच', leadPerson: 'Electrical Lead' },
      { time: '04:30 PM', activity: 'Gates open, Rangoli & diya lighting competition', activityHi: 'प्रवेश द्वार खुला, रंगोली व दीया प्रतियोगिता', leadPerson: 'Volunteers' },
      { time: '06:00 PM', activity: 'President welcome speech & lamp lighting', activityHi: 'अध्यक्षीय स्वागत व दीप प्रज्ज्वलन', leadPerson: 'RWA President', isCritical: true },
      { time: '06:30 PM', activity: 'Children dance & cultural performances', activityHi: 'बच्चों के सांस्कृतिक नृत्य कार्यक्रम', leadPerson: 'Cultural Secretary' },
      { time: '08:00 PM', activity: 'Community dinner counters opened', activityHi: 'सामुदायिक प्रीतिभोज प्रारंभ', leadPerson: 'Catering Lead' },
      { time: '09:30 PM', activity: 'Prize distribution ceremony & memento honors', activityHi: 'पुरस्कार वितरण व सम्मान समारोह', leadPerson: 'Committee' },
      { time: '10:30 PM', activity: 'Eco-friendly fireworks / laser show & national anthem', activityHi: 'लेज़र शो व राष्ट्रगान के साथ समापन', leadPerson: 'Event Head' },
    ],
    sampleVendors: [
      {
        name: 'Acoustic Waves Stage & Sound',
        category: 'music',
        phone: '+91 97654 32109',
        agreedPrice: 85000,
        advancePaid: 35000,
        balanceDueDate: '2026-11-01',
        status: 'booked',
        deliverables: '30x20 ft covered stage, line-array speakers, 6 wireless lapels, LED wall',
      },
      {
        name: 'Shree Krishna Community Kitchens',
        category: 'catering',
        phone: '+91 97123 45678',
        agreedPrice: 135000,
        advancePaid: 50000,
        balanceDueDate: '2026-11-01',
        status: 'booked',
        deliverables: 'Dinner for 350 residents with hot sweets & tea stations',
      },
    ],
  },

  other: {
    type: 'other',
    title: 'Special Milestone Celebration',
    titleHi: 'विशेष उत्सव समारोह',
    defaultGuestCount: 100,
    defaultBudget: 250000,
    budgetCapSplits: [
      { name: 'Catering & Dining', nameHi: 'खान-पान व डाइनिंग', pct: 40 },
      { name: 'Venue Rental', nameHi: 'स्थान किराया', pct: 25 },
      { name: 'Decor & Ambience', nameHi: 'सजावट व परिवेश', pct: 15 },
      { name: 'Media & Entertainment', nameHi: 'मनोरंजन व मीडिया', pct: 10 },
      { name: 'Contingency / Buffer', nameHi: 'बफ़र / आकस्मिक खर्च', pct: 10 },
    ],
    tasks: [
      { title: 'Select and secure venue contract', titleHi: 'वेन्यू तय करें व अनुबंध साइन करें', phase: 'early', assignedTo: 'Organizer' },
      { title: 'Finalize attendee invitation draft', titleHi: 'आमंत्रण पत्र का ड्राफ्ट तैयार करें', phase: 'early', assignedTo: 'Organizer' },
      { title: 'Send WhatsApp RSVP invitations', titleHi: 'व्हाट्सएप पर RSVP इनवाइट भेजें', phase: 'mid', assignedTo: 'Organizer' },
      { title: 'Book key vendors & pay booking advance', titleHi: 'मुख्य वेंडर तय करें व एडवांस भुगतान करें', phase: 'mid', assignedTo: 'Treasurer' },
      { title: 'Finalize event run sheet and logistics', titleHi: 'इवेंट रन शीट व व्यवस्था फाइनल करें', phase: 'final', assignedTo: 'Coordinator' },
      { title: 'Verify guest counts and catering tally', titleHi: 'गेस्ट काउंट व केटरिंग संख्या सत्यापित करें', phase: 'final', assignedTo: 'Organizer' },
    ],
    runSheet: [
      { time: '09:00 AM', activity: 'Setup & equipment load-in', activityHi: 'वेन्यू तैयारी व उपकरण आगमन', leadPerson: 'Coordinator' },
      { time: '11:00 AM', activity: 'Welcome & opening remarks', activityHi: 'स्वागत व आरंभिक संबोधन', leadPerson: 'Host' },
      { time: '01:00 PM', activity: 'Buffet meal & networking', activityHi: 'भोजन व संवाद', leadPerson: 'Caterer' },
      { time: '03:30 PM', activity: 'Wrap up and closing', activityHi: 'समापन व धन्यवाद', leadPerson: 'Host' },
    ],
    sampleVendors: [],
  },
};

export function createInitialEvent(presetType: EventType, customTitle?: string, customDate?: string, customBudget?: number, customGuests?: number, currency: any = '₹'): any {
  const preset = EVENT_PRESETS[presetType] || EVENT_PRESETS.wedding;
  const budget = customBudget || preset.defaultBudget;

  const budgetItems: BudgetCategory[] = preset.budgetCapSplits.map((item, index) => {
    const recommendedCap = Math.round((budget * item.pct) / 100);
    return {
      id: `budget-${index + 1}`,
      name: item.name,
      nameHi: item.nameHi,
      recommendedPct: item.pct,
      estimatedCost: recommendedCap,
      actualCost: Math.round(recommendedCap * 0.9), // realistic initial estimate
      advancePaid: Math.round(recommendedCap * 0.4),
      dueDate: customDate || '2026-11-15',
      notes: item.notes || '',
    };
  });

  const tasks: ChecklistTask[] = preset.tasks.map((task, index) => ({
    id: `task-${index + 1}`,
    title: task.title,
    titleHi: task.titleHi,
    phase: task.phase,
    completed: index === 0, // first task pre-checked for momentum
    assignedTo: task.assignedTo,
    dueDate: customDate || '2026-11-15',
  }));

  const runSheet: RunSheetItem[] = preset.runSheet.map((item, index) => ({
    id: `run-${index + 1}`,
    time: item.time,
    activity: item.activity,
    activityHi: item.activityHi,
    leadPerson: item.leadPerson,
    isCritical: item.isCritical,
    notes: item.notes,
  }));

  const sampleVendors: Vendor[] = preset.sampleVendors.map((v, index) => ({
    ...v,
    id: `vendor-${index + 1}`,
    documents: [
      {
        id: `doc-${index + 1}`,
        name: `${v.name}_Contract_Summary.pdf`,
        fileType: 'pdf',
        dataUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og...[sample_pdf_preview]',
        uploadDate: '2026-10-20',
        sizeKb: 245,
      },
    ],
  }));

  const sampleRsvps = [
    {
      id: 'rsvp-1',
      name: 'Vikram Malhotra & Family',
      phone: '+91 98201 12345',
      attendance: 'yes' as const,
      plusOnes: 2,
      foodPreference: 'veg' as const,
      dietaryNotes: '1 Jain meal preference for grandfather',
      wishes: 'Heartiest congratulations! Looking forward to celebrating!',
      submittedAt: '2026-10-24 14:32',
    },
    {
      id: 'rsvp-2',
      name: 'Ananya Sharma',
      phone: '+91 98334 98765',
      attendance: 'yes' as const,
      plusOnes: 1,
      foodPreference: 'non-veg' as const,
      dietaryNotes: '',
      wishes: 'So thrilled for you both! Can not wait!',
      submittedAt: '2026-10-25 09:15',
    },
    {
      id: 'rsvp-3',
      name: 'Dr. Ramesh Gupta',
      phone: '+91 99100 55443',
      attendance: 'yes' as const,
      plusOnes: 0,
      foodPreference: 'jain' as const,
      dietaryNotes: 'Strict Jain preparation please',
      wishes: 'Blessings to the family!',
      submittedAt: '2026-10-25 18:20',
    },
    {
      id: 'rsvp-4',
      name: 'Sunil Verma',
      phone: '+91 98711 00223',
      attendance: 'no' as const,
      plusOnes: 0,
      foodPreference: 'veg' as const,
      dietaryNotes: '',
      wishes: 'Traveling abroad for work, sending warmest blessings!',
      submittedAt: '2026-10-26 08:00',
    },
  ];

  const sampleSubEvents = [
    {
      id: 'sub-1',
      name: 'Haldi & Mehndi Ceremony',
      nameHi: 'हल्दी व मेहंदी उत्सव',
      date: customDate || '2026-11-19',
      startTime: '10:30 AM',
      endTime: '01:30 PM',
      venue: 'Heritage Courtyard Lawn',
      dressCode: 'Bright Yellows, Mustards & Floral Kurtas',
      allocatedBudget: Math.round(budget * 0.12),
      actualCost: Math.round(budget * 0.11),
      invitedGuestIds: ['rsvp-1', 'rsvp-2', 'rsvp-3'],
      description: 'Marigold petal shower, organic turmeric paste ritual, live dhol and dholki folk songs.',
    },
    {
      id: 'sub-2',
      name: 'Sangeet & Cocktail Night',
      nameHi: 'संगीत व कॉकटेल संध्या',
      date: customDate || '2026-11-19',
      startTime: '07:00 PM',
      endTime: '11:30 PM',
      venue: 'Crystal Grand Ballroom',
      dressCode: 'Glitz & Glam Indo-Western / Cocktail Lehengas',
      allocatedBudget: Math.round(budget * 0.25),
      actualCost: Math.round(budget * 0.24),
      invitedGuestIds: ['rsvp-1', 'rsvp-2', 'rsvp-3'],
      description: 'Family dance showdown, LED stage with cold pyro, signature cocktails and chaat counters.',
    },
    {
      id: 'sub-3',
      name: 'Varmala & Wedding Pheras',
      nameHi: 'वरमाला व फेरे (मुख्य विवाह)',
      date: customDate || '2026-11-20',
      startTime: '11:00 AM',
      endTime: '04:00 PM',
      venue: 'Royal Mandap Pavilion',
      dressCode: 'Traditional Festive Pastels & Silk Sherwanis',
      allocatedBudget: Math.round(budget * 0.45),
      actualCost: Math.round(budget * 0.44),
      invitedGuestIds: ['rsvp-1', 'rsvp-2', 'rsvp-3'],
      description: 'Grand baraat procession, holy Vedic sacred vows, varmala exchange, and lavish sit-down thali lunch.',
    },
    {
      id: 'sub-4',
      name: 'Grand Gala Reception',
      nameHi: 'भव्य रिसेप्शन उत्सव',
      date: customDate || '2026-11-20',
      startTime: '07:30 PM',
      endTime: '11:00 PM',
      venue: 'Palace Gardens Amphitheatre',
      dressCode: 'Formal Black Tie Tuxedos & Banarasi Sarees',
      allocatedBudget: Math.round(budget * 0.18),
      actualCost: Math.round(budget * 0.16),
      invitedGuestIds: ['rsvp-1', 'rsvp-2', 'rsvp-3', 'rsvp-4'],
      description: 'Live saxophone quartet, couple felicitation, photo wall, champagne toast, and international dessert buffet.',
    },
  ];

  const sampleTables = [
    {
      id: 'tbl-1',
      name: 'Table 1: Groom Family VIP',
      shape: 'round' as const,
      capacity: 8,
      x: 120,
      y: 90,
      assignedGuestIds: ['rsvp-1'],
      category: 'vip' as const,
      notes: 'Front row facing the stage, needs prompt hot appetizers',
    },
    {
      id: 'tbl-2',
      name: 'Table 2: College Friends & Cousins',
      shape: 'rectangular' as const,
      capacity: 10,
      x: 400,
      y: 90,
      assignedGuestIds: ['rsvp-2'],
      category: 'friends' as const,
      notes: 'Near the DJ & mocktail bar counter',
    },
    {
      id: 'tbl-3',
      name: 'Table 3: Dignitaries & Jain Elders',
      shape: 'round' as const,
      capacity: 6,
      x: 120,
      y: 280,
      assignedGuestIds: ['rsvp-3'],
      category: 'family' as const,
      notes: 'Strict pure Jain service; quiet zone away from speakers',
    },
    {
      id: 'tbl-4',
      name: 'Table 4: High Table (Couple & Parents)',
      shape: 'head' as const,
      capacity: 6,
      x: 400,
      y: 280,
      assignedGuestIds: [],
      category: 'vip' as const,
      notes: 'Elevated floral centerpiece table',
    },
  ];

  const samplePhotos = [
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      caption: 'The magical varmala stage with cold pyros and rose petals! ✨💍',
      uploadedBy: 'Sneha (Bridesmaid)',
      timestamp: '2 hours ago',
      likes: 42,
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      caption: 'Haldi happiness! Yellow vibe all around 💛🌻',
      uploadedBy: 'Rohit K.',
      timestamp: '3 hours ago',
      likes: 28,
    },
    {
      id: 'photo-3',
      url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
      caption: 'Sangeet flashmob rocked the floor tonight! 💃🕺',
      uploadedBy: 'Kabir & Cousins',
      timestamp: '5 hours ago',
      likes: 35,
    },
  ];

  const sampleGifts = [
    {
      id: 'gift-1',
      guestId: 'rsvp-1',
      guestName: 'Vikram Malhotra & Family',
      type: 'cash' as const,
      amount: 5100,
      itemDescription: 'Shagun Lifafa (Gold Envelope with 1 rupee auspicious coin)',
      thankYouSent: true,
      thankYouMessage: 'Dear Vikram ji & Family, thank you for showering your blessings on our special day and for your generous shagun!',
      recordedAt: '2026-10-25 14:00',
    },
    {
      id: 'gift-2',
      guestId: 'rsvp-2',
      guestName: 'Ananya Sharma',
      type: 'physical' as const,
      amount: 3500,
      itemDescription: 'Carved Silver Puja Thali with Brass Diyas',
      thankYouSent: false,
      thankYouMessage: 'Dear Ananya, your exquisite silver thali is breathtaking! Thank you for being there for our celebration.',
      recordedAt: '2026-10-25 15:30',
    },
    {
      id: 'gift-3',
      guestId: 'rsvp-3',
      guestName: 'Dr. Ramesh Gupta',
      type: 'cash' as const,
      amount: 11000,
      itemDescription: 'Shagun Cheque & Blessings Card',
      thankYouSent: false,
      thankYouMessage: 'Dear Dr. Gupta, we are deeply grateful for your warm presence, blessings, and very kind gift.',
      recordedAt: '2026-10-25 18:00',
    },
  ];

  const sampleEcoStats = {
    adultsCount: Math.round((customGuests || preset.defaultGuestCount) * 0.75),
    childrenCount: Math.round((customGuests || preset.defaultGuestCount) * 0.15),
    seniorsCount: Math.round((customGuests || preset.defaultGuestCount) * 0.10),
    mealType: 'buffet' as const,
    estimatedFoodKg: Math.round((customGuests || preset.defaultGuestCount) * 0.55),
    plasticBottlesSaved: Math.round((customGuests || preset.defaultGuestCount) * 2.8),
    carbonOffsetKg: Math.round((customGuests || preset.defaultGuestCount) * 1.6),
    surplusPortions: 25,
    foodDonationRequested: false,
    foodDonationNgo: 'Robin Hood Army',
    foodDonationStatus: 'pending' as const,
  };

  const sampleProSettings = {
    isProEnabled: false,
    agencyName: 'Aura Event Architects',
    plannerName: 'Pooja Verma',
    agencyLogo: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=150&q=80',
    primaryColor: '#1c5340',
    contactEmail: 'pooja@auraevents.in',
    contactPhone: '+91 98111 22334',
    activeClientCount: 9,
    managedBudgetTotal: 18500000,
    customWatermark: false,
  };

  const samplePromotedVendors = [
    {
      id: 'pvd-1',
      name: 'Royal Heritage Palace & Lawns',
      category: 'venue' as const,
      rating: 4.9,
      reviewsCount: 142,
      startingPrice: 350000,
      commissionRatePct: 7,
      city: 'Delhi NCR / Gurugram',
      isFeatured: true,
      tagline: '5-star lush lawn estate with 800+ guest capacity & valet parking',
      phone: '+91 98100 88221',
      bookedLeadsCount: 14,
      earnedCommission: 245000,
    },
    {
      id: 'pvd-2',
      name: 'Spice Symphony Gourmet Catering',
      category: 'catering' as const,
      rating: 4.8,
      reviewsCount: 98,
      startingPrice: 1200,
      commissionRatePct: 6,
      city: 'Mumbai & Pune',
      isFeatured: true,
      tagline: 'Authentic 4-tier live chaat, Awadhi handis, Italian woodfire & dedicated Jain kitchens',
      phone: '+91 98200 44119',
      bookedLeadsCount: 11,
      earnedCommission: 180000,
    },
    {
      id: 'pvd-3',
      name: 'ShutterMagic Candid & Drone Studios',
      category: 'photography' as const,
      rating: 4.9,
      reviewsCount: 176,
      startingPrice: 120000,
      commissionRatePct: 8,
      city: 'Bangalore & Hyderabad',
      isFeatured: true,
      tagline: 'Award-winning wedding cinematographers & 4K cinematic reels in 48 hours',
      phone: '+91 99800 33221',
      bookedLeadsCount: 19,
      earnedCommission: 192000,
    },
    {
      id: 'pvd-4',
      name: 'Marigold & Crystal Mandap Artistry',
      category: 'decor' as const,
      rating: 4.7,
      reviewsCount: 84,
      startingPrice: 180000,
      commissionRatePct: 7,
      city: 'Jaipur & Udaipur',
      isFeatured: false,
      tagline: 'Eco-conscious floral installations, mirror stage concepts & pastel mandaps',
      phone: '+91 94140 11990',
      bookedLeadsCount: 8,
      earnedCommission: 112000,
    },
  ];

  return {
    id: `event-${Date.now()}`,
    title: customTitle || preset.title,
    type: presetType,
    date: customDate || '2026-11-20',
    currency: currency || '₹',
    totalBudget: budget,
    guestCount: customGuests || preset.defaultGuestCount,
    budgetItems,
    tasks,
    runSheet,
    rsvps: sampleRsvps,
    vendors: sampleVendors,
    subEvents: sampleSubEvents,
    tables: sampleTables,
    photos: samplePhotos,
    gifts: sampleGifts,
    ecoStats: sampleEcoStats,
    proSettings: sampleProSettings,
    promotedVendors: samplePromotedVendors,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
