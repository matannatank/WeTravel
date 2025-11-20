"use client";

import { useEffect, useState } from "react";
import {
  subscribeToItineraryRatings,
  getUserRating,
  type Rating,
} from "@/lib/ratings";

export const useItineraryRatings = (itineraryId: string) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itineraryId) {
      setRatings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToItineraryRatings(itineraryId, (items) => {
      setRatings(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [itineraryId]);

  return { ratings, loading };
};

export const useUserRating = (
  userId: string | null | undefined,
  itineraryId: string,
) => {
  const [rating, setRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !itineraryId) {
      setRating(null);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const result = await getUserRating(userId, itineraryId);
        setRating(result);
      } catch (err) {
        console.error(err);
        setRating(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, itineraryId]);

  return { rating, loading };
};

