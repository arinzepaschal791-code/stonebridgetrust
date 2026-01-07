import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">Bank With Confidence</h1>
          <p className="hero-subtitle">
            Experience trusted, secure banking with Stonebridge Trust. 
            From personal loans to mortgages, we're here to help you achieve your financial goals.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Open an Account
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Login to Banking
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Stonebridge Trust?</h2>
          <p className="section-subtitle text-center">
            For over 35 years, we've helped millions of customers achieve their financial dreams.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Bank-Grade Security</h3>
              <p>Your money and data are protected with state-of-the-art encryption and 24/7 fraud monitoring.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3>24/7 Online Banking</h3>
              <p>Manage your accounts anytime, anywhere with our easy-to-use online and mobile banking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <h3>Competitive Rates</h3>
              <p>Enjoy some of the best rates in the industry for loans, savings, and mortgages.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3>Personal Service</h3>
              <p>Get dedicated support from our team of financial experts who truly care about your success.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="products">
        <div className="container">
          <h2 className="section-title text-center">Our Financial Products</h2>
          <div className="products-grid">
            <Link to="/loans" className="product-card">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600" 
                alt="Personal Loans" 
              />
              <div className="product-content">
                <h3>Personal Loans</h3>
                <p>Flexible loans for any purpose with competitive rates starting at 7.99% APR</p>
                <span className="product-link">Learn More &rarr;</span>
              </div>
            </Link>
            <Link to="/loans" className="product-card">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600" 
                alt="Auto Loans" 
              />
              <div className="product-content">
                <h3>Auto Loans</h3>
                <p>Drive your dream car with rates as low as 5.49% APR</p>
                <span className="product-link">Learn More &rarr;</span>
              </div>
            </Link>
            <Link to="/housing" className="product-card">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" 
                alt="Home Mortgages" 
              />
              <div className="product-content">
                <h3>Home Mortgages</h3>
                <p>Make your dream home a reality with our flexible mortgage options</p>
                <span className="product-link">Learn More &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Open your account today and experience banking that puts you first.</p>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Open Free Account
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">$50B+</span>
              <span className="stat-label">Assets Under Management</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2M+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">35+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9/5</span>
              <span className="stat-label">Customer Rating</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
