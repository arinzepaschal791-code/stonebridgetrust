import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { loans, loanApplications } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'stonebridge-trust-secret-key-2024';

function getUserId(req: Request): number | null {
  try {
    const token = req.cookies.token;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

router.get('/loans', async (req: Request, res: Response) => {
  try {
    const allLoans = await db.query.loans.findMany();
    res.json({ loans: allLoans });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

router.get('/loans/:slug', async (req: Request, res: Response) => {
  try {
    const loan = await db.query.loans.findFirst({
      where: eq(loans.slug, req.params.slug)
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ loan });
  } catch (error) {
    console.error('Get loan error:', error);
    res.status(500).json({ error: 'Failed to fetch loan' });
  }
});

router.post('/loans/:id/apply', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Please login to apply for a loan' });
  }

  try {
    const { requestedAmount, termMonths, employmentStatus, annualIncome, purpose } = req.body;
    const loanId = parseInt(req.params.id);

    const loan = await db.query.loans.findFirst({
      where: eq(loans.id, loanId)
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (requestedAmount < parseFloat(loan.minAmount!) || requestedAmount > parseFloat(loan.maxAmount!)) {
      return res.status(400).json({ 
        error: `Loan amount must be between $${loan.minAmount} and $${loan.maxAmount}` 
      });
    }

    const [application] = await db.insert(loanApplications).values({
      userId,
      loanId,
      requestedAmount: requestedAmount.toString(),
      termMonths,
      employmentStatus,
      annualIncome: annualIncome?.toString(),
      purpose,
      status: 'pending'
    }).returning();

    res.status(201).json({
      message: 'Loan application submitted successfully! We will review and get back to you within 2-3 business days.',
      application
    });
  } catch (error) {
    console.error('Loan application error:', error);
    res.status(500).json({ error: 'Failed to submit loan application' });
  }
});

router.get('/my-loan-applications', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const applications = await db.query.loanApplications.findMany({
      where: eq(loanApplications.userId, userId),
      with: {
        loan: true
      }
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.get('/calculate-loan', (req: Request, res: Response) => {
  const { principal, apr, termMonths } = req.query;

  const P = parseFloat(principal as string);
  const r = parseFloat(apr as string) / 100 / 12;
  const n = parseInt(termMonths as string);

  if (isNaN(P) || isNaN(r) || isNaN(n)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const monthlyPayment = r === 0 
    ? P / n 
    : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - P;

  res.json({
    monthlyPayment: monthlyPayment.toFixed(2),
    totalPayment: totalPayment.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    principal: P.toFixed(2),
    apr: parseFloat(apr as string),
    termMonths: n
  });
});

export default router;
