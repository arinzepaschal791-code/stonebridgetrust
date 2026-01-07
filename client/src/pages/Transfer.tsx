import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Transfer.css';

interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: string;
}

function Transfer() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferType, setTransferType] = useState<'local' | 'wire'>('local');
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setAccounts(data.accounts);
        if (data.accounts.length > 0) {
          setFormData(prev => ({ ...prev, fromAccountId: data.accounts[0].id.toString() }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fromAccountId: parseInt(formData.fromAccountId),
          toAccountNumber: formData.toAccountNumber,
          amount: parseFloat(formData.amount),
          description: formData.description
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setFormData(prev => ({ ...prev, toAccountNumber: '', amount: '', description: '' }));
        fetchAccounts();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to complete transfer' });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="transfer-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const selectedAccount = accounts.find(a => a.id.toString() === formData.fromAccountId);

  return (
    <div className="transfer-page">
      <div className="container">
        <div className="transfer-header">
          <h1>Send Money</h1>
          <p>Transfer funds securely to any account</p>
        </div>

        <div className="transfer-grid">
          <div className="transfer-form-section">
            <div className="transfer-type-selector">
              <button
                className={`type-btn ${transferType === 'local' ? 'active' : ''}`}
                onClick={() => setTransferType('local')}
              >
                <div className="type-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </div>
                <div className="type-info">
                  <span className="type-name">Local Transfer</span>
                  <span className="type-desc">Send money to local accounts instantly</span>
                  <div className="type-badges">
                    <span className="badge instant">Instant</span>
                    <span className="badge free">0% Fee</span>
                  </div>
                </div>
              </button>
              <button
                className={`type-btn ${transferType === 'wire' ? 'active' : ''}`}
                onClick={() => setTransferType('wire')}
              >
                <div className="type-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <div className="type-info">
                  <span className="type-name">International Wire</span>
                  <span className="type-desc">Global transfers within 72 hours</span>
                  <div className="type-badges">
                    <span className="badge secure">Secure</span>
                    <span className="badge time">72hrs</span>
                  </div>
                </div>
              </button>
            </div>

            {message.text && (
              <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} className="transfer-form">
              <div className="form-group">
                <label className="form-label">From Account</label>
                <select
                  className="form-input"
                  value={formData.fromAccountId}
                  onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                  required
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} - {account.accountNumber} (${parseFloat(account.balance).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Recipient Account Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.toAccountNumber}
                  onChange={(e) => setFormData({ ...formData, toAccountNumber: e.target.value })}
                  placeholder="Enter account number"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount</label>
                <div className="amount-input">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a note"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? <span className="spinner"></span> : 'Send Money'}
              </button>
            </form>
          </div>

          <div className="transfer-sidebar">
            <div className="account-summary-card">
              <h3>Account Summary</h3>
              {selectedAccount && (
                <>
                  <div className="summary-row">
                    <span>Account</span>
                    <strong>{selectedAccount.accountNumber}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Type</span>
                    <strong>{selectedAccount.accountType}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Available Balance</span>
                    <strong className="balance">${parseFloat(selectedAccount.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </>
              )}
            </div>

            <div className="security-info">
              <div className="security-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4>Bank-Grade Security</h4>
              <p>All transfers are protected by bank-grade encryption and require verification for your security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
