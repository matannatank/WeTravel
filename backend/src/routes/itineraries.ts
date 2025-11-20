import { Router } from "express";
import {
  createItinerary,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  getUserItineraries,
  getPublicItineraries,
} from "../services/itinerariesService.js";
import { authenticate, type AuthenticatedRequest } from "../middleware/auth.js";
import { validateCreateItinerary } from "../middleware/validation.js";
import type { Response } from "express";

const router = Router();

// Public routes
router.get("/public", async (req, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const itineraries = await getPublicItineraries(limit);
    res.json({ itineraries });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res: Response) => {
  try {
    const itinerary = await getItinerary(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.json({ itinerary });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes
router.post("/", authenticate, validateCreateItinerary, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = {
      ...req.body,
      ownerId: req.userId!,
    };
    const id = await createItinerary(payload);
    res.status(201).json({ id });
  } catch (error: any) {
    console.error("Error creating itinerary:", error);
    res.status(500).json({ error: error.message || "Failed to create itinerary" });
  }
});

router.put("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const itinerary = await getItinerary(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    if (itinerary.ownerId !== req.userId) {
      return res.status(403).json({ error: "Not authorized to update this itinerary" });
    }

    await updateItinerary(req.params.id, req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const itinerary = await getItinerary(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    if (itinerary.ownerId !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: "Not authorized to delete this itinerary" });
    }

    await deleteItinerary(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:ownerId", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ownerId = req.params.ownerId;
    
    // Users can only see their own itineraries unless they're admin
    if (ownerId !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const itineraries = await getUserItineraries(ownerId);
    res.json({ itineraries });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

