import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  createUserProfile,
} from "../services/usersService.js";
import { authenticate, type AuthenticatedRequest } from "../middleware/auth.js";
import { validateUpdateUser } from "../middleware/validation.js";
import type { Response } from "express";

const router = Router();

// Get user profile (public, but limited info)
router.get("/:userId", async (req, res: Response) => {
  try {
    const profile = await getUserProfile(req.params.userId);
    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return limited public info
    res.json({
      id: profile.id,
      displayName: profile.displayName,
      photoURL: profile.photoURL,
      bio: profile.bio,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create/update user profile (protected)
router.post("/", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, displayName, photoURL } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existing = await getUserProfile(req.userId!);
    if (existing) {
      await updateUserProfile(req.userId!, { displayName, photoURL });
      res.json({ success: true });
    } else {
      await createUserProfile(req.userId!, email, displayName, photoURL);
      res.status(201).json({ success: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update own profile (protected)
router.put("/:userId", authenticate, validateUpdateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    if (userId !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await updateUserProfile(userId, req.body);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: error.message || "Failed to update profile" });
  }
});

export default router;

