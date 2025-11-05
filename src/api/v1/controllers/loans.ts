import { Request, Response } from "express";
import { Loan } from "../types";

const loans: Loan[] = [];
let loanCounter = 1;

export const createLoan = async (req: Request, res: Response) => {
  const { amount, purpose } = req.body;

  if (!amount || !purpose) {
    return res.status(400).json({ error: "Amount and purpose are required" });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }

  const loan: Loan = {
    id: `loan_${loanCounter++}`,
    userId: res.locals.userId,
    amount,
    purpose,
    status: "pending",
    createdAt: new Date(),
  };

  loans.push(loan);

  res.status(201).json({
    message: "Loan application created successfully",
    loan,
  });
};

export const reviewLoan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;

  const loan = loans.find((l) => l.id === id);

  if (!loan) {
    return res.status(404).json({ error: "Loan not found" });
  }

  if (loan.status !== "pending") {
    return res.status(400).json({
      error: `Loan cannot be reviewed. Current status: ${loan.status}`,
    });
  }

  loan.status = "under_review";
  loan.reviewedBy = res.locals.userId;

  res.json({
    message: "Loan marked as under review",
    loan,
    notes,
  });
};

export const getLoans = async (req: Request, res: Response) => {
  const { status, userId } = req.query;

  let filteredLoans = [...loans];

  if (status) {
    filteredLoans = filteredLoans.filter((loan) => loan.status === status);
  }

  if (userId) {
    filteredLoans = filteredLoans.filter((loan) => loan.userId === userId);
  }

  res.json({
    count: filteredLoans.length,
    loans: filteredLoans,
  });
};

export const approveLoan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { approved } = req.body;

  const loan = loans.find((l) => l.id === id);

  if (!loan) {
    return res.status(404).json({ error: "Loan not found" });
  }

  if (loan.status !== "under_review") {
    return res.status(400).json({
      error: `Loan must be under review to approve/reject. Current status: ${loan.status}`,
    });
  }

  loan.status = approved ? "approved" : "rejected";
  loan.approvedBy = res.locals.userId;

  res.json({
    message: `Loan ${approved ? "approved" : "rejected"} successfully`,
    loan,
  });
};
