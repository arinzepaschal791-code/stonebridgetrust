import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Housing.css';

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
  propertyType: string;
  mortgageRate: string;
  imageUrl: string;
}

function Housing() {
  const [housing, setHousing] = useState<HousingOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHousing();
  }, []);

  const fetchHousing = async () => {
    try {
      const res = await fetch('/api/housing');
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

  const filteredHousing = filter === 'all' 
    ? housing 
    : housing.filter(h => h.propertyType === filter);

  if (loading) {
    return (
      <div className="housing-loading">
        <div className="spinner"></div>
        <p>Loading housing offers...</p>
      </div>
    );
  }

  return (
    <div className="housing-page">
      <section className="housing-hero">
        <div className="container">
          <h1>Find Your Dream Home</h1>
          <p>Explore our curated selection of properties with exclusive mortgage rates</p>
        </div>
      </section>

      <section className="housing-content">
        <div className="container">
          <div className="housing-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Properties
            </button>
            <button 
              className={`filter-btn ${filter === 'single-family' ? 'active' : ''}`}
              onClick={() => setFilter('single-family')}
            >
              Single Family
            </button>
            <button 
              className={`filter-btn ${filter === 'condo' ? 'active' : ''}`}
              onClick={() => setFilter('condo')}
            >
              Condos
            </button>
            <button 
              className={`filter-btn ${filter === 'loft' ? 'active' : ''}`}
              onClick={() => setFilter('loft')}
            >
              Lofts
            </button>
            <button 
              className={`filter-btn ${filter === 'estate' ? 'active' : ''}`}
              onClick={() => setFilter('estate')}
            >
              Estates
            </button>
          </div>

          <div className="housing-grid">
            {filteredHousing.map((home) => (
              <Link to={`/housing/${home.slug}`} key={home.id} className="housing-card">
                <div className="housing-image">
                  <img src={home.imageUrl} alt={home.title} />
                  <div className="housing-type">{home.propertyType}</div>
                  <div className="housing-rate">
                    {home.mortgageRate}% APR
                  </div>
                </div>
                <div className="housing-content">
                  <div className="housing-price">${parseFloat(home.price).toLocaleString()}</div>
                  <h3>{home.title}</h3>
                  <p className="housing-location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {home.location}
                  </p>
                  <div className="housing-specs">
                    <span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M3 22v-2h18v2M5 20v-8h14v8M5 12V4h14v8" />
                      </svg>
                      {home.bedrooms} Beds
                    </span>
                    <span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M4 12h16M4 12a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2M4 12V8a4 4 0 014-4h4" />
                      </svg>
                      {home.bathrooms} Baths
                    </span>
                    <span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                      </svg>
                      {home.sqft?.toLocaleString()} sqft
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mortgage-info">
            <h2>Get Pre-Approved Today</h2>
            <p>Find out how much home you can afford with our competitive mortgage rates.</p>
            <div className="mortgage-features">
              <div className="mortgage-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                <div>
                  <h4>Low Down Payments</h4>
                  <p>As low as 3% down for qualified buyers</p>
                </div>
              </div>
              <div className="mortgage-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                <div>
                  <h4>Competitive Rates</h4>
                  <p>Rates starting at 6.25% APR</p>
                </div>
              </div>
              <div className="mortgage-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                <div>
                  <h4>Fast Closing</h4>
                  <p>Close in as little as 21 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Housing;
