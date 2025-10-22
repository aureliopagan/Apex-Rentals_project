import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, assetsAPI } from '../services/api';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState({ bookings_made: [], bookings_received: [] });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      // Load bookings for all users
      const bookingsResponse = await bookingsAPI.getMyBookings();
      setBookings(bookingsResponse.data);

      // Load assets if user is an owner
      if (user?.user_type === 'owner') {
        const assetsResponse = await assetsAPI.getMyAssets();
        setAssets(assetsResponse.data.assets);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.user_type]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, loadDashboardData]);

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge status-${status}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Please log in to view your dashboard</h1>
        <Link to="/login" className="btn btn-gold">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p>Loading your dashboard...</p>
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
        {/* Header */}
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
            Welcome back, {user?.first_name}!
          </h1>
          <p style={{ color: '#666666', fontSize: '1.1rem' }}>
            {user?.user_type === 'client' ? 'Manage your luxury rental bookings' : 'Manage your assets and bookings'}
          </p>
        </div>

        <div className="grid grid-2">
          {/* Left Column - Bookings */}
          <div>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  {user?.user_type === 'client' ? 'My Bookings' : 'Booking Requests'}
                </h2>
              </div>

              {user?.user_type === 'client' ? (
                // Client View - Bookings Made
                <div>
                  <h3 style={{ color: '#722f37', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    My Rental History ({bookings.bookings_made?.length || 0})
                  </h3>
                  
                  {bookings.bookings_made?.length > 0 ? (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {bookings.bookings_made.map(booking => (
                        <div key={booking.id} style={{ 
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem',
                          backgroundColor: '#fefefe'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h4 style={{ fontWeight: '600', color: '#1a1a1a' }}>
                              {booking.asset?.title}
                            </h4>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            📍 {booking.asset?.location}
                          </p>
                          <p style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            📅 {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </p>
                          <p style={{ color: '#d4af37', fontWeight: '600' }}>
                            💰 ${booking.total_price}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666666' }}>
                      <p>No bookings yet</p>
                      <Link to="/assets" className="btn btn-gold" style={{ marginTop: '1rem' }}>
                        Browse Assets
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                // Owner View - Bookings Received
                <div>
                  <h3 style={{ color: '#722f37', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    Incoming Requests ({bookings.bookings_received?.length || 0})
                  </h3>
                  
                  {bookings.bookings_received?.length > 0 ? (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {bookings.bookings_received.map(booking => (
                        <div key={booking.id} style={{ 
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem',
                          backgroundColor: '#fefefe'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h4 style={{ fontWeight: '600', color: '#1a1a1a' }}>
                              {booking.asset?.title}
                            </h4>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            👤 {booking.client?.first_name} {booking.client?.last_name}
                          </p>
                          <p style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            📅 {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </p>
                          <p style={{ color: '#d4af37', fontWeight: '600' }}>
                            💰 ${booking.total_price}
                          </p>
                          {booking.special_requests && (
                            <p style={{ color: '#8b4513', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
                              Note: {booking.special_requests}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666666' }}>
                      <p>No booking requests yet</p>
                      <Link to="/assets" className="btn btn-gold" style={{ marginTop: '1rem' }}>
                        View All Assets
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Assets (for owners) */}
          <div>
            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h2 className="card-title">Quick Actions</h2>
              </div>
              
              <div className="grid" style={{ gap: '1rem' }}>
                {user?.user_type === 'client' ? (
                  <>
                    <Link to="/assets" className="btn btn-gold">
                      Browse Assets
                    </Link>
                    <Link to="/profile" className="btn btn-maroon">
                      Edit Profile
                    </Link>
                    <Link to="/reviews" className="btn btn-brown">
                      My Reviews
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/assets/create" className="btn btn-gold">
                      Add New Asset
                    </Link>
                    <Link to="/assets/manage" className="btn btn-maroon">
                      Manage Assets
                    </Link>
                    <Link to="/earnings" className="btn btn-brown">
                      View Earnings
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Assets (Owner only) */}
            {user?.user_type === 'owner' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">My Assets ({assets.length})</h2>
                </div>
                
                {assets.length > 0 ? (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {assets.map(asset => (
                      <div key={asset.id} style={{ 
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        backgroundColor: '#fefefe'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                              {asset.asset_type === 'yacht' && '🛥️'} 
                              {asset.asset_type === 'car' && '🚗'} 
                              {asset.asset_type === 'jet' && '✈️'} 
                              {asset.title}
                            </h4>
                            <p style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                              📍 {asset.location}
                            </p>
                            <p style={{ color: '#d4af37', fontWeight: '600' }}>
                              ${asset.price_per_day}/day
                            </p>
                          </div>
                          <span style={{ 
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: asset.is_available ? '#d1fae5' : '#fee2e2',
                            color: asset.is_available ? '#065f46' : '#991b1b'
                          }}>
                            {asset.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666666' }}>
                    <p>No assets listed yet</p>
                    <Link to="/assets/create" className="btn btn-gold" style={{ marginTop: '1rem' }}>
                      List Your First Asset
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Profile Summary */}
            <div className="card" style={{ marginTop: '2rem' }}>
              <div className="card-header">
                <h2 className="card-title">Profile Summary</h2>
              </div>
              
              <div>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Account Type:</strong> <span style={{ color: '#d4af37', textTransform: 'capitalize' }}>{user?.user_type}</span>
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Member Since:</strong> {formatDate(user?.created_at)}
                </p>
                <p>
                  <strong>Status:</strong> {user?.is_verified ? 
                    <span style={{ color: '#065f46' }}>Verified</span> : 
                    <span style={{ color: '#991b1b' }}>Unverified</span>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;