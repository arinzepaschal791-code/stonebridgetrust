import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const logo = '/apple__1767783017287.jpg';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Stonebridge Trust" className="logo-image" />
        </Link>

        <nav className="main-nav">
          <Link to="/loans" className="nav-link">Loans</Link>
          <Link to="/housing" className="nav-link">Housing</Link>
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/transactions" className="nav-link">Transactions</Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">Welcome, {user.firstName}</span>
              <button onClick={handleLogout} className="btn btn-ghost">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Open Account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
