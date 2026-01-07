import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: string;
  currency: string;
  status: string;
}

interface Transaction {
  id: number;
  type: string;
  amount: string;
  description: string;
  category: string;
  createdAt: string;
}

interface DashboardData {
  accounts: Account[];
  totalBalance: number;
  monthlyDeposits: number;
  monthlyExpenses: number;
  recentTransactions: Transaction[];
}

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard', { credentials: 'include' });
      const result = await res.json();
      if (res.ok) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const primaryAccount = data?.accounts?.find(a => a.accountType === 'checking');

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user.firstName}</p>
          </div>
          {!user.emailVerified && (
            <div className="email-warning">
              <span>Please verify your email to access all features</span>
              <button className="btn btn-ghost" onClick={async () => {
                await fetch('/api/auth/resend-verification', { method: 'POST', credentials: 'include' });
                alert('Verification email sent!');
              }}>Resend Email</button>
            </div>
          )}
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h.01M6 12h.01M6 16h12" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Account Limit</span>
              <span className="stat-value">$500,000.00</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Monthly Deposits</span>
              <span className="stat-value">${(data?.monthlyDeposits || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Monthly Expenses</span>
              <span className="stat-value">${(data?.monthlyExpenses || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 6l-9.5 9.5-5-5L1 18" />
                <path d="M17 6h6v6" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Volume</span>
              <span className="stat-value">${(data?.totalBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="main-content">
            <div className="account-card primary-account">
              <div className="account-header">
                <span className="bank-badge">Stonebridge Trust Bank</span>
                <span className="account-type">Primary Account</span>
              </div>
              <div className="account-holder">
                <p className="holder-label">Account Holder</p>
                <p className="holder-name">{user.firstName} {user.lastName}</p>
                <div className="account-badges">
                  <span className="badge active">Account Active</span>
                  <span className="badge verified">{user.emailVerified ? 'Verified & Secured' : 'Pending Verification'}</span>
                </div>
              </div>
              <div className="account-balances">
                <div className="balance-item">
                  <span className="balance-label">Fiat Balance</span>
                  <span className="balance-value">${parseFloat(primaryAccount?.balance || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="balance-currency">USD Balance</span>
                </div>
              </div>
              <div className="account-total">
                <span>Total Portfolio</span>
                <span className="total-value">${(data?.totalBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="account-actions">
                <Link to="/transfer" className="btn btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  Send Money
                </Link>
                <button className="btn btn-outline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Money
                </button>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <Link to="/transfer" className="action-item">
                  <div className="action-icon blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 1l4 4-4 4" />
                      <path d="M3 11V9a4 4 0 014-4h14" />
                      <path d="M7 23l-4-4 4-4" />
                      <path d="M21 13v2a4 4 0 01-4 4H3" />
                    </svg>
                  </div>
                  <span>Transfer</span>
                </Link>
                <div className="action-item">
                  <div className="action-icon green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </div>
                  <span>Pay Bills</span>
                </div>
                <Link to="/loans" className="action-item">
                  <div className="action-icon orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <span>Request Loan</span>
                </Link>
                <Link to="/transactions" className="action-item">
                  <div className="action-icon purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                  </div>
                  <span>Bank Details</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="sidebar-content">
            <div className="transactions-card">
              <div className="card-header">
                <h3>Recent Transactions</h3>
                <Link to="/transactions" className="view-all">View All</Link>
              </div>
              <div className="transactions-list">
                {data?.recentTransactions?.slice(0, 5).map((txn) => (
                  <div key={txn.id} className="transaction-item">
                    <div className={`txn-icon ${txn.type}`}>
                      {txn.type === 'credit' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                      )}
                    </div>
                    <div className="txn-details">
                      <span className="txn-desc">{txn.description || txn.category}</span>
                      <span className="txn-date">{new Date(txn.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`txn-amount ${txn.type}`}>
                      {txn.type === 'credit' ? '+' : '-'}${parseFloat(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
                {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                  <p className="no-transactions">No recent transactions</p>
                )}
              </div>
            </div>

            <div className="statistics-card">
              <h3>Account Statistics</h3>
              <div className="stat-row">
                <span>Transaction Limit</span>
                <span className="stat-val">$500,000.00</span>
              </div>
              <div className="stat-row">
                <span>Pending Transactions</span>
                <span className="stat-val">$0.00</span>
              </div>
              <div className="stat-row">
                <span>Total Volume</span>
                <span className="stat-val">${(data?.totalBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
