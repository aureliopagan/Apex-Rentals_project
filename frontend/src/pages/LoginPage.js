import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* FUTURISTIC GEOMETRIC PATTERN BACKGROUND */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        backgroundImage: `
          linear-gradient(30deg, rgba(240, 240, 240, 0.8) 12%, transparent 12.5%, transparent 87%, rgba(240, 240, 240, 0.8) 87.5%),
          linear-gradient(150deg, rgba(240, 240, 240, 0.8) 12%, transparent 12.5%, transparent 87%, rgba(240, 240, 240, 0.8) 87.5%),
          linear-gradient(30deg, rgba(230, 230, 230, 0.6) 12%, transparent 12.5%, transparent 87%, rgba(230, 230, 230, 0.6) 87.5%),
          linear-gradient(150deg, rgba(230, 230, 230, 0.6) 12%, transparent 12.5%, transparent 87%, rgba(230, 230, 230, 0.6) 87.5%),
          linear-gradient(60deg, rgba(250, 250, 250, 0.5) 25%, transparent 25.5%, transparent 75%, rgba(250, 250, 250, 0.5) 75%),
          linear-gradient(60deg, rgba(250, 250, 250, 0.5) 25%, transparent 25.5%, transparent 75%, rgba(250, 250, 250, 0.5) 75%),
          repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(220, 220, 220, 0.3) 20px, rgba(220, 220, 220, 0.3) 40px),
          repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(210, 210, 210, 0.2) 20px, rgba(210, 210, 210, 0.2) 40px),
          radial-gradient(circle at 20% 50%, rgba(235, 235, 235, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(245, 245, 245, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, rgba(225, 225, 225, 0.3) 0%, transparent 50%)
        `,
        backgroundSize: '80px 140px, 80px 140px, 80px 140px, 80px 140px, 80px 140px, 80px 140px, 100px 100px, 100px 100px, 600px 600px, 800px 800px, 500px 500px',
        backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px, 0 0, 0 0, 0 0, 0 0, 0 0',
        animation: 'subtleMove 60s ease-in-out infinite'
      }}></div>

      {/* Animated accent lines */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)',
        zIndex: 1
      }}></div>

      <div className="container" style={{ maxWidth: '450px', position: 'relative', zIndex: 2 }}>
        {/* Back to Home Link */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            to="/" 
            style={{ 
              color: '#d4af37', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            ← Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <div className="card" style={{ 
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Header */}
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              Welcome Back
            </h1>
            <p style={{ color: '#666666', fontSize: '1rem' }}>
              Sign in to your luxury rental account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#991b1b', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-gold"
              style={{ width: '100%', marginBottom: '1.5rem' }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center">
            <p style={{ color: '#666666', marginBottom: '1rem' }}>
              Forgot your password?{' '}
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: '#d4af37', 
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Reset it here
              </Link>
            </p>
            <p style={{ color: '#666666' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="btn"
                style={{ 
                  display: 'inline-block',
                  padding: '0.5rem 1.5rem',
                  fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  textDecoration: 'none',
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
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{ 
            color: '#d4af37', 
            fontSize: '0.9rem', 
            textAlign: 'center',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Demo Accounts:
          </p>
          <p style={{ color: '#666666', fontSize: '0.8rem', textAlign: 'center' }}>
            Client: test@example.com | Owner: owner@example.com
            <br />
            Password: password123
          </p>
        </div>
      </div>

      <style>{`
        @keyframes subtleMove {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, 10px) rotate(1deg);
          }
          50% {
            transform: translate(-5px, 15px) rotate(-1deg);
          }
          75% {
            transform: translate(15px, -10px) rotate(0.5deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;