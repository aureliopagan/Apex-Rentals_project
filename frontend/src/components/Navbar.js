import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          🚢 APEX RENTALS
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/assets" className="nav-link">Browse Assets</Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li>
                <span className="nav-link">Welcome, {user?.first_name}!</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-primary">Login</Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-gold">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;