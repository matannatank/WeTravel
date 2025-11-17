export type UserRole = "guest" | "user" | "creator" | "admin";

export type TravelCategory =
  | "משפחות"
  | "צעירים"
  | "טבע"
  | "אוכל"
  | "הרפתקאות"
  | "היסטוריה"
  | "חופשת בטן-גב"
  | "תקציב מוגבל"
  | "פארקים לאומיים"
  | "עירוני";

export const CATEGORY_OPTIONS: TravelCategory[] = [
  "משפחות",
  "צעירים",
  "טבע",
  "אוכל",
  "הרפתקאות",
  "היסטוריה",
  "חופשת בטן-גב",
  "תקציב מוגבל",
  "פארקים לאומיים",
  "עירוני",
];

export interface CostCategoryBreakdown {
  food?: number;
  lodging?: number;
  transport?: number;
  attractions?: number;
  other?: number;
}

export interface AreaCostEstimate {
  area: string;
  currency: string;
  estimate: number;
  notes?: string;
  categories?: CostCategoryBreakdown;
}

export interface TravelCosts {
  currency: string;
  totalEstimated?: number;
  perArea?: AreaCostEstimate[];
}

export interface MediaAsset {
  url: string;
  type: "image" | "video";
  caption?: string;
  credit?: string;
}

export interface PointOfInterest {
  id: string;
  name: string;
  description?: string;
  googleMapsUrl: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  area?: string;
  mustVisit?: boolean;
  warnings?: string[];
  tips?: string[];
  media?: MediaAsset[];
  categories?: TravelCategory[];
}

export interface DaySegment {
  title: string;
  dateLabel?: string;
  area?: string;
  summary?: string;
  tips?: string[];
  costs?: CostCategoryBreakdown;
  points: PointOfInterest[];
}

export type ItineraryVisibility = "public" | "unlisted";
export type ItineraryStatus = "draft" | "published";

export interface Itinerary {
  id: string;
  ownerId: string;
  ownerDisplayName?: string;
  title: string;
  summary: string;
  primaryDestination: string;
  regions?: string[];
  categories: TravelCategory[];
  createdAt: string;
  updatedAt: string;
  visibility: ItineraryVisibility;
  status: ItineraryStatus;
  heroImage?: string;
  budget?: TravelCosts;
  days: DaySegment[];
  tags?: string[];
  ratingAverage?: number;
  ratingCount?: number;
  favoritesCount?: number;
  shareCount?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  photoURL?: string;
  bio?: string;
  role: UserRole;
  joinedAt: string;
  itinerariesCount?: number;
  favoritesCount?: number;
}

export interface ReportPayload {
  id: string;
  itineraryId: string;
  reporterId: string;
  reason: "offensive" | "spam" | "copyright" | "other";
  notes?: string;
  status: "open" | "reviewing" | "closed";
  createdAt: string;
  resolvedAt?: string;
}

