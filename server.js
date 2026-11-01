import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "10mb" }));
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
function cleanAndParseJson(text) {
  if (!text) return {};
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}
function withTimeout(promise, ms = 8e3) {
  return Promise.race([
    promise,
    new Promise(
      (_, reject) => setTimeout(() => reject(new Error(`AI generation timed out after ${ms}ms`)), ms)
    )
  ]);
}
app.post("/api/ai/budget-advice", async (req, res) => {
  const { eventType, budget, guestCount, currency, categories, lang } = req.body;
  const isHindi = lang === "hi";
  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  if (hasKey) {
    try {
      const prompt = `You are HostMate, an expert event financial planner and coordinator with the tagline "Budget fit, event hit!".
Event Details:
- Type: ${eventType}
- Total Budget: ${currency} ${budget}
- Guest Count: ${guestCount}
- Current Category Breakdown: ${JSON.stringify(categories)}
- Output Language: ${isHindi ? "Hindi (Devanagari script)" : "English"}

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
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        }),
        7e3
      );
      const text = response.text;
      const parsed = cleanAndParseJson(text || "{}");
      return res.json({ success: true, data: parsed });
    } catch (error) {
      console.warn("Gemini API call failed, providing curated financial advice fallback:", error.message);
    }
  }
  const fallback = isHindi ? {
    summary: `\u0906\u092A\u0915\u0947 ${guestCount} \u092E\u0947\u0939\u092E\u093E\u0928\u094B\u0902 \u0914\u0930 ${currency} ${Number(budget).toLocaleString("en-IN")} \u0915\u0947 \u092C\u091C\u091F \u0915\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u092A\u0942\u0930\u094D\u0923 \u0939\u0941\u0906\u0964 \u0915\u0947\u091F\u0930\u093F\u0902\u0917 \u0914\u0930 \u0935\u0947\u0928\u094D\u092F\u0942 \u0906\u0935\u0902\u091F\u0928 \u0938\u0902\u0924\u0941\u0932\u093F\u0924 \u0939\u0948\u0964`,
    recommendedTweaks: [
      {
        category: "Catering & Food",
        adjustment: "-5% \u0938\u0947 -8% \u092C\u091A\u0924",
        rationale: "\u092E\u0947\u0928\u0942 \u092E\u0947\u0902 \u0938\u094D\u091F\u093E\u0930\u094D\u091F\u0930\u094D\u0938 \u0915\u0940 \u0938\u0902\u0916\u094D\u092F\u093E 6 \u0938\u0947 \u0918\u091F\u093E\u0915\u0930 4 \u0915\u0930\u0947\u0902 \u0914\u0930 \u092E\u0941\u0916\u094D\u092F \u0915\u094B\u0930\u094D\u0938 \u092E\u0947\u0902 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u0940\u092F \u0935\u093F\u0936\u093F\u0937\u094D\u091F \u0935\u094D\u092F\u0902\u091C\u0928\u094B\u0902 \u0915\u094B \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915\u0924\u093E \u0926\u0947\u0902\u0964"
      },
      {
        category: "Decor & Floral",
        adjustment: "\u092A\u0941\u0928\u0930\u094D\u0935\u093F\u092D\u093E\u091C\u0928",
        rationale: "\u0935\u093F\u0926\u0947\u0936\u0940 \u0906\u092F\u093E\u0924\u093F\u0924 \u092B\u0942\u0932\u094B\u0902 \u0915\u0947 \u0938\u094D\u0925\u093E\u0928 \u092A\u0930 \u092E\u094C\u0938\u092E\u0940 \u0917\u0947\u0902\u0926\u093E, \u0930\u091C\u0928\u0940\u0917\u0902\u0927\u093E \u0914\u0930 \u092A\u0940\u0924\u0932 \u0915\u0947 \u0926\u0940\u092A\u0915\u094B\u0902 \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964"
      }
    ],
    costSavingHacks: [
      "\u0921\u093F\u091C\u093F\u091F\u0932 \u0935\u094D\u0939\u093E\u091F\u094D\u0938\u090F\u092A RSVP \u0915\u0947 \u091C\u0930\u093F\u090F \u0938\u091F\u0940\u0915 \u0939\u0947\u0921\u0915\u093E\u0909\u0902\u091F \u0932\u0947\u0915\u0930 \u0915\u0948\u091F\u0930\u0930 \u0915\u094B 48 \u0918\u0902\u091F\u0947 \u092A\u0939\u0932\u0947 \u0926\u0947\u0902 \u091C\u093F\u0938\u0938\u0947 \u092A\u094D\u0932\u0947\u091F \u0935\u0947\u0938\u094D\u091F\u0947\u091C \u092E\u0947\u0902 10-15% \u0915\u0940 \u092C\u091A\u0924 \u0939\u094B\u0917\u0940\u0964",
      "\u0938\u093E\u0909\u0902\u0921 \u0914\u0930 \u0932\u093E\u0907\u091F\u093F\u0902\u0917 \u0935\u0947\u0902\u0921\u0930 \u0938\u0947 \u092A\u0948\u0915\u0947\u091C \u0921\u0940\u0932 \u092E\u0947\u0902 \u0939\u0940 \u091C\u0928\u0930\u0947\u091F\u0930 \u092C\u0948\u0915\u0905\u092A \u0936\u093E\u092E\u093F\u0932 \u0915\u0930\u0928\u0947 \u0915\u0940 \u092C\u093E\u0924\u091A\u0940\u0924 \u0915\u0930\u0947\u0902\u0964",
      "\u0905\u0917\u094D\u0930\u093F\u092E \u092D\u0941\u0917\u0924\u093E\u0928 \u0915\u0940 \u0924\u093E\u0930\u0940\u0916\u094B\u0902 \u0915\u094B \u0938\u092E\u092F\u092C\u0926\u094D\u0927 \u0930\u0916\u0947\u0902 \u0924\u093E\u0915\u093F \u0905\u0902\u0924\u093F\u092E \u0938\u092E\u092F \u0915\u093E \u0905\u0927\u093F\u092D\u093E\u0930 \u0928 \u0932\u0917\u0947\u0964"
    ],
    hiddenCostsWarning: [
      "\u0935\u0947\u0928\u094D\u092F\u0942 \u091C\u0928\u0930\u0947\u091F\u0930 \u0921\u0940\u091C\u0932 \u0916\u0930\u094D\u091A (\u0932\u0917\u092D\u0917 \u20B98,000 - \u20B915,000 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924)",
      "\u0915\u0947\u091F\u0930\u093F\u0902\u0917 \u0938\u0930\u094D\u0935\u093F\u0938 \u0938\u094D\u091F\u093E\u092B \u092C\u0916\u094D\u0936\u0940\u0936 \u0935 \u091F\u093F\u092A\u093F\u0902\u0917 \u092A\u0942\u0932",
      "\u0938\u093E\u0909\u0902\u0921 \u0935 \u0921\u0940\u091C\u0947 \u092A\u0930\u092E\u093F\u0936\u0928 \u0914\u0930 \u0930\u093E\u0924\u094D\u0930\u093F 10 \u092C\u091C\u0947 \u0915\u0947 \u092C\u093E\u0926 \u0913\u0935\u0930-\u091F\u093E\u0907\u092E \u0936\u0941\u0932\u094D\u0915"
    ]
  } : {
    summary: `Financial review completed for ${guestCount} guests on a total cap of ${currency} ${Number(budget).toLocaleString("en-IN")}. Core allocations align with benchmark ratios.`,
    recommendedTweaks: [
      {
        category: "Catering & Beverages",
        adjustment: "-5% to -8% Optimization",
        rationale: "Streamline appetizer rotation to 4 high-demand live items rather than 8 stationary platters."
      },
      {
        category: "Decor & Florals",
        adjustment: "Re-balance",
        rationale: "Substitute off-season exotics with seasonal blooms, marigolds, fairy curtains, and warm uplighting."
      }
    ],
    costSavingHacks: [
      "Use the WhatsApp RSVP live headcount to freeze final guest plate count 48h before the banquet, cutting plate wastage by 10-15%.",
      "Negotiate venue-bundled sound equipment rather than hiring third-party logistics.",
      "Schedule vendor advance settlements on milestones to keep liquidity in high-yield buffers."
    ],
    hiddenCostsWarning: [
      "Heavy generator diesel consumption (est. \u20B98,000 - \u20B915,000)",
      "Service staff gratuity / tip pool expectations",
      "Overtime venue tariffs past 11:00 PM curfew"
    ]
  };
  return res.json({ success: true, data: fallback });
});
app.post("/api/ai/day-of-schedule", async (req, res) => {
  const { eventType, eventName, date, guestCount, startTime, specialRituals, lang } = req.body;
  const isHindi = lang === "hi";
  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  if (hasKey) {
    try {
      const prompt = `You are HostMate, an elite event coordinator.
Generate a high-precision, realistic Day-Of Chronological Run Sheet for:
- Event: ${eventName || eventType} (${eventType})
- Date: ${date}
- Guest Count: ${guestCount}
- Event Main Start Time: ${startTime || "11:00 AM"}
- Special Highlights/Rituals: ${specialRituals || "Standard program"}
- Language: ${isHindi ? "Hindi (Devanagari)" : "English"}

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
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        }),
        7e3
      );
      const text = response.text;
      const parsed = cleanAndParseJson(text || "{}");
      return res.json({ success: true, data: parsed });
    } catch (error) {
      console.warn("Gemini API call failed, providing curated schedule fallback:", error.message);
    }
  }
  const fallback = {
    theme: isHindi ? "\u0938\u092E\u092F\u092C\u0926\u094D\u0927 \u0935 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093F\u0924 \u0909\u0924\u094D\u0938\u0935 \u0936\u0947\u0921\u094D\u092F\u0942\u0932" : "On-Time Chronological Execution Run Sheet",
    timeline: [
      {
        time: "07:30 AM",
        activity: isHindi ? "\u0935\u0947\u0928\u094D\u092F\u0942 \u0939\u0948\u0902\u0921\u0913\u0935\u0930 \u0935 \u092B\u0942\u0932\u094B\u0902 \u0915\u0940 \u0938\u091C\u093E\u0935\u091F \u092A\u094D\u0930\u093E\u0930\u0902\u092D" : "Venue handover & floral decorator setup begins",
        leadPerson: isHindi ? "\u0935\u0947\u0928\u094D\u092F\u0942 \u092A\u094D\u0930\u092C\u0902\u0927\u0915 \u0935 \u0921\u0947\u0915\u094B\u0930\u0947\u091F\u0930" : "Venue Manager & Decor Lead",
        notes: isHindi ? "\u092E\u0941\u0916\u094D\u092F \u092E\u0902\u091A \u0914\u0930 \u092E\u0902\u0921\u092A \u0915\u0940 \u091C\u093E\u0902\u091A \u0915\u0930\u0947\u0902" : "Verify stage lighting and entrance floral arch",
        critical: true
      },
      {
        time: "09:00 AM",
        activity: isHindi ? "\u0921\u0940\u091C\u0947 \u0935 \u0911\u0921\u093F\u092F\u094B \u0938\u093F\u0938\u094D\u091F\u092E \u0938\u093E\u0909\u0902\u0921 \u091A\u0947\u0915" : "Audio & DJ sound check with wireless mics",
        leadPerson: isHindi ? "\u0938\u093E\u0909\u0902\u0921 \u0915\u094B\u0911\u0930\u094D\u0921\u093F\u0928\u0947\u091F\u0930" : "DJ / Audio Lead",
        notes: isHindi ? "\u092E\u093E\u0907\u0915 \u092C\u0948\u091F\u0930\u093F\u092F\u093E\u0902 \u092C\u0926\u0932\u0947\u0902" : "Ensure spare 9V batteries for wireless stage mics",
        critical: false
      },
      {
        time: "10:30 AM",
        activity: isHindi ? "\u0915\u0947\u091F\u0930\u093F\u0902\u0917 \u0932\u093E\u0907\u0935 \u0915\u093E\u0909\u0902\u091F\u0930 \u0935 \u0938\u094D\u0935\u093E\u0917\u0924 \u092A\u0947\u092F \u0924\u0948\u092F\u093E\u0930" : "Live beverage counters & welcome refreshments ready",
        leadPerson: isHindi ? "\u0915\u0947\u091F\u0930\u093F\u0902\u0917 \u0915\u0948\u092A\u094D\u091F\u0928" : "Catering Captain",
        notes: isHindi ? "\u0936\u0941\u0926\u094D\u0927 \u0936\u093E\u0915\u093E\u0939\u093E\u0930\u0940 \u0935 \u091C\u0948\u0928 \u0915\u093E\u0909\u0902\u091F\u0930 \u092A\u0943\u0925\u0915 \u0930\u0916\u0947\u0902" : "Separate Jain & Veg counters clearly signposted",
        critical: true
      },
      {
        time: "11:00 AM",
        activity: isHindi ? "\u0905\u0924\u093F\u0925\u093F\u092F\u094B\u0902 \u0915\u093E \u0906\u0917\u092E\u0928 \u0935 \u0938\u094D\u0935\u093E\u0917\u0924" : "Guest arrival & welcome refreshment service",
        leadPerson: isHindi ? "\u092A\u0930\u093F\u0935\u093E\u0930 \u0935 \u0938\u094D\u0935\u093E\u0917\u0924 \u0926\u0932" : "Host Family & Ushers",
        notes: isHindi ? "RSVP \u0921\u0947\u0938\u094D\u0915 \u0938\u0915\u094D\u0930\u093F\u092F \u0930\u0916\u0947\u0902" : "Keep RSVP registry & gift counter manned",
        critical: false
      },
      {
        time: "12:30 PM",
        activity: isHindi ? "\u092D\u0935\u094D\u092F \u092E\u0941\u0916\u094D\u092F \u092A\u094D\u0930\u0935\u0947\u0936 \u0935 \u0938\u0947\u0930\u0947\u092E\u0928\u0940" : "Grand couple / star entrance & main ceremony",
        leadPerson: isHindi ? "\u092E\u0941\u0916\u094D\u092F \u0938\u092E\u0928\u094D\u0935\u092F\u0915" : "Lead Coordinator",
        notes: isHindi ? "\u092B\u093C\u094B\u091F\u094B\u0917\u094D\u0930\u093E\u092B\u093C\u0930 \u0914\u0930 \u0915\u094B\u0932\u094D\u0921-\u092A\u093E\u092F\u0930\u094B \u0924\u0948\u092F\u093E\u0930" : "Coordinate cold-pyro sparklers with photographer",
        critical: true
      },
      {
        time: "01:30 PM",
        activity: isHindi ? "\u0936\u093E\u0939\u0940 \u092D\u094B\u091C \u0935 \u092C\u0941\u092B\u0947 \u092A\u094D\u0930\u093E\u0930\u0902\u092D" : "Grand banquet buffet opened for all guests",
        leadPerson: isHindi ? "\u0915\u0947\u091F\u0930\u093F\u0902\u0917 \u0915\u0948\u092A\u094D\u091F\u0928" : "Catering Captain",
        notes: isHindi ? "\u092C\u0941\u092B\u0947 \u0932\u093E\u0907\u0928\u094B\u0902 \u0915\u093E \u0938\u0941\u091A\u093E\u0930\u0942 \u0938\u0902\u091A\u093E\u0932\u0928 \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0947\u0902" : "Ensure continuous replenishment of hot items",
        critical: true
      },
      {
        time: "03:30 PM",
        activity: isHindi ? "\u092A\u093E\u0930\u093F\u0935\u093E\u0930\u093F\u0915 \u092B\u093C\u094B\u091F\u094B \u0938\u0947\u0936\u0928 \u0935 \u0909\u092A\u0939\u093E\u0930 \u0935\u093F\u0924\u0930\u0923" : "Family photo sessions & token favor distribution",
        leadPerson: isHindi ? "\u092B\u093C\u094B\u091F\u094B\u0917\u094D\u0930\u093E\u092B\u093C\u0930 \u0935 \u092E\u093F\u0924\u094D\u0930" : "Lead Photographer & Sibling",
        notes: isHindi ? "\u0935\u0930\u093F\u0937\u094D\u0920 \u092C\u0941\u091C\u0941\u0930\u094D\u0917\u094B\u0902 \u0915\u094B \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915\u0924\u093E \u0926\u0947\u0902" : "Prioritize immediate elders for group portraits",
        critical: false
      },
      {
        time: "05:00 PM",
        activity: isHindi ? "\u0938\u092E\u093E\u092A\u0928, \u0935\u0947\u0902\u0921\u0930 \u0938\u0947\u091F\u0932\u092E\u0947\u0902\u091F \u0935 \u0927\u0928\u094D\u092F\u0935\u093E\u0926" : "Event wrap-up, final vendor settlements & departures",
        leadPerson: isHindi ? "\u092E\u0941\u0916\u094D\u092F \u0906\u092F\u094B\u091C\u0915" : "Primary Organizer",
        notes: isHindi ? "\u0930\u0938\u0940\u0926\u0947\u0902 \u0914\u0930 \u092C\u0948\u0932\u0947\u0902\u0938 \u092D\u0941\u0917\u0924\u093E\u0928 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0915\u0930\u0947\u0902" : "Confirm signed receipts for advance balance payments",
        critical: true
      }
    ],
    emergencyKitList: [
      isHindi ? "\u0938\u0941\u0930\u0915\u094D\u0937\u093E \u092A\u093F\u0928, \u092B\u0948\u092C\u094D\u0930\u093F\u0915 \u091F\u0947\u092A \u0914\u0930 \u0938\u093F\u0932\u093E\u0908 \u0915\u093F\u091F" : "Safety pins, clear fabric tape, and emergency stitch kit",
      isHindi ? "\u092E\u0932\u094D\u091F\u0940\u092A\u0932 \u092B\u094B\u0928 \u091A\u093E\u0930\u094D\u091C\u0930 \u0914\u0930 \u092A\u093E\u0935\u0930 \u092C\u0948\u0902\u0915" : "Universal phone chargers and high-capacity power banks",
      isHindi ? "\u092A\u094D\u0930\u093F\u0902\u091F\u0947\u0921 \u0935\u0947\u0902\u0921\u0930 \u0921\u093E\u092F\u0930\u0947\u0915\u094D\u091F\u0930\u0940 \u0935 \u0907\u092E\u0930\u091C\u0947\u0902\u0938\u0940 \u0938\u0902\u092A\u0930\u094D\u0915 \u0938\u0942\u091A\u0940" : "Printed vendor contact directory and emergency contacts",
      isHindi ? "\u0935\u0947\u0902\u0921\u0930\u094D\u0938 \u0915\u0947 \u0932\u093F\u090F \u0928\u0915\u0926 \u0932\u093F\u092B\u093E\u092B\u0947" : "Pre-counted cash envelopes for final balance payments"
    ]
  };
  return res.json({ success: true, data: fallback });
});
app.post("/api/ai/personalized-ideas", async (req, res) => {
  const { eventType, budget, guestCount, currency, preferences, customPrompt, lang } = req.body;
  const promptInput = preferences || customPrompt || "Creative, elegant, memorable, cost-effective";
  const isHindi = lang === "hi";
  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  if (hasKey) {
    try {
      const prompt = `You are HostMate, a creative and budget-savvy event stylist ("Budget fit, event hit!").
Generate unique, high-impact ideas for:
- Event Type: ${eventType}
- Budget: ${currency} ${budget}
- Guests: ${guestCount}
- Host Preferences: ${promptInput}
- Language: ${isHindi ? "Hindi" : "English"}

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
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        }),
        7e3
      );
      const text = response.text;
      const parsed = cleanAndParseJson(text || "{}");
      return res.json({ success: true, data: parsed });
    } catch (error) {
      console.warn("Gemini API call failed, providing curated ideas fallback:", error.message);
    }
  }
  const fallback = isHindi ? {
    themeName: "\u0930\u0949\u092F\u0932 \u0939\u0947\u0930\u093F\u091F\u0947\u091C \u0935\u093F\u0925 \u092E\u0949\u0921\u0930\u094D\u0928 \u092E\u093F\u0928\u093F\u092E\u0932\u093F\u091C\u094D\u092E",
    decorIdeas: [
      {
        title: "\u092A\u0940\u0924\u0932 \u0915\u0947 \u0909\u0930\u0941\u0932\u0940 \u0935 \u0924\u0948\u0930\u0924\u0940 \u092E\u094B\u092E\u092C\u0924\u094D\u0924\u093F\u092F\u093E\u0902",
        description: "\u092A\u094D\u0930\u0935\u0947\u0936 \u0926\u094D\u0935\u093E\u0930 \u092A\u0930 \u0924\u093E\u091C\u0947 \u0917\u0947\u0902\u0926\u0947 \u0915\u0940 \u092A\u0902\u0916\u0941\u0921\u093C\u093F\u092F\u094B\u0902 \u0914\u0930 \u0938\u0941\u0917\u0902\u0927\u093F\u0924 \u092E\u094B\u092E\u092C\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0938\u0947 \u0938\u091C\u093E \u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u0909\u0930\u0941\u0932\u0940 \u092C\u0930\u094D\u0924\u0928\u0964",
        estimatedCostTier: "Low"
      },
      {
        title: "\u092B\u0947\u092F\u0930\u0940 \u0932\u093E\u0907\u091F \u0915\u0948\u0928\u094B\u092A\u0940 \u0935 \u092E\u094B\u0917\u0930\u093E \u0915\u0930\u094D\u091F\u0928",
        description: "\u092E\u0939\u0902\u0917\u0940 \u0915\u0943\u0924\u094D\u0930\u093F\u092E \u0938\u0902\u0930\u091A\u0928\u093E\u0913\u0902 \u0915\u0947 \u092C\u091C\u093E\u092F \u0917\u0930\u094D\u092E \u0938\u092B\u0947\u0926 \u092B\u0947\u092F\u0930\u0940 \u0932\u093E\u0907\u091F\u094D\u0938 \u0914\u0930 \u0905\u0938\u0932\u0940 \u092E\u094B\u0917\u0930\u0947 \u0915\u0940 \u0932\u0921\u093C\u093F\u092F\u094B\u0902 \u0915\u093E \u092C\u0948\u0915\u0921\u094D\u0930\u0949\u092A\u0964",
        estimatedCostTier: "Moderate"
      }
    ],
    entertainmentIdeas: [
      {
        title: "\u0907\u0902\u091F\u0930\u090F\u0915\u094D\u091F\u093F\u0935 \u0932\u093E\u0907\u0935 \u0922\u094B\u0932 \u0935 \u092B\u0928 \u0915\u094D\u0935\u093F\u091C",
        description: "\u092A\u0930\u093F\u0935\u093E\u0930 \u0915\u0947 \u0938\u0926\u0938\u094D\u092F\u094B\u0902 \u0915\u0947 \u0938\u093E\u0925 \u092E\u091C\u0947\u0926\u093E\u0930 \u0915\u093F\u0938\u094D\u0938\u094B\u0902 \u0914\u0930 \u0932\u093E\u0907\u0935 \u0922\u094B\u0932 \u092C\u0940\u091F\u094D\u0938 \u0915\u0947 \u0938\u093E\u0925 \u092E\u0947\u0939\u092E\u093E\u0928\u094B\u0902 \u0915\u093E \u0909\u0924\u094D\u0938\u093E\u0939 \u092C\u0922\u093C\u093E\u090F\u0902\u0964"
      }
    ],
    foodDrinkIdeas: [
      {
        title: "\u0932\u093E\u0907\u0935 \u0915\u0941\u0932\u094D\u0939\u0921\u093C \u092E\u0938\u093E\u0932\u093E \u091A\u093E\u092F \u0935 \u092E\u093F\u0928\u0940 \u091A\u093E\u091F \u0932\u093E\u0909\u0902\u091C",
        description: "\u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0947 \u0915\u0941\u0932\u094D\u0939\u0921\u093C \u092E\u0947\u0902 \u091A\u093E\u092F \u0914\u0930 \u0917\u0930\u092E \u091C\u0932\u0947\u092C\u0940-\u0930\u092C\u0921\u093C\u0940 \u0915\u093E \u0932\u093E\u0907\u0935 \u0915\u093E\u0909\u0902\u091F\u0930 \u091C\u094B \u0939\u0930 \u092E\u0947\u0939\u092E\u093E\u0928 \u0915\u094B \u092D\u093E\u090F\u0964"
      }
    ],
    hostTip: "\u0907\u0935\u0947\u0902\u091F \u0915\u0947 \u0926\u093F\u0928 \u090F\u0915 \u092E\u0941\u0916\u094D\u092F \u092E\u093F\u0924\u094D\u0930 \u0915\u094B \u0915\u094B\u0911\u0930\u094D\u0921\u093F\u0928\u0947\u091F\u0930 \u092C\u0928\u093E\u090F\u0902 \u0924\u093E\u0915\u093F \u0906\u092A \u0914\u0930 \u0906\u092A\u0915\u093E \u092A\u0930\u093F\u0935\u093E\u0930 \u0909\u0924\u094D\u0938\u0935 \u0915\u093E \u092A\u0942\u0930\u093E \u0906\u0928\u0902\u0926 \u0932\u0947 \u0938\u0915\u0947\u0964"
  } : {
    themeName: "Royal Heritage with Modern Minimalism",
    decorIdeas: [
      {
        title: "Brass Urulis with Floating Diyas",
        description: "Place traditional polished brass vessels with fresh marigold petals and floating tealights at entrances for an instant regal ambiance.",
        estimatedCostTier: "Low"
      },
      {
        title: "Warm Fairy Light Canopy with Tuberose Strings",
        description: "Drape cascading fairy lights intermingled with fragrant local mogra/rajnigandha strings behind the stage rather than expensive PVC structures.",
        estimatedCostTier: "Moderate"
      }
    ],
    entertainmentIdeas: [
      {
        title: "Bespoke Family Trivia & Live Dhol Fusion",
        description: "A 15-minute quick trivia game about the couple/honoree followed by an energetic live dhol entrance that gets all generations dancing."
      }
    ],
    foodDrinkIdeas: [
      {
        title: "Artisanal Kulhad Tea & Street Chaat Counter",
        description: "Serve cardamom cutting chai in clay cups with mini pani puri shots\u2014a massive crowd favorite that keeps per-plate costs minimal."
      }
    ],
    hostTip: "Appoint a non-immediate family coordinator with the day-of run sheet so you can be completely present in your celebration."
  };
  return res.json({ success: true, data: fallback });
});
app.post("/api/ai/vendor-review", async (req, res) => {
  const { vendorName, category, quotedPrice, currency, deliverables, lang } = req.body;
  const isHindi = lang === "hi";
  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  if (hasKey) {
    try {
      const prompt = `You are HostMate's veteran vendor contract negotiator.
Review this quote:
- Vendor: ${vendorName}
- Category: ${category}
- Quoted Price: ${currency} ${quotedPrice}
- Deliverables / Details: ${deliverables || "Standard service"}
- Language: ${isHindi ? "Hindi" : "English"}

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
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        }),
        7e3
      );
      const text = response.text;
      const parsed = cleanAndParseJson(text || "{}");
      return res.json({ success: true, data: parsed });
    } catch (error) {
      console.warn("Gemini API call failed, providing curated vendor review fallback:", error.message);
    }
  }
  const fallback = isHindi ? {
    fairnessAssessment: "\u0909\u091A\u093F\u0924 \u092C\u093E\u091C\u093E\u0930 \u0926\u0930 (Market Average)",
    questionsToAskBeforeSigning: [
      "\u0915\u094D\u092F\u093E \u0907\u0938 \u0915\u094B\u091F\u0947\u0936\u0928 \u092E\u0947\u0902 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924 \u0938\u092E\u092F (Overtime) \u0915\u093E \u092A\u094D\u0930\u0924\u093F \u0918\u0902\u091F\u093E \u0936\u0941\u0932\u094D\u0915 \u0936\u093E\u092E\u093F\u0932 \u0939\u0948?",
      "\u0909\u092A\u0915\u0930\u0923 \u092F\u093E \u091C\u0928\u0930\u0947\u091F\u0930 \u0915\u0940 \u0916\u0930\u093E\u092C\u0940 \u0915\u0940 \u0938\u094D\u0925\u093F\u0924\u093F \u092E\u0947\u0902 \u0915\u094D\u092F\u093E \u0924\u0924\u094D\u0915\u093E\u0932 \u092C\u0948\u0915\u0905\u092A \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E \u0909\u092A\u0932\u092C\u094D\u0927 \u0939\u0948?",
      "\u0905\u0917\u094D\u0930\u093F\u092E \u092D\u0941\u0917\u0924\u093E\u0928 (Advance) \u0915\u0947 \u092C\u093E\u0926 \u0936\u0947\u0937 \u0930\u093E\u0936\u093F \u0915\u093E \u092D\u0941\u0917\u0924\u093E\u0928 \u0915\u092C \u0914\u0930 \u0915\u093F\u0938 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u0915\u0930\u0928\u093E \u0939\u094B\u0917\u093E?"
    ],
    negotiationAngles: [
      "\u0915\u0941\u0932 \u0915\u0940\u092E\u0924 \u0915\u092E \u0915\u0930\u0928\u0947 \u0915\u0947 \u092C\u091C\u093E\u092F \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924 complimentary \u0938\u0947\u0935\u093E (\u091C\u0948\u0938\u0947 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924 20 \u092A\u094D\u0932\u0947\u091F\u0947\u0902 \u092F\u093E \u0935\u0947\u0932\u0915\u092E \u092C\u094B\u0930\u094D\u0921) \u0915\u0940 \u092E\u093E\u0902\u0917 \u0915\u0930\u0947\u0902\u0964",
      "\u092F\u0926\u093F \u0906\u092A \u0926\u094B \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E\u094B\u0902 (\u091C\u0948\u0938\u0947 \u092E\u0947\u0939\u0902\u0926\u0940 \u0935 \u0936\u093E\u0926\u0940) \u0915\u0947 \u0932\u093F\u090F \u092C\u0941\u0915 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902 \u0924\u094B 10% \u092C\u0902\u0921\u0932 \u0921\u093F\u0938\u094D\u0915\u093E\u0909\u0902\u091F \u0915\u093E \u0905\u0928\u0941\u0930\u094B\u0927 \u0915\u0930\u0947\u0902\u0964"
    ],
    redFlagsToWatch: [
      "\u0905\u0928\u0941\u092C\u0902\u0927 \u092E\u0947\u0902 \u0938\u094D\u092A\u0937\u094D\u091F \u0938\u092E\u092F \u0938\u0940\u092E\u093E \u0914\u0930 \u0930\u0926\u094D\u0926\u0940\u0915\u0930\u0923 (Cancellation) \u0915\u0940 \u0936\u0930\u094D\u0924\u094B\u0902 \u0915\u094B \u0932\u093F\u0916\u093F\u0924 \u092E\u0947\u0902 \u0905\u0935\u0936\u094D\u092F \u0932\u0947\u0902\u0964"
    ]
  } : {
    fairnessAssessment: "Market Average \u2014 Competitive",
    questionsToAskBeforeSigning: [
      "Is there an explicit hourly overtime surcharge if the ceremony extends past schedule?",
      "What is your equipment breakdown contingency protocol (e.g., spare mics, backup generator)?",
      "What percentage of balance payment is expected on day-of vs. after final handover?"
    ],
    negotiationAngles: [
      "Rather than bargaining down base price, request value-added compliments (e.g., 1 complimentary live food counter or 1 extra photographer).",
      "Propose a prompt advance deposit in exchange for waived transportation & setup handling charges."
    ],
    redFlagsToWatch: [
      "Ensure the exact arrival time and penalty clause for delayed setup are written into the invoice receipt."
    ]
  };
  return res.json({ success: true, data: fallback });
});
app.get("/healthz", (_req, res) => {
  res.status(200).send("OK");
});
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", service: "HostMate" });
});
async function startServer() {
  const distPath = path.join(__dirname, "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));
  const isDev = process.env.APP_ENV === "development" || !hasDist;
  if (!isDev) {
    console.log("Starting HostMate in production mode serving static dist bundle");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("Starting HostMate in development mode with Vite middleware");
    try {
      const { createServer } = await import("vite");
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn("Vite dev middleware failed, falling back to dist bundle if available:", err);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get("*", (_req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      }
    }
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HostMate server listening on port ${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
