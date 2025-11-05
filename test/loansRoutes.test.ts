import request from 'supertest';
import { app } from 'src/app';

describe('Loan API Controller Tests', () => {
  describe('POST /api/v1/loans - createLoan', () => {
    it('should create a loan successfully', async () => {
      const response = await request(app)
        .post('/api/v1/loans')
        .send({
          amount: 5000,
          purpose: 'Business expansion',
          userId: 'user1',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Loan application created successfully');
      expect(response.body).toHaveProperty('loan');
      expect(response.body.loan).toMatchObject({
        userId: 'user1',
        amount: 5000,
        purpose: 'Business expansion',
        status: 'pending',
      });
      expect(response.body.loan).toHaveProperty('id');
      expect(response.body.loan).toHaveProperty('createdAt');
    });

    it('should return 400 when amount is missing', async () => {
      const response = await request(app)
        .post('/api/v1/loans')
        .send({
          purpose: 'Business expansion',
          userId: 'user1',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Amount and purpose are required');
    });

    it('should return 400 when purpose is missing', async () => {
      const response = await request(app)
        .post('/api/v1/loans')
        .send({
          amount: 5000,
          userId: 'user1',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Amount and purpose are required');
    });

    it('should return 400 when amount is not a positive number', async () => {
      const response = await request(app)
        .post('/api/v1/loans')
        .send({
          amount: -100,
          purpose: 'Business expansion',
          userId: 'user1',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Amount must be a positive number');
    });

    it('should return 400 when amount is zero', async () => {
      const response = await request(app)
        .post('/api/v1/loans')
        .send({
          amount: 0,
          purpose: 'Business expansion',
          userId: 'user1',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Amount must be a positive number');
    });

    it('should return 400 when amount is not a number', async () => {
      const response = await request(app)
        .post('/api/v1/loans')
        .send({
          amount: 'not a number',
          purpose: 'Business expansion',
          userId: 'user1',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Amount must be a positive number');
    });

    it('should create multiple loans with unique IDs', async () => {
      const response1 = await request(app)
        .post('/api/v1/loans')
        .send({
          amount: 1000,
          purpose: 'First loan',
          userId: 'user1',
        });

      const response2 = await request(app)
        .post('/api/v1/loans')
        .send({
          amount: 2000,
          purpose: 'Second loan',
          userId: 'user2',
        });

      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);
      expect(response1.body.loan.id).not.toBe(response2.body.loan.id);
    });
  });

  describe('PUT /api/v1/loans/:id/review - reviewLoan', () => {
    let loanId: string;

    beforeEach(async () => {
      // Create a loan first
      const response = await request(app)
        .post('/api/v1/loans')
        .send({
          amount: 5000,
          purpose: 'Business expansion',
          userId: 'user1',
        });
      loanId = response.body.loan.id;
    });

    it('should review a pending loan successfully', async () => {
      const response = await request(app)
        .put(`/api/v1/loans/${loanId}/review`)
        .send({
          notes: 'Reviewing the application',
          userId: 'officer1',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Loan marked as under review');
      expect(response.body).toHaveProperty('notes', 'Reviewing the application');
      expect(response.body.loan).toMatchObject({
        id: loanId,
        status: 'under_review',
        reviewedBy: 'officer1',
      });
    });

    it('should return 404 when loan does not exist', async () => {
      const response = await request(app)
        .put('/api/v1/loans/nonexistent_id/review')
        .send({
          notes: 'Reviewing',
          userId: 'officer1',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Loan not found');
    });

    it('should return 400 when trying to review a loan that is not pending', async () => {
      // First review the loan
      await request(app)
        .put(`/api/v1/loans/${loanId}/review`)
        .send({
          notes: 'First review',
          userId: 'officer1',
        });

      // Try to review again
      const response = await request(app)
        .put(`/api/v1/loans/${loanId}/review`)
        .send({
          notes: 'Second review',
          userId: 'officer2',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Loan cannot be reviewed. Current status: under_review');
    });

    it('should update the reviewedBy field', async () => {
      const response = await request(app)
        .put(`/api/v1/loans/${loanId}/review`)
        .send({
          notes: 'Checking documents',
          userId: 'officer123',
        });

      expect(response.status).toBe(200);
      expect(response.body.loan.reviewedBy).toBe('officer123');
    });
  });

  describe('GET /api/v1/loans - getLoans', () => {
    beforeEach(async () => {
      // Create multiple loans
      await request(app).post('/api/v1/loans').send({
        amount: 1000,
        purpose: 'Loan 1',
        userId: 'user1',
      });

      await request(app).post('/api/v1/loans').send({
        amount: 2000,
        purpose: 'Loan 2',
        userId: 'user2',
      });

      const loan3Response = await request(app).post('/api/v1/loans').send({
        amount: 3000,
        purpose: 'Loan 3',
        userId: 'user1',
      });

      // Review one loan
      await request(app)
        .put(`/api/v1/loans/${loan3Response.body.loan.id}/review`)
        .send({
          notes: 'Review',
          userId: 'officer1',
        });
    });

    it('should return all loans', async () => {
      const response = await request(app).get('/api/v1/loans');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('loans');
      expect(response.body.loans).toBeInstanceOf(Array);
      expect(response.body.loans.length).toBeGreaterThan(0);
    });

    it('should filter loans by status', async () => {
      const response = await request(app).get('/api/v1/loans?status=pending');

      expect(response.status).toBe(200);
      expect(response.body.loans.every((loan: any) => loan.status === 'pending')).toBe(true);
    });

    it('should filter loans by userId', async () => {
      const response = await request(app).get('/api/v1/loans?userId=user1');

      expect(response.status).toBe(200);
      expect(response.body.loans.every((loan: any) => loan.userId === 'user1')).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should filter loans by both status and userId', async () => {
      const response = await request(app).get('/api/v1/loans?status=pending&userId=user1');

      expect(response.status).toBe(200);
      expect(
        response.body.loans.every(
          (loan: any) => loan.status === 'pending' && loan.userId === 'user1'
        )
      ).toBe(true);
    });

    it('should return empty array when no loans match filters', async () => {
      const response = await request(app).get('/api/v1/loans?userId=nonexistent');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
      expect(response.body.loans).toEqual([]);
    });

    it('should return correct count', async () => {
      const response = await request(app).get('/api/v1/loans');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(response.body.loans.length);
    });
  });

  describe('PUT /api/v1/loans/:id/approve - approveLoan', () => {
    let loanId: string;

    beforeEach(async () => {
      // Create and review a loan
      const createResponse = await request(app).post('/api/v1/loans').send({
        amount: 5000,
        purpose: 'Business loan',
        userId: 'user1',
      });
      loanId = createResponse.body.loan.id;

      await request(app).put(`/api/v1/loans/${loanId}/review`).send({
        notes: 'Reviewed',
        userId: 'officer1',
      });
    });

    it('should approve a loan successfully', async () => {
      const response = await request(app)
        .put(`/api/v1/loans/${loanId}/approve`)
        .send({
          approved: true,
          approvedBy: 'manager1',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Loan approved successfully');
      expect(response.body.loan).toMatchObject({
        id: loanId,
        status: 'approved',
        approvedBy: 'manager1',
      });
    });

    it('should reject a loan successfully', async () => {
      const response = await request(app)
        .put(`/api/v1/loans/${loanId}/approve`)
        .send({
          approved: false,
          approvedBy: 'manager1',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Loan rejected successfully');
      expect(response.body.loan).toMatchObject({
        id: loanId,
        status: 'rejected',
        approvedBy: 'manager1',
      });
    });

    it('should return 404 when loan does not exist', async () => {
      const response = await request(app)
        .put('/api/v1/loans/nonexistent_id/approve')
        .send({
          approved: true,
          approvedBy: 'manager1',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Loan not found');
    });

    it('should return 400 when trying to approve a pending loan', async () => {
      // Create a new pending loan
      const createResponse = await request(app).post('/api/v1/loans').send({
        amount: 1000,
        purpose: 'Another loan',
        userId: 'user2',
      });

      const response = await request(app)
        .put(`/api/v1/loans/${createResponse.body.loan.id}/approve`)
        .send({
          approved: true,
          approvedBy: 'manager1',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'Loan must be under review to approve/reject. Current status: pending'
      );
    });

    it('should return 400 when trying to approve an already approved loan', async () => {
      // First approve the loan
      await request(app).put(`/api/v1/loans/${loanId}/approve`).send({
        approved: true,
        approvedBy: 'manager1',
      });

      // Try to approve again
      const response = await request(app)
        .put(`/api/v1/loans/${loanId}/approve`)
        .send({
          approved: true,
          approvedBy: 'manager2',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'Loan must be under review to approve/reject. Current status: approved'
      );
    });

    it('should update the approvedBy field correctly', async () => {
      const response = await request(app)
        .put(`/api/v1/loans/${loanId}/approve`)
        .send({
          approved: true,
          approvedBy: 'manager123',
        });

      expect(response.status).toBe(200);
      expect(response.body.loan.approvedBy).toBe('manager123');
    });
  });
});