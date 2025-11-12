import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState({ bookings_made: [], bookings_received: [] });
  const [loading, setLoading] = useState(true);
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const loadDashboardData = useCallback(async () => {
    try {
      console.log('Loading dashboard data for user:', user);
      
      // First, cleanup expired bookings (silently)
      try {
        await bookingsAPI.cleanupExpired();
        console.log('Cleaned up expired bookings');
      } catch (cleanupError) {
        console.log('Cleanup error (non-critical):', cleanupError);
        // Don't fail if cleanup fails, just continue loading
      }
      
      // Then load the bookings
      const bookingsResponse = await bookingsAPI.getMyBookings();
      console.log('Raw bookings response:', bookingsResponse.data);
      setBookings(bookingsResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      console.error('Error details:', error.response?.data);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user, loadDashboardData]);

  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && user) {
        loadDashboardData();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, user, loadDashboardData]);

  const handleBookingAction = async (bookingId, newStatus, actionName) => {
    if (!window.confirm(`Are you sure you want to ${actionName} this booking?`)) {
      return;
    }

    setUpdatingBooking(bookingId);
    setError('');
    setSuccessMessage('');

    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
      setSuccessMessage(`Booking ${actionName}d successfully!`);
      
      // Reload the bookings
      await loadDashboardData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating booking:', error);
      setError(error.response?.data?.error || `Failed to ${actionName} booking`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setUpdatingBooking(null);
    }
  };

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
      <div className="container" style={{ 
        padding: '4rem 2rem',
        textAlign: 'center',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#722f37' }}>Welcome to Apex Rentals</h2>
        <p style={{ marginBottom: '2rem', color: '#666666' }}>Please log in to access your dashboard</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn btn-gold">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
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
      padding: '2rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Geometric background pattern */}
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
      
      {/* Animated floating shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'subtleMove 20s infinite ease-in-out',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(114, 47, 55, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'subtleMove 25s infinite ease-in-out reverse',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Success/Error Messages */}
        {successMessage && (
          <div style={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #6ee7b7',
            textAlign: 'center'
          }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #fca5a5',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div className="card" style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-header" style={{ 
                borderBottom: '2px solid rgba(212, 175, 55, 0.2)',
                paddingBottom: '1rem',
                marginBottom: '1.5rem'
              }}>
                <h2 className="card-title" style={{ color: '#d4af37', fontSize: '1.5rem' }}>
                  Welcome back, {user?.first_name}! 👋
                </h2>
                <p style={{ color: '#666666', marginTop: '0.5rem' }}>
                  {user?.user_type === 'client' ? 'Explore our luxury rentals' : 'Manage your premium assets'}
                </p>
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #722f37 0%, #8b3a43 100%)',
                  borderRadius: '0.75rem',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {user?.user_type === 'client' 
                      ? bookings.bookings_made?.filter(b => b.status !== 'cancelled').length || 0
                      : bookings.bookings_received?.filter(b => b.status !== 'cancelled').length || 0}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {user?.user_type === 'client' ? 'Total Bookings' : 'Booking Requests'}
                  </div>
                </div>
                
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #d4af37 0%, #dbb945 100%)',
                  borderRadius: '0.75rem',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {user?.user_type === 'client'
                      ? bookings.bookings_made?.filter(b => b.status === 'pending').length || 0
                      : bookings.bookings_received?.filter(b => b.status === 'pending').length || 0}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Pending
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ 
              marginTop: '2rem',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-header">
                <h2 className="card-title" style={{ color: '#d4af37' }}>
                  {user?.user_type === 'client' ? 'My Bookings' : 'Booking Requests'}
                </h2>
              </div>

              {user?.user_type === 'client' ? (
                <div>
                  <h3 style={{ color: '#d4af37', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    My Rental History ({bookings.bookings_made?.filter(b => b.status !== 'cancelled').length || 0})
                  </h3>
                  
                  {bookings.bookings_made?.filter(b => b.status !== 'cancelled').length > 0 ? (
                    <div>
                      {bookings.bookings_made.filter(b => b.status !== 'cancelled').map(booking => (
                        <div key={booking.id} style={{ 
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem',
                          backgroundColor: '#fefefe'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#1a1a1a' }}>{booking.asset?.title || 'Asset'}</strong>
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </p>
                          <p style={{ color: '#d4af37', fontWeight: '600', marginTop: '0.5rem' }}>
                            ${booking.total_price?.toLocaleString()}
                          </p>
                          
                          {/* Client can cancel pending or confirmed bookings */}
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button
                              onClick={() => handleBookingAction(booking.id, 'cancelled', 'cancel')}
                              disabled={updatingBooking === booking.id}
                              style={{
                                marginTop: '0.75rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: updatingBooking === booking.id ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                opacity: updatingBooking === booking.id ? 0.6 : 1
                              }}
                            >
                              {updatingBooking === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                          )}
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
                <div>
                  <h3 style={{ color: '#d4af37', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    Incoming Requests ({bookings.bookings_received?.filter(b => b.status === 'pending').length || 0})
                  </h3>
                  
                  {bookings.bookings_received?.filter(b => b.status !== 'cancelled').length > 0 ? (
                    <div>
                      {bookings.bookings_received.filter(b => b.status !== 'cancelled').map(booking => (
                        <div key={booking.id} style={{ 
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem',
                          backgroundColor: '#fefefe'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#1a1a1a' }}>{booking.asset?.title || 'Asset'}</strong>
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                            From: {booking.client?.first_name} {booking.client?.last_name}
                          </p>
                          <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </p>
                          <p style={{ color: '#d4af37', fontWeight: '600', marginTop: '0.5rem' }}>
                            ${booking.total_price?.toLocaleString()}
                          </p>
                          
                          {booking.special_requests && (
                            <div style={{
                              marginTop: '0.75rem',
                              padding: '0.75rem',
                              backgroundColor: '#f9fafb',
                              borderRadius: '0.375rem',
                              fontSize: '0.85rem'
                            }}>
                              <strong style={{ color: '#d4af37' }}>Special Requests:</strong>
                              <p style={{ marginTop: '0.25rem', color: '#666666' }}>
                                {booking.special_requests}
                              </p>
                            </div>
                          )}
                          
                          {/* Owner actions for pending bookings */}
                          {booking.status === 'pending' && (
                            <div style={{ 
                              display: 'flex', 
                              gap: '0.5rem', 
                              marginTop: '1rem' 
                            }}>
                              <button
                                onClick={() => handleBookingAction(booking.id, 'confirmed', 'accept')}
                                disabled={updatingBooking === booking.id}
                                style={{
                                  flex: 1,
                                  padding: '0.75rem 1rem',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  cursor: updatingBooking === booking.id ? 'not-allowed' : 'pointer',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  opacity: updatingBooking === booking.id ? 0.6 : 1,
                                  transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                  if (updatingBooking !== booking.id) {
                                    e.target.style.backgroundColor = '#059669';
                                  }
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = '#10b981';
                                }}
                              >
                                {updatingBooking === booking.id ? 'Accepting...' : '✓ Accept'}
                              </button>
                              
                              <button
                                onClick={() => handleBookingAction(booking.id, 'cancelled', 'reject')}
                                disabled={updatingBooking === booking.id}
                                style={{
                                  flex: 1,
                                  padding: '0.75rem 1rem',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  cursor: updatingBooking === booking.id ? 'not-allowed' : 'pointer',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  opacity: updatingBooking === booking.id ? 0.6 : 1,
                                  transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                  if (updatingBooking !== booking.id) {
                                    e.target.style.backgroundColor = '#dc2626';
                                  }
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = '#ef4444';
                                }}
                              >
                                {updatingBooking === booking.id ? 'Rejecting...' : '✗ Reject'}
                              </button>
                            </div>
                          )}
                          
                          {/* Owner can complete confirmed bookings that have passed */}
                          {booking.status === 'confirmed' && new Date(booking.end_date) < new Date() && (
                            <button
                              onClick={() => handleBookingAction(booking.id, 'completed', 'complete')}
                              disabled={updatingBooking === booking.id}
                              style={{
                                marginTop: '0.75rem',
                                width: '100%',
                                padding: '0.75rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: updatingBooking === booking.id ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                opacity: updatingBooking === booking.id ? 0.6 : 1
                              }}
                            >
                              {updatingBooking === booking.id ? 'Completing...' : 'Mark as Completed'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666666' }}>
                      <p>No booking requests yet</p>
                      <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Clients will see your assets when they browse the marketplace
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Summary then Quick Actions */}
          <div>
            <div className="card" style={{ 
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-header">
                <h2 className="card-title" style={{ color: '#d4af37' }}>Profile Summary</h2>
              </div>
              
              <div>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Account Type:</strong> <span style={{ color: '#d4af37', textTransform: 'capitalize' }}>{user?.user_type}</span>
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Member Since:</strong> {formatDate(user?.created_at)}
                </p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card" style={{ 
              marginTop: '2rem',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-header">
                <h2 className="card-title" style={{ color: '#d4af37' }}>Quick Actions</h2>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {user?.user_type === 'client' ? (
                  <>
                    <Link to="/assets" className="btn btn-gold">
                      Browse Assets
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/assets/create" className="btn btn-gold">
                      Add New Asset
                    </Link>
                    <Link to="/assets/manage" className="btn btn-gold">
                      Manage My Assets
                    </Link>
                    <Link to="/earnings" className="btn btn-gold">
                      View Earnings
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
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

export default DashboardPage;