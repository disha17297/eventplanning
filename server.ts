import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to safely strip Markdown code blocks before parsing JSON
function cleanAndParseJson(text: string): any {
  if (!text) return {};
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

// Helper to prevent hanging requests when external API is unreachable or slow
function withTimeout<T>(promise: Promise<T>, ms: number = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`AI generation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// Endpoint: AI Budget Optimization & Cost-Cutting Advice
app.post('/api/ai/budget-advice', async (req, res) => {
  const { eventType, budget, guestCount, currency, categories, lang } = req.body;
  const isHindi = lang === 'hi';

  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

  if (hasKey) {
    try {
      const prompt = `You are HostMate, an expert event financial planner and coordinator with the tagline "Budget fit, event hit!".
Event Details:
- Type: ${eventType}
- Total Budget: ${currency} ${budget}
- Guest Count: ${guestCount}
- Current Category Breakdown: ${JSON.stringify(categories)}
- Output Language: ${isHindi ? 'Hindi (Devanagari script)' : 'English'}

Provide an actionable, realistic financial review. Output valid JSON only with keys:
{
  "summary": "1-2 sentence overall financial health assessment",
  "recommendedTweaks": [
    {
      "category": "Category name",
      "adjustment": "+/- amount or tip",
      "rationale": "Reason why"
    }
  ],
  "costSavingHacks": [
    "Concrete actionable hack 1 (specific to this budget and guest count)",
    "Concrete actionable hack 2",
    "Concrete actionable hack 3"
  ],
  "hiddenCostsWarning": [
    "E.g., power backup, service gratuity, corkage, travel fees, cake cutting fees"
  ]
}`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        7000
      );

      const text = response.text;
      const parsed = cleanAndParseJson(text || '{}');
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.warn('Gemini API call failed, providing curated financial advice fallback:', error.message);
    }
  }

  // Curated Fallback
  const fallback = isHindi ? {
    summary: `आपके ${guestCount} मेहमानों और ${currency} ${Number(budget).toLocaleString('en-IN')} के बजट का विश्लेषण पूर्ण हुआ। केटरिंग और वेन्यू आवंटन संतुलित है।`,
    recommendedTweaks: [
      {
        category: 'Catering & Food',
        adjustment: '-5% से -8% बचत',
        rationale: 'मेनू में स्टार्टर्स की संख्या 6 से घटाकर 4 करें और मुख्य कोर्स में क्षेत्रीय विशिष्ट व्यंजनों को प्राथमिकता दें।'
      },
      {
        category: 'Decor & Floral',
        adjustment: 'पुनर्विभाजन',
        rationale: 'विदेशी आयातित फूलों के स्थान पर मौसमी गेंदा, रजनीगंधा और पीतल के दीपकों का प्रयोग करें।'
      }
    ],
    costSavingHacks: [
      'डिजिटल व्हाट्सएप RSVP के जरिए सटीक हेडकाउंट लेकर कैटरर को 48 घंटे पहले दें जिससे प्लेट वेस्टेज में 10-15% की बचत होगी।',
      'साउंड और लाइटिंग वेंडर से पैकेज डील में ही जनरेटर बैकअप शामिल करने की बातचीत करें।',
      'अग्रिम भुगतान की तारीखों को समयबद्ध रखें ताकि अंतिम समय का अधिभार न लगे।'
    ],
    hiddenCostsWarning: [
      'वेन्यू जनरेटर डीजल खर्च (लगभग ₹8,000 - ₹15,000 अतिरिक्त)',
      'केटरिंग सर्विस स्टाफ बख्शीश व टिपिंग पूल',
      'साउंड व डीजे परमिशन और रात्रि 10 बजे के बाद ओवर-टाइम शुल्क'
    ]
  } : {
    summary: `Financial review completed for ${guestCount} guests on a total cap of ${currency} ${Number(budget).toLocaleString('en-IN')}. Core allocations align with benchmark ratios.`,
    recommendedTweaks: [
      {
        category: 'Catering & Beverages',
        adjustment: '-5% to -8% Optimization',
        rationale: 'Streamline appetizer rotation to 4 high-demand live items rather than 8 stationary platters.'
      },
      {
        category: 'Decor & Florals',
        adjustment: 'Re-balance',
        rationale: 'Substitute off-season exotics with seasonal blooms, marigolds, fairy curtains, and warm uplighting.'
      }
    ],
    costSavingHacks: [
      'Use the WhatsApp RSVP live headcount to freeze final guest plate count 48h before the banquet, cutting plate wastage by 10-15%.',
      'Negotiate venue-bundled sound equipment rather than hiring third-party logistics.',
      'Schedule vendor advance settlements on milestones to keep liquidity in high-yield buffers.'
    ],
    hiddenCostsWarning: [
      'Heavy generator diesel consumption (est. ₹8,000 - ₹15,000)',
      'Service staff gratuity / tip pool expectations',
      'Overtime venue tariffs past 11:00 PM curfew'
    ]
  };

  return res.json({ success: true, data: fallback });
});

// Endpoint: AI Day-Of Run Sheet Generator
app.post('/api/ai/day-of-schedule', async (req, res) => {
  const { eventType, eventName, date, guestCount, startTime, specialRituals, lang } = req.body;
  const isHindi = lang === 'hi';

  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

  if (hasKey) {
    try {
      const prompt = `You are HostMate, an elite event coordinator.
Generate a high-precision, realistic Day-Of Chronological Run Sheet for:
- Event: ${eventName || eventType} (${eventType})
- Date: ${date}
- Guest Count: ${guestCount}
- Event Main Start Time: ${startTime || '11:00 AM'}
- Special Highlights/Rituals: ${specialRituals || 'Standard program'}
- Language: ${isHindi ? 'Hindi (Devanagari)' : 'English'}

Return valid JSON with:
{
  "theme": "Quick overview note",
  "timeline": [
    {
      "time": "e.g. 08:30 AM",
      "activity": "Activity name",
      "leadPerson": "e.g. Coordinator / Sibling / Decor Vendor",
      "notes": "Key watch-out or deliverable",
      "critical": boolean
    }
  ],
  "emergencyKitList": [
    "Item 1 (e.g. Safety pins, tape, phone chargers, printed vendor sheet)"
  ]
}`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        7000
      );

      const text = response.text;
      const parsed = cleanAndParseJson(text || '{}');
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.warn('Gemini API call failed, providing curated schedule fallback:', error.message);
    }
  }

  // Curated Fallback
  const fallback = {
    theme: isHindi ? 'समयबद्ध व व्यवस्थित उत्सव शेड्यूल' : 'On-Time Chronological Execution Run Sheet',
    timeline: [
      {
        time: '07:30 AM',
        activity: isHindi ? 'वेन्यू हैंडओवर व फूलों की सजावट प्रारंभ' : 'Venue handover & floral decorator setup begins',
        leadPerson: isHindi ? 'वेन्यू प्रबंधक व डेकोरेटर' : 'Venue Manager & Decor Lead',
        notes: isHindi ? 'मुख्य मंच और मंडप की जांच करें' : 'Verify stage lighting and entrance floral arch',
        critical: true
      },
      {
        time: '09:00 AM',
        activity: isHindi ? 'डीजे व ऑडियो सिस्टम साउंड चेक' : 'Audio & DJ sound check with wireless mics',
        leadPerson: isHindi ? 'साउंड कोऑर्डिनेटर' : 'DJ / Audio Lead',
        notes: isHindi ? 'माइक बैटरियां बदलें' : 'Ensure spare 9V batteries for wireless stage mics',
        critical: false
      },
      {
        time: '10:30 AM',
        activity: isHindi ? 'केटरिंग लाइव काउंटर व स्वागत पेय तैयार' : 'Live beverage counters & welcome refreshments ready',
        leadPerson: isHindi ? 'केटरिंग कैप्टन' : 'Catering Captain',
        notes: isHindi ? 'शुद्ध शाकाहारी व जैन काउंटर पृथक रखें' : 'Separate Jain & Veg counters clearly signposted',
        critical: true
      },
      {
        time: '11:00 AM',
        activity: isHindi ? 'अतिथियों का आगमन व स्वागत' : 'Guest arrival & welcome refreshment service',
        leadPerson: isHindi ? 'परिवार व स्वागत दल' : 'Host Family & Ushers',
        notes: isHindi ? 'RSVP डेस्क सक्रिय रखें' : 'Keep RSVP registry & gift counter manned',
        critical: false
      },
      {
        time: '12:30 PM',
        activity: isHindi ? 'भव्य मुख्य प्रवेश व सेरेमनी' : 'Grand couple / star entrance & main ceremony',
        leadPerson: isHindi ? 'मुख्य समन्वयक' : 'Lead Coordinator',
        notes: isHindi ? 'फ़ोटोग्राफ़र और कोल्ड-पायरो तैयार' : 'Coordinate cold-pyro sparklers with photographer',
        critical: true
      },
      {
        time: '01:30 PM',
        activity: isHindi ? 'शाही भोज व बुफे प्रारंभ' : 'Grand banquet buffet opened for all guests',
        leadPerson: isHindi ? 'केटरिंग कैप्टन' : 'Catering Captain',
        notes: isHindi ? 'बुफे लाइनों का सुचारू संचालन सुनिश्चित करें' : 'Ensure continuous replenishment of hot items',
        critical: true
      },
      {
        time: '03:30 PM',
        activity: isHindi ? 'पारिवारिक फ़ोटो सेशन व उपहार वितरण' : 'Family photo sessions & token favor distribution',
        leadPerson: isHindi ? 'फ़ोटोग्राफ़र व मित्र' : 'Lead Photographer & Sibling',
        notes: isHindi ? 'वरिष्ठ बुजुर्गों को प्राथमिकता दें' : 'Prioritize immediate elders for group portraits',
        critical: false
      },
      {
        time: '05:00 PM',
        activity: isHindi ? 'समापन, वेंडर सेटलमेंट व धन्यवाद' : 'Event wrap-up, final vendor settlements & departures',
        leadPerson: isHindi ? 'मुख्य आयोजक' : 'Primary Organizer',
        notes: isHindi ? 'रसीदें और बैलेंस भुगतान सुरक्षित करें' : 'Confirm signed receipts for advance balance payments',
        critical: true
      }
    ],
    emergencyKitList: [
      isHindi ? 'सुरक्षा पिन, फैब्रिक टेप और सिलाई किट' : 'Safety pins, clear fabric tape, and emergency stitch kit',
      isHindi ? 'मल्टीपल फोन चार्जर और पावर बैंक' : 'Universal phone chargers and high-capacity power banks',
      isHindi ? 'प्रिंटेड वेंडर डायरेक्टरी व इमरजेंसी संपर्क सूची' : 'Printed vendor contact directory and emergency contacts',
      isHindi ? 'वेंडर्स के लिए नकद लिफाफे' : 'Pre-counted cash envelopes for final balance payments'
    ]
  };

  return res.json({ success: true, data: fallback });
});

// Endpoint: AI Personalized Ideas & Themes
app.post('/api/ai/personalized-ideas', async (req, res) => {
  const { eventType, budget, guestCount, currency, preferences, customPrompt, lang } = req.body;
  const promptInput = preferences || customPrompt || 'Creative, elegant, memorable, cost-effective';
  const isHindi = lang === 'hi';

  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

  if (hasKey) {
    try {
      const prompt = `You are HostMate, a creative and budget-savvy event stylist ("Budget fit, event hit!").
Generate unique, high-impact ideas for:
- Event Type: ${eventType}
- Budget: ${currency} ${budget}
- Guests: ${guestCount}
- Host Preferences: ${promptInput}
- Language: ${isHindi ? 'Hindi' : 'English'}

Return JSON matching:
{
  "themeName": "Catchy concept title",
  "decorIdeas": [
    { "title": "Idea title", "description": "How to execute affordably", "estimatedCostTier": "Low / Moderate" }
  ],
  "entertainmentIdeas": [
    { "title": "Idea title", "description": "Engaging activity or icebreaker" }
  ],
  "foodDrinkIdeas": [
    { "title": "Menu twist / live counter", "description": "Crowd-pleaser without high cost" }
  ],
  "hostTip": "One golden insider tip for stress-free hosting"
}`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        7000
      );

      const text = response.text;
      const parsed = cleanAndParseJson(text || '{}');
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.warn('Gemini API call failed, providing curated ideas fallback:', error.message);
    }
  }

  // Curated Fallback
  const fallback = isHindi ? {
    themeName: 'रॉयल हेरिटेज विथ मॉडर्न मिनिमलिज्म',
    decorIdeas: [
      {
        title: 'पीतल के उरुली व तैरती मोमबत्तियां',
        description: 'प्रवेश द्वार पर ताजे गेंदे की पंखुड़ियों और सुगंधित मोमबत्तियों से सजा पारंपरिक उरुली बर्तन।',
        estimatedCostTier: 'Low'
      },
      {
        title: 'फेयरी लाइट कैनोपी व मोगरा कर्टन',
        description: 'महंगी कृत्रिम संरचनाओं के बजाय गर्म सफेद फेयरी लाइट्स और असली मोगरे की लड़ियों का बैकड्रॉप।',
        estimatedCostTier: 'Moderate'
      }
    ],
    entertainmentIdeas: [
      {
        title: 'इंटरएक्टिव लाइव ढोल व फन क्विज',
        description: 'परिवार के सदस्यों के साथ मजेदार किस्सों और लाइव ढोल बीट्स के साथ मेहमानों का उत्साह बढ़ाएं।'
      }
    ],
    foodDrinkIdeas: [
      {
        title: 'लाइव कुल्हड़ मसाला चाय व मिनी चाट लाउंज',
        description: 'पारंपरिक मिट्टी के कुल्हड़ में चाय और गरम जलेबी-रबड़ी का लाइव काउंटर जो हर मेहमान को भाए।'
      }
    ],
    hostTip: 'इवेंट के दिन एक मुख्य मित्र को कोऑर्डिनेटर बनाएं ताकि आप और आपका परिवार उत्सव का पूरा आनंद ले सके।'
  } : {
    themeName: 'Royal Heritage with Modern Minimalism',
    decorIdeas: [
      {
        title: 'Brass Urulis with Floating Diyas',
        description: 'Place traditional polished brass vessels with fresh marigold petals and floating tealights at entrances for an instant regal ambiance.',
        estimatedCostTier: 'Low'
      },
      {
        title: 'Warm Fairy Light Canopy with Tuberose Strings',
        description: 'Drape cascading fairy lights intermingled with fragrant local mogra/rajnigandha strings behind the stage rather than expensive PVC structures.',
        estimatedCostTier: 'Moderate'
      }
    ],
    entertainmentIdeas: [
      {
        title: 'Bespoke Family Trivia & Live Dhol Fusion',
        description: 'A 15-minute quick trivia game about the couple/honoree followed by an energetic live dhol entrance that gets all generations dancing.'
      }
    ],
    foodDrinkIdeas: [
      {
        title: 'Artisanal Kulhad Tea & Street Chaat Counter',
        description: 'Serve cardamom cutting chai in clay cups with mini pani puri shots—a massive crowd favorite that keeps per-plate costs minimal.'
      }
    ],
    hostTip: 'Appoint a non-immediate family coordinator with the day-of run sheet so you can be completely present in your celebration.'
  };

  return res.json({ success: true, data: fallback });
});

// Endpoint: AI Vendor Quote Review & Negotiation
app.post('/api/ai/vendor-review', async (req, res) => {
  const { vendorName, category, quotedPrice, currency, deliverables, lang } = req.body;
  const isHindi = lang === 'hi';

  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

  if (hasKey) {
    try {
      const prompt = `You are HostMate's veteran vendor contract negotiator.
Review this quote:
- Vendor: ${vendorName}
- Category: ${category}
- Quoted Price: ${currency} ${quotedPrice}
- Deliverables / Details: ${deliverables || 'Standard service'}
- Language: ${isHindi ? 'Hindi' : 'English'}

Return JSON matching:
{
  "fairnessAssessment": "Great value / Market average / Premium / Overpriced",
  "questionsToAskBeforeSigning": [
    "Specific question 1 (e.g. over-time charge per hour, backup equipment)",
    "Specific question 2",
    "Specific question 3"
  ],
  "negotiationAngles": [
    "Polite bargaining point or complimentary add-on to request"
  ],
  "redFlagsToWatch": [
    "Key clause to get in writing"
  ]
}`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        7000
      );

      const text = response.text;
      const parsed = cleanAndParseJson(text || '{}');
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.warn('Gemini API call failed, providing curated vendor review fallback:', error.message);
    }
  }

  // Curated Fallback
  const fallback = isHindi ? {
    fairnessAssessment: 'उचित बाजार दर (Market Average)',
    questionsToAskBeforeSigning: [
      'क्या इस कोटेशन में अतिरिक्त समय (Overtime) का प्रति घंटा शुल्क शामिल है?',
      'उपकरण या जनरेटर की खराबी की स्थिति में क्या तत्काल बैकअप व्यवस्था उपलब्ध है?',
      'अग्रिम भुगतान (Advance) के बाद शेष राशि का भुगतान कब और किस माध्यम से करना होगा?'
    ],
    negotiationAngles: [
      'कुल कीमत कम करने के बजाय अतिरिक्त complimentary सेवा (जैसे अतिरिक्त 20 प्लेटें या वेलकम बोर्ड) की मांग करें।',
      'यदि आप दो कार्यक्रमों (जैसे मेहंदी व शादी) के लिए बुक कर रहे हैं तो 10% बंडल डिस्काउंट का अनुरोध करें।'
    ],
    redFlagsToWatch: [
      'अनुबंध में स्पष्ट समय सीमा और रद्दीकरण (Cancellation) की शर्तों को लिखित में अवश्य लें।'
    ]
  } : {
    fairnessAssessment: 'Market Average — Competitive',
    questionsToAskBeforeSigning: [
      'Is there an explicit hourly overtime surcharge if the ceremony extends past schedule?',
      'What is your equipment breakdown contingency protocol (e.g., spare mics, backup generator)?',
      'What percentage of balance payment is expected on day-of vs. after final handover?'
    ],
    negotiationAngles: [
      'Rather than bargaining down base price, request value-added compliments (e.g., 1 complimentary live food counter or 1 extra photographer).',
      'Propose a prompt advance deposit in exchange for waived transportation & setup handling charges.'
    ],
    redFlagsToWatch: [
      'Ensure the exact arrival time and penalty clause for delayed setup are written into the invoice receipt.'
    ]
  };

  return res.json({ success: true, data: fallback });
});

// Server configuration & static serving
// Health check routes for Cloud Run liveness/readiness probes
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'HostMate' });
});

// Server configuration & static serving
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  // In production (Cloud Run), APP_ENV is undefined and dist bundle exists.
  // In development, npm run dev sets APP_ENV=development.
  const isDev = process.env.APP_ENV === 'development' || !hasDist;

  if (!isDev) {
    // Production mode (Cloud Run or deployed container)
    console.log('Starting HostMate in production mode serving static dist bundle');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Development mode with hot-module reloading
    console.log('Starting HostMate in development mode with Vite middleware');
    try {
      const { createServer } = await import('vite');
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite dev middleware failed, falling back to dist bundle if available:', err);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HostMate server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
