import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine theme based on current page
  const getLogoColor = () => {
    const path = location.pathname;
    if (path.includes('yacht')) return '#FFFFFF'; // Navy theme - white logo
    if (path.includes('jet')) return '#D4AF37'; // Grey theme - gold logo
    if (path.includes('car')) return '#FFFFFF'; // Red theme - white logo
    return '#D4AF37'; // Default - gold logo
  };

  return (
    <nav style={{ 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #722f37 50%, #d4af37 100%)',
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            gap: '1rem'
          }}
        >
          <img 
            src="/images/apex-logo.png" 
            alt="Apex Rentals" 
            style={{ 
              height: '50px',
              width: 'auto',
              filter: `brightness(0) saturate(100%) invert(${getLogoColor() === '#FFFFFF' ? '100%' : '75%'}) sepia(50%) saturate(500%) hue-rotate(${getLogoColor() === '#D4AF37' ? '10deg' : '0deg'})`
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span style={{ 
            color: '#D4AF37',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            display: 'none' // Hidden by default, shown if image fails
          }}>
            APEX RENTALS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center',
          '@media (max-width: 768px)': {
            display: mobileMenuOpen ? 'flex' : 'none'
          }
        }}>
          <Link 
            to="/assets" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '500',
              transition: 'color 0.3s',
              fontSize: '0.95rem',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
            onMouseLeave={(e) => e.target.style.color = 'white'}
          >
            BROWSE ASSETS
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none', 
                  fontWeight: '500',
                  transition: 'color 0.3s',
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                DASHBOARD
              </Link>
              
              <span style={{ color: '#D4AF37', fontSize: '0.9rem', fontWeight: '500' }}>
                WELCOME, {user?.first_name?.toUpperCase()}!
              </span>
              
              <button 
                onClick={logout}
                className="btn"
                style={{ 
                  padding: '0.5rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#D4AF37',
                  border: '2px solid #D4AF37',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#D4AF37';
                  e.target.style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#D4AF37';
                }}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="btn"
                style={{ 
                  padding: '0.5rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#D4AF37',
                  border: '2px solid #D4AF37',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#D4AF37';
                  e.target.style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#D4AF37';
                }}
              >
                LOGIN
              </Link>
              
              <Link 
                to="/register" 
                className="btn btn-gold"
                style={{ 
                  padding: '0.5rem 1.5rem',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  textDecoration: 'none'
                }}
              >
                SIGN UP
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;