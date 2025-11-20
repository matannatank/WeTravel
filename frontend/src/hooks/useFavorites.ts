"use client";

import { useEffect, useState } from "react";
import {
  subscribeToUserFavorites,
  isFavorite as checkIsFavorite,
  type Favorite,
} from "@/lib/favorites";

export const useFavorites = (userId?: string | null) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToUserFavorites(userId, (items) => {
      setFavorites(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [userId]);

  return {
    favorites,
    loading,
    favoriteIds: favorites.map((f) => f.itineraryId),
  };
};

export const useIsFavorite = (
  userId: string | null | undefined,
  itineraryId: string,
) => {
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !itineraryId) {
      setFavorite(false);
      setLoading(false);
      return;
    }

    const check = async () => {
      try {
        const result = await checkIsFavorite(userId, itineraryId);
        setFavorite(result);
      } catch (err) {
        console.error(err);
        setFavorite(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [userId, itineraryId]);

  return { favorite, loading };
};

