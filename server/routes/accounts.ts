import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { bankAccounts, transactions } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

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

router.get('/accounts', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const accounts = await db.query.bankAccounts.findMany({
      where: eq(bankAccounts.userId, userId)
    });

    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

router.get('/accounts/:id', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const account = await db.query.bankAccounts.findFirst({
      where: eq(bankAccounts.id, parseInt(req.params.id))
    });

    if (!account || account.userId !== userId) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ account });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

router.get('/transactions', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const accounts = await db.query.bankAccounts.findMany({
      where: eq(bankAccounts.userId, userId)
    });

    const accountIds = accounts.map(a => a.id);
    
    const allTransactions = [];
    for (const accountId of accountIds) {
      const txns = await db.query.transactions.findMany({
        where: eq(transactions.accountId, accountId),
        orderBy: [desc(transactions.createdAt)],
        limit: 50
      });
      allTransactions.push(...txns);
    }

    allTransactions.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );

    res.json({ transactions: allTransactions.slice(0, 50) });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.post('/transfer', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { fromAccountId, toAccountNumber, amount, description } = req.body;

    const fromAccount = await db.query.bankAccounts.findFirst({
      where: eq(bankAccounts.id, fromAccountId)
    });

    if (!fromAccount || fromAccount.userId !== userId) {
      return res.status(404).json({ error: 'Source account not found' });
    }

    if (parseFloat(fromAccount.balance!) < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    const newBalance = parseFloat(fromAccount.balance!) - amount;
    await db.update(bankAccounts)
      .set({ balance: newBalance.toFixed(2) })
      .where(eq(bankAccounts.id, fromAccountId));

    await db.insert(transactions).values({
      accountId: fromAccountId,
      type: 'debit',
      amount: amount.toString(),
      description: description || 'Transfer',
      category: 'transfer',
      recipientAccount: toAccountNumber,
      status: 'completed'
    });

    const toAccount = await db.query.bankAccounts.findFirst({
      where: eq(bankAccounts.accountNumber, toAccountNumber)
    });

    if (toAccount) {
      const toNewBalance = parseFloat(toAccount.balance!) + amount;
      await db.update(bankAccounts)
        .set({ balance: toNewBalance.toFixed(2) })
        .where(eq(bankAccounts.id, toAccount.id));

      await db.insert(transactions).values({
        accountId: toAccount.id,
        type: 'credit',
        amount: amount.toString(),
        description: description || 'Transfer received',
        category: 'transfer',
        status: 'completed'
      });
    }

    res.json({ message: 'Transfer completed successfully' });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Failed to complete transfer' });
  }
});

router.get('/dashboard', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const accounts = await db.query.bankAccounts.findMany({
      where: eq(bankAccounts.userId, userId)
    });

    const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || '0'), 0);

    const accountIds = accounts.map(a => a.id);
    const recentTransactions = [];
    for (const accountId of accountIds) {
      const txns = await db.query.transactions.findMany({
        where: eq(transactions.accountId, accountId),
        orderBy: [desc(transactions.createdAt)],
        limit: 10
      });
      recentTransactions.push(...txns);
    }

    recentTransactions.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );

    const monthlyDeposits = recentTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const monthlyExpenses = recentTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    res.json({
      accounts,
      totalBalance,
      monthlyDeposits,
      monthlyExpenses,
      recentTransactions: recentTransactions.slice(0, 10)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
