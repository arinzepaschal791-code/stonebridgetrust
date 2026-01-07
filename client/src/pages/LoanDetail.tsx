import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoanDetail.css';

interface Loan {
  id: number;
  name: string;
  slug: string;
  description: string;
  minAmount: string;
  maxAmount: string;
  apr: string;
  termMonths: number;
  features: string | string[];
  requirements: string;
  imageUrl: string;
}

function LoanDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const [formData, setFormData] = useState({
    requestedAmount: 10000,
    termMonths: 36,
    employmentStatus: 'employed',
    annualIncome: '',
    purpose: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    fetchLoan();
  }, [slug]);

  useEffect(() => {
    if (loan) {
      calculatePayment();
    }
  }, [loan, formData.requestedAmount, formData.termMonths]);

  const fetchLoan = async () => {
    try {
      const res = await fetch(`/api/loans/${slug}`);
      const data = await res.json();
      if (res.ok) {
        setLoan(data.loan);
        setFormData(prev => ({
          ...prev,
          requestedAmount: parseFloat(data.loan.minAmount),
          termMonths: Math.min(36, data.loan.termMonths)
        }));
      }
    } catch (error) {
      console.error('Failed to fetch loan:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePayment = async () => {
    if (!loan) return;
    try {
      const res = await fetch(`/api/calculate-loan?principal=${formData.requestedAmount}&apr=${loan.apr}&termMonths=${formData.termMonths}`);
      const data = await res.json();
      if (res.ok) {
        setCalculation(data);
      }
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`/api/loans/${loan?.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setShowApplication(false);
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit application' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loan-detail-loading">
        <div className="spinner"></div>
        <p>Loading loan details...</p>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="loan-not-found">
        <h1>Loan Not Found</h1>
        <p>The loan you're looking for doesn't exist.</p>
      </div>
    );
  }

  const features = loan.features 
    ? (typeof loan.features === 'string' ? JSON.parse(loan.features) : loan.features)
    : [];

  return (
    <div className="loan-detail-page">
      <div className="loan-hero" style={{ backgroundImage: `url(${loan.imageUrl})` }}>
        <div className="loan-hero-overlay"></div>
        <div className="container loan-hero-content">
          <div className="loan-hero-badge">From {loan.apr}% APR</div>
          <h1>{loan.name}</h1>
          <p>{loan.description?.slice(0, 200)}...</p>
        </div>
      </div>

      <div className="container loan-detail-content">
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <div className="loan-detail-grid">
          <div className="loan-info">
            <section className="info-section">
              <h2>About This Loan</h2>
              <p>{loan.description}</p>
            </section>

            <section className="info-section">
              <h2>Key Features</h2>
              <ul className="features-list">
                {features.map((feature: string, index: number) => (
                  <li key={index}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section className="info-section">
              <h2>Requirements</h2>
              <p>{loan.requirements}</p>
            </section>

            <section className="info-section">
              <h2>How to Apply</h2>
              <div className="apply-steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <div>
                    <h4>Check Your Rate</h4>
                    <p>Use our calculator to see estimated payments without affecting your credit score.</p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <div>
                    <h4>Submit Application</h4>
                    <p>Complete the online application with your personal and financial information.</p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <div>
                    <h4>Get Approved</h4>
                    <p>Receive a decision within 2-3 business days. Funds can be deposited as fast as next day.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="loan-sidebar">
            <div className="loan-calculator-card">
              <h3>Calculate Your Payment</h3>
              
              <div className="calc-input">
                <label>Loan Amount</label>
                <input
                  type="range"
                  min={parseFloat(loan.minAmount)}
                  max={parseFloat(loan.maxAmount)}
                  step="1000"
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({ ...formData, requestedAmount: parseInt(e.target.value) })}
                />
                <span className="calc-value">${formData.requestedAmount.toLocaleString()}</span>
              </div>

              <div className="calc-input">
                <label>Loan Term</label>
                <select
                  value={formData.termMonths}
                  onChange={(e) => setFormData({ ...formData, termMonths: parseInt(e.target.value) })}
                  className="form-input"
                >
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                  {loan.termMonths >= 72 && <option value="72">72 months</option>}
                  {loan.termMonths >= 84 && <option value="84">84 months</option>}
                </select>
              </div>

              {calculation && (
                <div className="calc-results">
                  <div className="calc-result primary">
                    <span>Monthly Payment</span>
                    <strong>${parseFloat(calculation.monthlyPayment).toLocaleString()}</strong>
                  </div>
                  <div className="calc-result">
                    <span>Total Interest</span>
                    <strong>${parseFloat(calculation.totalInterest).toLocaleString()}</strong>
                  </div>
                  <div className="calc-result">
                    <span>Total Payment</span>
                    <strong>${parseFloat(calculation.totalPayment).toLocaleString()}</strong>
                  </div>
                </div>
              )}

              <button 
                className="btn btn-primary btn-full"
                onClick={() => setShowApplication(true)}
              >
                Apply Now
              </button>
            </div>

            <div className="loan-quick-facts">
              <h4>Quick Facts</h4>
              <div className="fact">
                <span>APR</span>
                <strong>{loan.apr}%</strong>
              </div>
              <div className="fact">
                <span>Loan Range</span>
                <strong>${parseFloat(loan.minAmount).toLocaleString()} - ${parseFloat(loan.maxAmount).toLocaleString()}</strong>
              </div>
              <div className="fact">
                <span>Max Term</span>
                <strong>{loan.termMonths} months</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplication && (
        <div className="modal-overlay" onClick={() => setShowApplication(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowApplication(false)}>&times;</button>
            <h2>Apply for {loan.name}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Loan Amount</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({ ...formData, requestedAmount: parseInt(e.target.value) })}
                  min={parseFloat(loan.minAmount)}
                  max={parseFloat(loan.maxAmount)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Term (Months)</label>
                <select
                  className="form-input"
                  value={formData.termMonths}
                  onChange={(e) => setFormData({ ...formData, termMonths: parseInt(e.target.value) })}
                >
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select
                  className="form-input"
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                >
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="retired">Retired</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Annual Income</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  placeholder="$50,000"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Purpose of Loan</label>
                <textarea
                  className="form-input"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Describe why you need this loan..."
                  rows={3}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? <span className="spinner"></span> : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanDetail;
