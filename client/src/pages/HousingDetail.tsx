import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HousingDetail.css';

interface HousingOffer {
  id: number;
  title: string;
  slug: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  features: string | string[];
  propertyType: string;
  mortgageRate: string;
  imageUrl: string;
}

function HousingDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [housing, setHousing] = useState<HousingOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const [formData, setFormData] = useState({
    downPayment: 20,
    termYears: 30,
    employmentStatus: 'employed',
    annualIncome: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    fetchHousing();
  }, [slug]);

  useEffect(() => {
    if (housing) {
      calculateMortgage();
    }
  }, [housing, formData.downPayment, formData.termYears]);

  const fetchHousing = async () => {
    try {
      const res = await fetch(`/api/housing/${slug}`);
      const data = await res.json();
      if (res.ok) {
        setHousing(data.housing);
      }
    } catch (error) {
      console.error('Failed to fetch housing:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMortgage = async () => {
    if (!housing) return;
    const price = parseFloat(housing.price);
    const downPaymentAmount = price * (formData.downPayment / 100);
    const principal = price - downPaymentAmount;
    
    try {
      const res = await fetch(`/api/calculate-mortgage?principal=${principal}&apr=${housing.mortgageRate}&termYears=${formData.termYears}`);
      const data = await res.json();
      if (res.ok) {
        setCalculation({ ...data, downPaymentAmount, principal });
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

    const price = parseFloat(housing?.price || '0');
    const downPaymentAmount = price * (formData.downPayment / 100);

    try {
      const res = await fetch(`/api/housing/${housing?.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          downPayment: downPaymentAmount,
          termYears: formData.termYears,
          employmentStatus: formData.employmentStatus,
          annualIncome: formData.annualIncome
        })
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
      <div className="housing-detail-loading">
        <div className="spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!housing) {
    return (
      <div className="housing-not-found">
        <h1>Property Not Found</h1>
        <p>The property you're looking for doesn't exist.</p>
      </div>
    );
  }

  const features = housing.features 
    ? (typeof housing.features === 'string' ? JSON.parse(housing.features) : housing.features)
    : [];

  return (
    <div className="housing-detail-page">
      <div className="housing-gallery">
        <img src={housing.imageUrl} alt={housing.title} className="main-image" />
      </div>

      <div className="container housing-detail-content">
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <div className="housing-detail-grid">
          <div className="housing-info">
            <div className="housing-header">
              <div>
                <span className="property-type">{housing.propertyType}</span>
                <h1>${parseFloat(housing.price).toLocaleString()}</h1>
                <h2>{housing.title}</h2>
                <p className="location">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {housing.location}
                </p>
              </div>
            </div>

            <div className="property-specs">
              <div className="spec">
                <span className="spec-value">{housing.bedrooms}</span>
                <span className="spec-label">Bedrooms</span>
              </div>
              <div className="spec">
                <span className="spec-value">{housing.bathrooms}</span>
                <span className="spec-label">Bathrooms</span>
              </div>
              <div className="spec">
                <span className="spec-value">{housing.sqft?.toLocaleString()}</span>
                <span className="spec-label">Sq Ft</span>
              </div>
              <div className="spec">
                <span className="spec-value">{housing.mortgageRate}%</span>
                <span className="spec-label">APR</span>
              </div>
            </div>

            <section className="property-section">
              <h3>About This Property</h3>
              <p>{housing.description}</p>
            </section>

            <section className="property-section">
              <h3>Property Features</h3>
              <ul className="property-features">
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
          </div>

          <div className="housing-sidebar">
            <div className="mortgage-calculator-card">
              <h3>Mortgage Calculator</h3>
              
              <div className="calc-input">
                <label>Down Payment ({formData.downPayment}%)</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={formData.downPayment}
                  onChange={(e) => setFormData({ ...formData, downPayment: parseInt(e.target.value) })}
                />
                <span className="calc-value">
                  ${(parseFloat(housing.price) * (formData.downPayment / 100)).toLocaleString()}
                </span>
              </div>

              <div className="calc-input">
                <label>Loan Term</label>
                <select
                  value={formData.termYears}
                  onChange={(e) => setFormData({ ...formData, termYears: parseInt(e.target.value) })}
                  className="form-input"
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>

              {calculation && (
                <div className="calc-results">
                  <div className="calc-result primary">
                    <span>Monthly Payment</span>
                    <strong>${parseFloat(calculation.monthlyPayment).toLocaleString()}</strong>
                  </div>
                  <div className="calc-result">
                    <span>Down Payment</span>
                    <strong>${calculation.downPaymentAmount?.toLocaleString()}</strong>
                  </div>
                  <div className="calc-result">
                    <span>Loan Amount</span>
                    <strong>${parseFloat(calculation.principal).toLocaleString()}</strong>
                  </div>
                  <div className="calc-result">
                    <span>Total Interest</span>
                    <strong>${parseFloat(calculation.totalInterest).toLocaleString()}</strong>
                  </div>
                </div>
              )}

              <button 
                className="btn btn-primary btn-full"
                onClick={() => setShowApplication(true)}
              >
                Apply for Mortgage
              </button>

              <p className="calculator-note">
                * Rates shown are estimates. Your actual rate may vary based on credit history and other factors.
              </p>
            </div>

            <div className="contact-card">
              <h4>Interested in this property?</h4>
              <p>Contact our mortgage specialists for personalized assistance.</p>
              <p className="contact-phone">1-800-STONE-TRUST</p>
            </div>
          </div>
        </div>
      </div>

      {showApplication && (
        <div className="modal-overlay" onClick={() => setShowApplication(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowApplication(false)}>&times;</button>
            <h2>Apply for Mortgage</h2>
            <p className="modal-subtitle">{housing.title} - ${parseFloat(housing.price).toLocaleString()}</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Down Payment (%)</label>
                <select
                  className="form-input"
                  value={formData.downPayment}
                  onChange={(e) => setFormData({ ...formData, downPayment: parseInt(e.target.value) })}
                >
                  <option value="5">5% - ${(parseFloat(housing.price) * 0.05).toLocaleString()}</option>
                  <option value="10">10% - ${(parseFloat(housing.price) * 0.10).toLocaleString()}</option>
                  <option value="15">15% - ${(parseFloat(housing.price) * 0.15).toLocaleString()}</option>
                  <option value="20">20% - ${(parseFloat(housing.price) * 0.20).toLocaleString()}</option>
                  <option value="25">25% - ${(parseFloat(housing.price) * 0.25).toLocaleString()}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Loan Term</label>
                <select
                  className="form-input"
                  value={formData.termYears}
                  onChange={(e) => setFormData({ ...formData, termYears: parseInt(e.target.value) })}
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="30">30 years</option>
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
                  placeholder="$100,000"
                  required
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

export default HousingDetail;
