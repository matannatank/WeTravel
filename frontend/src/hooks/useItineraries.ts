"use client";

import { useEffect, useState } from "react";
import type { Itinerary } from "@/types";
import { subscribeToOwnerItineraries } from "@/lib/itineraries";

export const useItineraries = (ownerId?: string | null) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ownerId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const unsubscribe = subscribeToOwnerItineraries(ownerId, (items) => {
      setItineraries(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [ownerId]);

  return {
    itineraries: ownerId ? itineraries : [],
    loading: ownerId ? loading : false,
  };
};

