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
      background: 'linear-gradient(135deg, #1a1a1a 0%, #722f37 50%, #d4af37 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="container" style={{ maxWidth: '450px' }}>
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
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(212, 175, 55, 0.3)'
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
                  color: '#722f37', 
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
                className="btn btn-maroon"
                style={{ 
                  display: 'inline-block',
                  padding: '0.5rem 1.5rem',
                  fontSize: '0.9rem'
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
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(212, 175, 55, 0.3)'
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
          <p style={{ color: '#f0f0f0', fontSize: '0.8rem', textAlign: 'center' }}>
            Client: test@example.com | Owner: owner@example.com
            <br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;