import type { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import { getUserProfile } from "../services/usersService.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
  isAdmin?: boolean;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn(`[${new Date().toISOString()}] Missing auth header for ${req.method} ${req.path}`);
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);
    const decodedToken = await getAuth().verifyIdToken(token);
    
    req.userId = decodedToken.uid;
    req.userEmail = decodedToken.email;

    // Check if user is admin
    const profile = await getUserProfile(decodedToken.uid);
    req.isAdmin = profile?.role === "admin" || false;

    console.log(`[${new Date().toISOString()}] Authenticated user: ${decodedToken.uid}${req.isAdmin ? " (admin)" : ""}`);
    next();
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] Authentication error:`, error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

