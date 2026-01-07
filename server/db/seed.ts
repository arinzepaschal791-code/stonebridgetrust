import { db, pool } from './index';
import { loans, housingOffers } from './schema';

async function seed() {
  console.log('Seeding database...');

  await db.insert(loans).values([
    {
      name: 'Personal Loan',
      slug: 'personal-loan',
      description: 'Flexible personal loans for any purpose. Whether you need to consolidate debt, finance a major purchase, or cover unexpected expenses, our personal loans offer competitive rates and flexible terms to fit your budget.',
      minAmount: '1000.00',
      maxAmount: '50000.00',
      apr: '7.99',
      termMonths: 60,
      features: JSON.stringify(['No collateral required', 'Fixed monthly payments', 'No prepayment penalties', 'Quick approval process', 'Funds available within 24-48 hours']),
      requirements: 'Minimum credit score of 650, proof of income, valid ID, and active bank account.',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800'
    },
    {
      name: 'Auto Loan',
      slug: 'auto-loan',
      description: 'Drive your dream car with our competitive auto loans. New or used, we offer great rates and flexible terms to help you get behind the wheel faster.',
      minAmount: '5000.00',
      maxAmount: '100000.00',
      apr: '5.49',
      termMonths: 72,
      features: JSON.stringify(['Competitive rates for new and used vehicles', 'Terms up to 72 months', 'No application fees', 'Pre-approval available', 'Refinancing options']),
      requirements: 'Minimum credit score of 620, proof of income, valid drivers license, and vehicle information.',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
    },
    {
      name: 'Home Equity Loan',
      slug: 'home-equity-loan',
      description: 'Unlock the value of your home with our home equity loans. Perfect for home improvements, debt consolidation, or major expenses.',
      minAmount: '10000.00',
      maxAmount: '500000.00',
      apr: '6.25',
      termMonths: 180,
      features: JSON.stringify(['Use your home equity as collateral', 'Lower rates than unsecured loans', 'Fixed rates available', 'Tax-deductible interest*', 'Large loan amounts available']),
      requirements: 'Minimum 20% home equity, credit score of 680+, proof of income, and property appraisal.',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
    },
    {
      name: 'Business Loan',
      slug: 'business-loan',
      description: 'Fuel your business growth with our flexible business loans. From startup costs to expansion plans, we provide the capital you need to succeed.',
      minAmount: '10000.00',
      maxAmount: '250000.00',
      apr: '8.99',
      termMonths: 84,
      features: JSON.stringify(['Flexible use of funds', 'No collateral for loans under $50K', 'Quick online application', 'Dedicated business advisors', 'Line of credit options available']),
      requirements: 'Business operating for 2+ years, annual revenue of $100K+, business financial statements.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'
    },
    {
      name: 'Student Loan Refinancing',
      slug: 'student-loan-refinancing',
      description: 'Lower your student loan payments with our refinancing options. Combine multiple loans into one simple payment with better rates.',
      minAmount: '5000.00',
      maxAmount: '200000.00',
      apr: '4.99',
      termMonths: 120,
      features: JSON.stringify(['Lower your interest rate', 'Combine multiple loans', 'No origination fees', 'Flexible repayment terms', 'Cosigner release available']),
      requirements: 'Bachelor degree or higher, credit score of 650+, steady income, and good payment history.',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'
    },
    {
      name: 'Emergency Loan',
      slug: 'emergency-loan',
      description: 'When unexpected expenses arise, our emergency loans provide quick access to funds when you need them most. Fast approval and same-day funding available.',
      minAmount: '500.00',
      maxAmount: '15000.00',
      apr: '12.99',
      termMonths: 24,
      features: JSON.stringify(['Same-day approval possible', 'Funds within 24 hours', 'Minimal documentation', 'No collateral needed', 'Flexible repayment options']),
      requirements: 'Active bank account, proof of income, valid ID, and minimum credit score of 580.',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800'
    }
  ]).onConflictDoNothing();

  await db.insert(housingOffers).values([
    {
      title: 'Modern Downtown Condo',
      slug: 'modern-downtown-condo',
      location: 'New York, NY',
      price: '750000.00',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      description: 'Stunning modern condo in the heart of downtown Manhattan. Features floor-to-ceiling windows, gourmet kitchen with premium appliances, and breathtaking city views. Building amenities include 24/7 concierge, fitness center, and rooftop terrace.',
      features: JSON.stringify(['Floor-to-ceiling windows', 'Hardwood floors', 'In-unit washer/dryer', 'Central AC', 'Building gym', '24/7 doorman']),
      propertyType: 'condo',
      mortgageRate: '6.875',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    },
    {
      title: 'Suburban Family Home',
      slug: 'suburban-family-home',
      location: 'Austin, TX',
      price: '485000.00',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      description: 'Spacious family home in a quiet suburban neighborhood with excellent schools. Features open floor plan, updated kitchen, large backyard, and two-car garage. Perfect for growing families.',
      features: JSON.stringify(['Open floor plan', 'Updated kitchen', 'Large backyard', 'Two-car garage', 'Excellent school district', 'Community pool']),
      propertyType: 'single-family',
      mortgageRate: '6.625',
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
    },
    {
      title: 'Beachfront Paradise',
      slug: 'beachfront-paradise',
      location: 'Miami, FL',
      price: '1250000.00',
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2100,
      description: 'Luxury beachfront condo with direct ocean access and panoramic views. Features designer finishes, private balcony, and resort-style amenities including pool, spa, and beach service.',
      features: JSON.stringify(['Direct ocean views', 'Private balcony', 'Designer finishes', 'Resort pool', 'Beach access', 'Valet parking']),
      propertyType: 'condo',
      mortgageRate: '6.750',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    },
    {
      title: 'Mountain Retreat',
      slug: 'mountain-retreat',
      location: 'Denver, CO',
      price: '625000.00',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1950,
      description: 'Charming mountain home with stunning views of the Rocky Mountains. Features stone fireplace, updated kitchen, wraparound deck, and easy access to hiking trails and ski resorts.',
      features: JSON.stringify(['Mountain views', 'Stone fireplace', 'Wraparound deck', 'Updated kitchen', 'Near ski resorts', 'Hiking trails access']),
      propertyType: 'single-family',
      mortgageRate: '6.500',
      imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800'
    },
    {
      title: 'Urban Loft',
      slug: 'urban-loft',
      location: 'Chicago, IL',
      price: '395000.00',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 950,
      description: 'Industrial-chic loft in trendy neighborhood. Features exposed brick, high ceilings, open layout, and rooftop access. Walking distance to restaurants, shops, and public transit.',
      features: JSON.stringify(['Exposed brick', 'High ceilings', 'Open layout', 'Rooftop access', 'Great location', 'Pet-friendly']),
      propertyType: 'loft',
      mortgageRate: '6.875',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    },
    {
      title: 'Luxury Estate',
      slug: 'luxury-estate',
      location: 'Los Angeles, CA',
      price: '2850000.00',
      bedrooms: 5,
      bathrooms: 5,
      sqft: 5200,
      description: 'Magnificent estate in prestigious neighborhood. Features grand entrance, gourmet chef kitchen, home theater, infinity pool, and meticulously landscaped grounds with city views.',
      features: JSON.stringify(['Infinity pool', 'Home theater', 'Wine cellar', 'Smart home', 'City views', 'Guest house']),
      propertyType: 'estate',
      mortgageRate: '6.250',
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
    }
  ]).onConflictDoNothing();

  console.log('Database seeded successfully!');
  await pool.end();
}

seed().catch(console.error);
