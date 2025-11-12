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
      background: 'linear-gradient(135deg, #faf8f5 0%, #f5f3f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Geometric background pattern - SAME AS REGISTER PAGE */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        background: `
          repeating-linear-gradient(45deg, #722f37 0, #722f37 1px, transparent 0, transparent 50%),
          repeating-linear-gradient(-45deg, #d4af37 0, #d4af37 1px, transparent 0, transparent 50%)
        `,
        backgroundSize: '20px 20px'
      }} />

      <div className="container" style={{ maxWidth: '450px', position: 'relative', zIndex: 2 }}>
        {/* Back to Home Link */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            to="/" 
            style={{ 
              color: '#d4af37', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'color 0.2s'
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
              color: '#d4af37',
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
              border: '1px solid #fca5a5'
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
                style={{ 
                  color: '#d4af37',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;