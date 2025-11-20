import type { Timestamp } from "firebase-admin/firestore";

export interface BudgetAreaBreakdown {
  area: string;
  currency: string;
  estimate: number;
}

export interface TravelCosts {
  currency: string;
  totalEstimated?: number;
  perArea?: BudgetAreaBreakdown[];
}

export interface ItineraryRecord {
  ownerId: string;
  title: string;
  summary?: string;
  primaryDestination: string;
  regions?: string[];
  categories?: string[];
  budget?: TravelCosts;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "draft" | "published";
  visibility: "public" | "unlisted";
}

export interface CreateItineraryPayload {
  ownerId: string;
  title: string;
  primaryDestination: string;
  summary?: string;
  regions?: string[];
  categories?: string[];
  budget?: TravelCosts;
}

