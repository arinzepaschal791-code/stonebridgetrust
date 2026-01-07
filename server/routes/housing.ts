import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { housingOffers, mortgageApplications } from '../db/schema';
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

router.get('/housing', async (req: Request, res: Response) => {
  try {
    const allHousing = await db.query.housingOffers.findMany();
    res.json({ housing: allHousing });
  } catch (error) {
    console.error('Get housing error:', error);
    res.status(500).json({ error: 'Failed to fetch housing offers' });
  }
});

router.get('/housing/:slug', async (req: Request, res: Response) => {
  try {
    const housing = await db.query.housingOffers.findFirst({
      where: eq(housingOffers.slug, req.params.slug)
    });

    if (!housing) {
      return res.status(404).json({ error: 'Housing offer not found' });
    }

    res.json({ housing });
  } catch (error) {
    console.error('Get housing error:', error);
    res.status(500).json({ error: 'Failed to fetch housing offer' });
  }
});

router.post('/housing/:id/apply', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Please login to apply for a mortgage' });
  }

  try {
    const { downPayment, termYears, employmentStatus, annualIncome } = req.body;
    const housingOfferId = parseInt(req.params.id);

    const housing = await db.query.housingOffers.findFirst({
      where: eq(housingOffers.id, housingOfferId)
    });

    if (!housing) {
      return res.status(404).json({ error: 'Housing offer not found' });
    }

    const loanAmount = parseFloat(housing.price!) - downPayment;

    const [application] = await db.insert(mortgageApplications).values({
      userId,
      housingOfferId,
      downPayment: downPayment.toString(),
      loanAmount: loanAmount.toString(),
      termYears,
      employmentStatus,
      annualIncome: annualIncome?.toString(),
      status: 'pending'
    }).returning();

    res.status(201).json({
      message: 'Mortgage application submitted successfully! Our team will contact you within 3-5 business days.',
      application
    });
  } catch (error) {
    console.error('Mortgage application error:', error);
    res.status(500).json({ error: 'Failed to submit mortgage application' });
  }
});

router.get('/my-mortgage-applications', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const applications = await db.query.mortgageApplications.findMany({
      where: eq(mortgageApplications.userId, userId),
      with: {
        housingOffer: true
      }
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.get('/calculate-mortgage', (req: Request, res: Response) => {
  const { principal, apr, termYears } = req.query;

  const P = parseFloat(principal as string);
  const r = parseFloat(apr as string) / 100 / 12;
  const n = parseInt(termYears as string) * 12;

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
    termYears: parseInt(termYears as string)
  });
});

export default router;
