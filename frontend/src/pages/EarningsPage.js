import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EarningsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'owner') {
      navigate('/dashboard');
      return;
    }
    loadEarnings();
  }, [isAuthenticated, user, navigate]);

  const loadEarnings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/api/earnings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEarnings(response.data);
    } catch (error) {
      console.error('Error loading earnings:', error);
      setError('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#10b981',
      completed: '#3b82f6',
      pending: '#fbbf24',
      cancelled: '#ef4444'
    };
    return colors[status] || '#9ca3af';
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p>Loading your earnings...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #faf8f5 0%, #f5f3f0 100%)',
      minHeight: '100vh',
      padding: '2rem 0'
    }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            to="/dashboard" 
            style={{ 
              color: '#d4af37', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Earnings Overview
          </h1>
          <p style={{ color: '#666666', fontSize: '1.1rem' }}>
            Track your income from luxury asset rentals
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#991b1b', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            border: '1px solid #fca5a5'
          }}>
            {error}
          </div>
        )}

        {earnings ? (
          <>
            <div className="grid grid-3" style={{ marginBottom: '3rem', gap: '2rem' }}>
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                color: 'white'
              }}>
                <div>
                  <p style={{ fontSize: '0.9rem', opacity: '0.9', marginBottom: '0.5rem' }}>
                    Total Earnings
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    ${earnings.total_earnings.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                    From {earnings.total_bookings} bookings
                  </p>
                </div>
              </div>

              <div className="card" style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white'
              }}>
                <div>
                  <p style={{ fontSize: '0.9rem', opacity: '0.9', marginBottom: '0.5rem' }}>
                    Confirmed Earnings
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    ${earnings.confirmed_earnings.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                    From {earnings.confirmed_bookings} bookings
                  </p>
                </div>
              </div>

              <div className="card" style={{ 
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: 'white'
              }}>
                <div>
                  <p style={{ fontSize: '0.9rem', opacity: '0.9', marginBottom: '0.5rem' }}>
                    Pending Earnings
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    ${earnings.pending_earnings.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                    From {earnings.pending_bookings} bookings
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '3rem' }}>
              <div className="card-header">
                <h2 className="card-title">Earnings by Asset</h2>
              </div>
              
              {earnings.assets_breakdown && earnings.assets_breakdown.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ 
                        backgroundColor: '#f9fafb', 
                        borderBottom: '2px solid #e5e7eb' 
                      }}>
                        <th style={{ 
                          padding: '1rem', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>
                          Asset
                        </th>
                        <th style={{ 
                          padding: '1rem', 
                          textAlign: 'center', 
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>
                          Bookings
                        </th>
                        <th style={{ 
                          padding: '1rem', 
                          textAlign: 'right', 
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>
                          Total Earnings
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.assets_breakdown.map((asset, index) => (
                        <tr key={index} style={{ 
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: '600', color: '#1a1a1a' }}>
                              {asset.asset_title}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#666666' }}>
                              {asset.asset_type}
                            </div>
                          </td>
                          <td style={{ 
                            padding: '1rem', 
                            textAlign: 'center',
                            color: '#666666'
                          }}>
                            {asset.total_bookings}
                          </td>
                          <td style={{ 
                            padding: '1rem', 
                            textAlign: 'right',
                            fontWeight: '600',
                            color: '#d4af37'
                          }}>
                            ${asset.total_earnings.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666666' }}>
                  <p>No earnings data available yet</p>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Bookings</h2>
              </div>
              
              {earnings.recent_bookings && earnings.recent_bookings.length > 0 ? (
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {earnings.recent_bookings.map((booking) => (
                    <div key={booking.id} style={{ 
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      backgroundColor: '#fefefe'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                            {booking.asset_title}
                          </h4>
                          <p style={{ color: '#666666', fontSize: '0.85rem' }}>
                            Booked by: {booking.client_name}
                          </p>
                        </div>
                        <span style={{ 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: `${getStatusColor(booking.status)}20`,
                          color: getStatusColor(booking.status),
                          textTransform: 'capitalize'
                        }}>
                          {booking.status}
                        </span>
                      </div>
                      <p style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        📅 {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                      </p>
                      <p style={{ color: '#d4af37', fontWeight: '600', fontSize: '1.1rem' }}>
                        💰 ${booking.total_price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666666' }}>
                  <p>No recent bookings</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ color: '#722f37', marginBottom: '1rem' }}>No Earnings Yet</h3>
            <p style={{ color: '#666666', marginBottom: '2rem' }}>
              Start earning by listing your luxury assets
            </p>
            <Link to="/assets/create" className="btn btn-gold">
              Add Your First Asset
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;