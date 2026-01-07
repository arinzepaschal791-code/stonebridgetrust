import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Loans.css';

interface Loan {
  id: number;
  name: string;
  slug: string;
  description: string;
  minAmount: string;
  maxAmount: string;
  apr: string;
  termMonths: number;
  features: string;
  imageUrl: string;
}

function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await fetch('/api/loans');
      const data = await res.json();
      if (res.ok) {
        setLoans(data.loans);
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loans-loading">
        <div className="spinner"></div>
        <p>Loading loan options...</p>
      </div>
    );
  }

  return (
    <div className="loans-page">
      <section className="loans-hero">
        <div className="container">
          <h1>Loan Products</h1>
          <p>Find the perfect loan for your needs with competitive rates and flexible terms</p>
        </div>
      </section>

      <section className="loans-content">
        <div className="container">
          <div className="loans-intro">
            <h2>Choose Your Loan</h2>
            <p>Whether you're looking to consolidate debt, buy a car, or grow your business, we have a loan product designed for you. All our loans feature transparent pricing, no hidden fees, and quick approval.</p>
          </div>

          <div className="loans-grid">
            {loans.map((loan) => (
              <Link to={`/loans/${loan.slug}`} key={loan.id} className="loan-card">
                <div className="loan-image">
                  <img src={loan.imageUrl} alt={loan.name} />
                  <div className="loan-apr-badge">
                    From {loan.apr}% APR
                  </div>
                </div>
                <div className="loan-content">
                  <h3>{loan.name}</h3>
                  <p className="loan-description">{loan.description?.slice(0, 120)}...</p>
                  <div className="loan-details">
                    <div className="loan-detail">
                      <span className="detail-label">Amount</span>
                      <span className="detail-value">
                        ${parseFloat(loan.minAmount).toLocaleString()} - ${parseFloat(loan.maxAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="loan-detail">
                      <span className="detail-label">Term</span>
                      <span className="detail-value">Up to {loan.termMonths} months</span>
                    </div>
                  </div>
                  <span className="loan-link">Learn More & Apply &rarr;</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="loan-calculator-section">
            <h2>Loan Calculator</h2>
            <p>Estimate your monthly payments with our loan calculator</p>
            <LoanCalculator />
          </div>
        </div>
      </section>
    </div>
  );
}

function LoanCalculator() {
  const [amount, setAmount] = useState(25000);
  const [apr, setApr] = useState(7.99);
  const [term, setTerm] = useState(36);
  const [result, setResult] = useState<any>(null);

  const calculate = async () => {
    try {
      const res = await fetch(`/api/calculate-loan?principal=${amount}&apr=${apr}&termMonths=${term}`);
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      }
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  useEffect(() => {
    calculate();
  }, [amount, apr, term]);

  return (
    <div className="calculator-card">
      <div className="calculator-inputs">
        <div className="input-group">
          <label>Loan Amount</label>
          <div className="range-input">
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
            <span className="range-value">${amount.toLocaleString()}</span>
          </div>
        </div>
        <div className="input-group">
          <label>Interest Rate (APR %)</label>
          <div className="range-input">
            <input
              type="range"
              min="3"
              max="25"
              step="0.5"
              value={apr}
              onChange={(e) => setApr(parseFloat(e.target.value))}
            />
            <span className="range-value">{apr}%</span>
          </div>
        </div>
        <div className="input-group">
          <label>Loan Term (Months)</label>
          <div className="range-input">
            <input
              type="range"
              min="12"
              max="84"
              step="6"
              value={term}
              onChange={(e) => setTerm(parseInt(e.target.value))}
            />
            <span className="range-value">{term} months</span>
          </div>
        </div>
      </div>
      {result && (
        <div className="calculator-results">
          <div className="result-item primary">
            <span className="result-label">Monthly Payment</span>
            <span className="result-value">${parseFloat(result.monthlyPayment).toLocaleString()}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Total Payment</span>
            <span className="result-value">${parseFloat(result.totalPayment).toLocaleString()}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Total Interest</span>
            <span className="result-value">${parseFloat(result.totalInterest).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loans;
