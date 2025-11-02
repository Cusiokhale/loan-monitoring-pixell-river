export interface User {
  id: string;
  role: 'user' | 'officer' | 'manager';
}

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedBy?: string;
  approvedBy?: string;
}

export interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    error?: string;
    code?: string;
}

export const successResponse = <T>(
    data?: T,
    message?: string
): ApiResponse<T> => ({
    status: "success",
    data,
    message,
});