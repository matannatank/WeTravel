import type { Request, Response, NextFunction } from "express";

export const validateCreateItinerary = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, primaryDestination } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({
      error: "Title is required and must be at least 3 characters",
    });
  }

  if (!primaryDestination || typeof primaryDestination !== "string" || primaryDestination.trim().length < 2) {
    return res.status(400).json({
      error: "Primary destination is required and must be at least 2 characters",
    });
  }

  next();
};

export const validateCreateReport = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { itineraryId, reason } = req.body;

  if (!itineraryId || typeof itineraryId !== "string") {
    return res.status(400).json({ error: "Itinerary ID is required" });
  }

  const validReasons = ["offensive", "spam", "copyright", "other"];
  if (!reason || !validReasons.includes(reason)) {
    return res.status(400).json({
      error: `Reason must be one of: ${validReasons.join(", ")}`,
    });
  }

  next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { displayName, bio } = req.body;

  if (displayName !== undefined) {
    if (typeof displayName !== "string" || displayName.trim().length < 2) {
      return res.status(400).json({
        error: "Display name must be at least 2 characters",
      });
    }
  }

  if (bio !== undefined && typeof bio !== "string") {
    return res.status(400).json({ error: "Bio must be a string" });
  }

  next();
};

