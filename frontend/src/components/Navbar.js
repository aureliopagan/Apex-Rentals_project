import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={{ 
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
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
              filter: 'brightness(0) saturate(100%) invert(75%) sepia(50%) saturate(500%) hue-rotate(10deg)'
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
            display: 'none'
          }}>
            APEX RENTALS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center'
        }}>
          <Link 
            to="/" 
            style={{ 
              color: location.pathname === '/' ? '#D4AF37' : '#FFFFFF', 
              textDecoration: 'none', 
              fontWeight: '700',
              transition: 'all 0.3s',
              fontSize: '0.95rem',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
            onMouseLeave={(e) => {
              if (location.pathname !== '/') {
                e.target.style.color = '#FFFFFF';
              }
            }}
          >
            HOME
          </Link>

          <Link 
            to="/assets" 
            style={{ 
              color: location.pathname === '/assets' ? '#D4AF37' : '#FFFFFF', 
              textDecoration: 'none', 
              fontWeight: '700',
              transition: 'all 0.3s',
              fontSize: '0.95rem',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
            onMouseLeave={(e) => {
              if (location.pathname !== '/assets') {
                e.target.style.color = '#FFFFFF';
              }
            }}
          >
            BROWSE ASSETS
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                style={{ 
                  color: location.pathname === '/dashboard' ? '#D4AF37' : '#FFFFFF', 
                  textDecoration: 'none', 
                  fontWeight: '700',
                  transition: 'all 0.3s',
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/dashboard') {
                    e.target.style.color = '#FFFFFF';
                  }
                }}
              >
                DASHBOARD
              </Link>
              
              <span style={{ 
                color: '#D4AF37', 
                fontSize: '0.9rem', 
                fontWeight: '700',
                padding: '0.5rem 1rem',
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '0.5rem',
                border: '2px solid #D4AF37'
              }}>
                {user?.first_name?.toUpperCase()}
              </span>
              
              <button 
                onClick={logout}
                className="btn"
                style={{ 
                  padding: '0.5rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#FFFFFF';
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
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#FFFFFF';
                }}
              >
                LOGIN
              </Link>
              
              <Link 
                to="/register" 
                className="btn"
                style={{ 
                  padding: '0.5rem 1.5rem',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                  color: '#000000',
                  border: 'none',
                  fontWeight: '700',
                  borderRadius: '0.5rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #b8941f 0%, #9a7c15 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.3)';
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