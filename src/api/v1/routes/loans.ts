import { Router } from "express";
import * as loanController from "../controllers/loans";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

/**
 * @swagger
 * /loans:
 *   post:
 *     summary: Create a new loan application
 *     description: Allows authenticated users with the 'user' role to submit a new loan application. The loan is created with a 'pending' status.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLoanRequest'
 *           examples:
 *             homeRenovation:
 *               summary: Home renovation loan
 *               value:
 *                 amount: 50000
 *                 purpose: Home renovation
 *             businessExpansion:
 *               summary: Business expansion loan
 *               value:
 *                 amount: 100000
 *                 purpose: Business expansion
 *             education:
 *               summary: Education loan
 *               value:
 *                 amount: 25000
 *                 purpose: Education expenses
 *     responses:
 *       201:
 *         description: Loan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Loan created successfully
 *                 loan:
 *                   $ref: '#/components/schemas/Loan'
 *             example:
 *               message: Loan created successfully
 *               loan:
 *                 id: loan123abc
 *                 userId: user456def
 *                 amount: 50000
 *                 purpose: Home renovation
 *                 status: pending
 *                 createdAt: "2024-01-15T10:30:00Z"
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["user"] }),
  loanController.createLoan
);

/**
 * @swagger
 * /loans/{id}/review:
 *   put:
 *     summary: Review a loan application
 *     description: Allows loan officers to review a pending loan application and move it to 'under_review' status. Officers can add review notes during this process.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the loan to review
 *         example: loan123abc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewLoanRequest'
 *           examples:
 *             positiveReview:
 *               summary: Positive review
 *               value:
 *                 notes: Documents verified, customer has excellent credit history. Recommending for approval.
 *             needsMoreInfo:
 *               summary: Needs additional information
 *               value:
 *                 notes: Additional income documentation required before proceeding with approval.
 *     responses:
 *       200:
 *         description: Loan reviewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Loan reviewed successfully
 *                 loan:
 *                   $ref: '#/components/schemas/Loan'
 *                 notes:
 *                   type: string
 *                   example: Documents verified, customer has good credit history
 *             example:
 *               message: Loan reviewed successfully
 *               loan:
 *                 id: loan123abc
 *                 userId: user456def
 *                 amount: 50000
 *                 purpose: Home renovation
 *                 status: under_review
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 reviewedBy: officer789ghi
 *               notes: Documents verified, customer has good credit history
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put(
  "/:id/review",
  authenticate,
  isAuthorized({ hasRole: ["officer"] }),
  loanController.reviewLoan
);

/**
 * @swagger
 * /loans:
 *   get:
 *     summary: Get all loan applications
 *     description: Retrieves a list of loan applications. Officers and managers can view all loans. Supports filtering by status and userId.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, under_review, approved, rejected]
 *         description: Filter loans by status
 *         example: pending
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter loans by user ID
 *         example: user456def
 *     responses:
 *       200:
 *         description: List of loans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of loans matching the criteria
 *                   example: 2
 *                 loans:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Loan'
 *             examples:
 *               allLoans:
 *                 summary: All loans
 *                 value:
 *                   count: 2
 *                   loans:
 *                     - id: loan123abc
 *                       userId: user456def
 *                       amount: 50000
 *                       purpose: Home renovation
 *                       status: pending
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                     - id: loan789ghi
 *                       userId: user111jkl
 *                       amount: 75000
 *                       purpose: Business expansion
 *                       status: under_review
 *                       createdAt: "2024-01-16T14:20:00Z"
 *                       reviewedBy: officer222mno
 *               pendingLoans:
 *                 summary: Pending loans only
 *                 value:
 *                   count: 1
 *                   loans:
 *                     - id: loan123abc
 *                       userId: user456def
 *                       amount: 50000
 *                       purpose: Home renovation
 *                       status: pending
 *                       createdAt: "2024-01-15T10:30:00Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["officer", "manager"] }),
  loanController.getLoans
);

/**
 * @swagger
 * /loans/{id}/approve:
 *   put:
 *     summary: Approve or reject a loan application
 *     description: Allows managers to make a final decision on a loan that is under review. The loan can be either approved or rejected.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the loan to approve/reject
 *         example: loan123abc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveLoanRequest'
 *           examples:
 *             approve:
 *               summary: Approve loan
 *               value:
 *                 approved: true
 *             reject:
 *               summary: Reject loan
 *               value:
 *                 approved: false
 *     responses:
 *       200:
 *         description: Loan decision recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Loan approved successfully
 *                 loan:
 *                   $ref: '#/components/schemas/Loan'
 *             examples:
 *               approved:
 *                 summary: Loan approved
 *                 value:
 *                   message: Loan approved successfully
 *                   loan:
 *                     id: loan123abc
 *                     userId: user456def
 *                     amount: 50000
 *                     purpose: Home renovation
 *                     status: approved
 *                     createdAt: "2024-01-15T10:30:00Z"
 *                     reviewedBy: officer789ghi
 *                     approvedBy: manager012jkl
 *               rejected:
 *                 summary: Loan rejected
 *                 value:
 *                   message: Loan rejected
 *                   loan:
 *                     id: loan123abc
 *                     userId: user456def
 *                     amount: 50000
 *                     purpose: Home renovation
 *                     status: rejected
 *                     createdAt: "2024-01-15T10:30:00Z"
 *                     reviewedBy: officer789ghi
 *                     approvedBy: manager012jkl
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put(
  "/:id/approve",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  loanController.approveLoan
);

export default router;
