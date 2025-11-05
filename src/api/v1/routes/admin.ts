// ============================================
import { Router } from "express";
import {
  setUserClaims,
  getUserById,
  listUsers,
} from "../controllers/admin";
import authenticate from "../middleware/authenticate";

const router = Router();

// Get user by ID (authenticated users can view)
router.get(
  "/:userId",
  authenticate,
  getUserById
);

// Set custom claims for a user
router.post(
  "/users/:userId/claims",
  authenticate,
  setUserClaims
);

router.get(
  "/users",
  authenticate,
  listUsers
);

export default router;
