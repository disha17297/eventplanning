export type Language = 'en' | 'hi';

export type EventType = 'wedding' | 'birthday' | 'community' | 'other';

export type Currency = '₹' | '$' | '€' | '£';

export interface BudgetCategory {
  id: string;
  name: string;
  nameHi: string;
  recommendedPct: number; // e.g. 40
  estimatedCost: number;
  actualCost: number;
  advancePaid: number;
  dueDate?: string;
  notes?: string;
}

export type TaskPhase = 'early' | 'mid' | 'final';

export interface ChecklistTask {
  id: string;
  title: string;
  titleHi: string;
  phase: TaskPhase;
  dueDate?: string;
  completed: boolean;
  assignedTo?: string;
  notes?: string;
}

export interface RunSheetItem {
  id: string;
  time: string; // e.g. "09:00 AM"
  activity: string;
  activityHi?: string;
  leadPerson: string;
  notes?: string;
  isCritical?: boolean;
}

export type FoodPreference = 'veg' | 'non-veg' | 'jain' | 'vegan' | 'other';

export interface GuestRsvp {
  id: string;
  name: string;
  phone?: string;
  attendance: 'yes' | 'no' | 'pending';
  plusOnes: number; // additional guests
  foodPreference: FoodPreference;
  dietaryNotes?: string;
  wishes?: string;
  submittedAt: string;
}

export type VendorCategory = 
  | 'venue' 
  | 'catering' 
  | 'decor' 
  | 'photography' 
  | 'music' 
  | 'makeup' 
  | 'transport' 
  | 'cake' 
  | 'anchor' 
  | 'other';

export interface VendorDocument {
  id: string;
  name: string;
  fileType: 'pdf' | 'image' | 'doc';
  dataUrl: string;
  uploadDate: string;
  sizeKb?: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  phone: string;
  email?: string;
  agreedPrice: number;
  advancePaid: number;
  balanceDueDate: string;
  status: 'contacted' | 'negotiating' | 'booked' | 'completed';
  deliverables?: string;
  documents: VendorDocument[];
  notes?: string;
}

export interface SubEvent {
  id: string;
  name: string;
  nameHi?: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  dressCode?: string;
  allocatedBudget: number;
  actualCost?: number;
  invitedGuestIds: string[];
  description?: string;
}

export type TableShape = 'round' | 'rectangular' | 'head';

export interface TablePlan {
  id: string;
  name: string;
  shape: TableShape;
  capacity: number;
  x: number;
  y: number;
  assignedGuestIds: string[];
  category?: 'family' | 'friends' | 'vip' | 'colleagues' | 'kids';
  notes?: string;
}

export interface MediaPhoto {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  timestamp: string;
  likes: number;
  subEventId?: string;
}

export interface GiftRecord {
  id: string;
  guestId?: string;
  guestName: string;
  type: 'cash' | 'physical' | 'voucher' | 'blessing';
  amount?: number;
  itemDescription?: string;
  thankYouSent: boolean;
  thankYouMessage?: string;
  recordedAt: string;
}

export interface EcoStats {
  adultsCount: number;
  childrenCount: number;
  seniorsCount: number;
  mealType: 'buffet' | 'plated' | 'cocktail';
  estimatedFoodKg: number;
  plasticBottlesSaved: number;
  carbonOffsetKg: number;
  foodDonationRequested?: boolean;
  foodDonationNgo?: string;
  foodDonationStatus?: 'pending' | 'dispatched' | 'completed';
  surplusPortions?: number;
}

export interface ProAgencySettings {
  isProEnabled: boolean;
  agencyName: string;
  plannerName: string;
  agencyLogo?: string;
  primaryColor?: string;
  contactEmail?: string;
  contactPhone?: string;
  activeClientCount: number;
  managedBudgetTotal: number;
  customWatermark: boolean;
}

export interface PromotedVendor {
  id: string;
  name: string;
  category: VendorCategory;
  rating: number;
  reviewsCount: number;
  startingPrice: number;
  commissionRatePct: number;
  city: string;
  isFeatured: boolean;
  tagline: string;
  phone: string;
  bookedLeadsCount: number;
  earnedCommission: number;
}

export interface EventData {
  id: string;
  title: string;
  type: EventType;
  date: string;
  currency: Currency;
  totalBudget: number;
  guestCount: number;
  budgetItems: BudgetCategory[];
  tasks: ChecklistTask[];
  runSheet: RunSheetItem[];
  rsvps: GuestRsvp[];
  vendors: Vendor[];
  subEvents?: SubEvent[];
  tables?: TablePlan[];
  photos?: MediaPhoto[];
  gifts?: GiftRecord[];
  ecoStats?: EcoStats;
  proSettings?: ProAgencySettings;
  promotedVendors?: PromotedVendor[];
  createdAt: string;
  updatedAt: string;
}

