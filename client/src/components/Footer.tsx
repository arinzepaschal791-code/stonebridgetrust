import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">Stonebridge Trust</h3>
            <p className="footer-description">
              Your trusted banking partner since 1985. We're committed to providing secure, 
              reliable financial services that help you achieve your goals.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Products</h4>
            <ul className="footer-links">
              <li><Link to="/loans">Personal Loans</Link></li>
              <li><Link to="/loans">Auto Loans</Link></li>
              <li><Link to="/housing">Mortgages</Link></li>
              <li><Link to="/loans">Business Loans</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">Online Banking</Link></li>
              <li><Link to="/transfer">Money Transfers</Link></li>
              <li><Link to="/transactions">Bill Pay</Link></li>
              <li><Link to="/housing">Property Search</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li>1-800-STONE-TRUST</li>
              <li>support@stonebridgetrust.com</li>
              <li>123 Financial Plaza<br />New York, NY 10001</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Stonebridge Trust. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">FDIC Insured</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
