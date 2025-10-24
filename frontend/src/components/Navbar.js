import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <nav style={{ 
      background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
      padding: '1rem 0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
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
              filter: 'brightness(0) saturate(100%)'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span style={{ 
            color: '#000000',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textShadow: '1px 1px 2px rgba(255,255,255,0.3)',
            display: 'none' // Hidden by default, shown if image fails
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
              color: location.pathname === '/' ? '#FFFFFF' : '#000000', 
              textDecoration: 'none', 
              fontWeight: '700',
              transition: 'all 0.3s',
              fontSize: '0.95rem',
              letterSpacing: '0.05em',
              textShadow: location.pathname === '/' ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              background: location.pathname === '/' ? 'rgba(0,0,0,0.2)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/') {
                e.target.style.color = '#FFFFFF';
                e.target.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
                e.target.style.background = 'rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/') {
                e.target.style.color = '#000000';
                e.target.style.textShadow = 'none';
                e.target.style.background = 'transparent';
              }
            }}
          >
            HOME
          </Link>

          <Link 
            to="/assets" 
            style={{ 
              color: location.pathname === '/assets' ? '#FFFFFF' : '#000000', 
              textDecoration: 'none', 
              fontWeight: '700',
              transition: 'all 0.3s',
              fontSize: '0.95rem',
              letterSpacing: '0.05em',
              textShadow: location.pathname === '/assets' ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              background: location.pathname === '/assets' ? 'rgba(0,0,0,0.2)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/assets') {
                e.target.style.color = '#FFFFFF';
                e.target.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
                e.target.style.background = 'rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/assets') {
                e.target.style.color = '#000000';
                e.target.style.textShadow = 'none';
                e.target.style.background = 'transparent';
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
                  color: location.pathname === '/dashboard' ? '#FFFFFF' : '#000000', 
                  textDecoration: 'none', 
                  fontWeight: '700',
                  transition: 'all 0.3s',
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                  textShadow: location.pathname === '/dashboard' ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  background: location.pathname === '/dashboard' ? 'rgba(0,0,0,0.2)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/dashboard') {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
                    e.target.style.background = 'rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/dashboard') {
                    e.target.style.color = '#000000';
                    e.target.style.textShadow = 'none';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                DASHBOARD
              </Link>
              
              <span style={{ 
                color: '#000000', 
                fontSize: '0.9rem', 
                fontWeight: '700',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '0.5rem',
                border: '2px solid #000000'
              }}>
                {user?.first_name?.toUpperCase()}
              </span>
              
              <button 
                onClick={logout}
                className="btn"
                style={{ 
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#000000',
                  color: '#D4AF37',
                  border: '2px solid #000000',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.color = '#000000';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#000000';
                  e.target.style.color = '#D4AF37';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
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
                  color: '#000000',
                  border: '2px solid #000000',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#000000';
                  e.target.style.color = '#D4AF37';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#000000';
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
                  background: '#000000',
                  color: '#D4AF37',
                  border: '2px solid #000000',
                  fontWeight: '700',
                  borderRadius: '0.5rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.color = '#000000';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#000000';
                  e.target.style.color = '#D4AF37';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
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