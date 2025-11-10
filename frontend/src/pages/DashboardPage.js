import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState({ bookings_made: [], bookings_received: [] });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      console.log('Loading dashboard data for user:', user);
      
      const bookingsResponse = await bookingsAPI.getMyBookings();
      console.log('Raw bookings response:', bookingsResponse.data);
      setBookings(bookingsResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      console.error('Error details:', error.response?.data);
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
      minHeight: '100vh',
      background: '#FFFFFF',
      padding: '2rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
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

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
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
          <div>
            <div className="card" style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-header">
                <h2 className="card-title">
                  {user?.user_type === 'client' ? 'My Bookings' : 'Booking Requests'}
                </h2>
              </div>

              {user?.user_type === 'client' ? (
                <div>
                  <h3 style={{ color: '#722f37', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    My Rental History ({bookings.bookings_made?.length || 0})
                  </h3>
                  
                  {bookings.bookings_made?.length > 0 ? (
                    <div>
                      {bookings.bookings_made.map(booking => (
                        <div key={booking.id} style={{ 
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem',
                          backgroundColor: '#fefefe'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#1a1a1a' }}>{booking.asset?.title || 'Asset'}</strong>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </p>
                          <p style={{ color: '#d4af37', fontWeight: '600' }}>
                            ${booking.total_price}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666666' }}>
                      <p>No bookings yet</p>
                      <Link to="/assets" className="btn btn-gold" style={{ marginTop: '1rem' }}>
                        View All Assets
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 style={{ color: '#722f37', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    Incoming Requests ({bookings.bookings_received?.length || 0})
                  </h3>
                  
                  {bookings.bookings_received?.length > 0 ? (
                    <div>
                      {bookings.bookings_received.map(booking => (
                        <div key={booking.id} style={{ 
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem',
                          backgroundColor: '#fefefe'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#1a1a1a' }}>{booking.asset?.title || 'Asset'}</strong>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                            From: {booking.client?.first_name} {booking.client?.last_name}
                          </p>
                          <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </p>
                          <p style={{ color: '#d4af37', fontWeight: '600' }}>
                            ${booking.total_price}
                          </p>
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

            <div className="card" style={{ 
              marginTop: '2rem',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
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

          <div>
            <div className="card" style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-header">
                <h2 className="card-title">Quick Actions</h2>
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
                    <Link to="/profile" className="btn btn-gold">
                      Edit Profile
                    </Link>
                    <Link to="/reviews" className="btn btn-gold">
                      My Reviews
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/assets/create" className="btn btn-gold">
                      Add New Asset
                    </Link>
                    <Link to="/assets/manage" className="btn btn-gold">
                      Manage Assets
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
