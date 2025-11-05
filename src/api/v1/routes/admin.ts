// ============================================
import { Router } from "express";
import {
  setUserClaims,
  getUserById,
  listUsers,
} from "../controllers/admin";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

// Get user by ID (authenticated users can view)
router.get(
  "/:userId",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  getUserById
);

// Set custom claims for a user
router.post(
  "/users/:userId/claims",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  setUserClaims
);

router.get(
  "/users",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  listUsers
);

export default router;
