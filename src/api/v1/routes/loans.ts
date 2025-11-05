import { Router } from "express";
import * as loanController from "../controllers/loans";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["user"] }),
  loanController.createLoan
);
router.put(
  "/:id/review",
  authenticate,
  isAuthorized({ hasRole: ["officer"] }),
  loanController.reviewLoan
);
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["officer", "manager"] }),
  loanController.getLoans
);
router.put(
  "/:id/approve",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  loanController.approveLoan
);

export default router;
