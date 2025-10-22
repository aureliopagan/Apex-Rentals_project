import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    user_type: 'client'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
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
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
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
      <div className="container" style={{ maxWidth: '500px' }}>
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

        {/* Registration Card */}
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
              Join Apex Rentals
            </h1>
            <p style={{ color: '#666666', fontSize: '1rem' }}>
              Create your luxury rental account
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label htmlFor="first_name" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="form-input"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="form-input"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                />
              </div>
            </div>

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
                placeholder="john@example.com"
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
                placeholder="Create a secure password"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="user_type" className="form-label">
                Account Type
              </label>
              <select
                id="user_type"
                name="user_type"
                className="form-select"
                value={formData.user_type}
                onChange={handleChange}
                required
              >
                <option value="client">Client - I want to rent luxury assets</option>
                <option value="owner">Owner - I want to list my assets</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-gold"
              style={{ width: '100%', marginBottom: '1.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center">
            <p style={{ color: '#666666' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="btn btn-maroon"
                style={{ 
                  display: 'inline-block',
                  padding: '0.5rem 1.5rem',
                  fontSize: '0.9rem'
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Account Type Info */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <h3 style={{ 
            color: '#d4af37', 
            fontSize: '1rem', 
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            Account Types:
          </h3>
          <div style={{ color: '#f0f0f0', fontSize: '0.85rem', lineHeight: '1.5' }}>
            <p><strong style={{ color: '#d4af37' }}>Client:</strong> Browse and book luxury yachts, cars, and jets</p>
            <p><strong style={{ color: '#d4af37' }}>Owner:</strong> List your luxury assets and receive bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;