// BOOKING DATE FIX - Key changes in handleBookingSubmit and checkAvailability functions
// The issue: HTML date inputs return 'YYYY-MM-DD' format, but backend expects ISO datetime 'YYYY-MM-DDTHH:MM:SS'
// The fix: Convert dates to ISO datetime format before sending to API

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AssetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [asset, setAsset] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    special_requests: ''
  });
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadAssetDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [assetResponse, reviewsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/assets/${id}`, { headers }),
        axios.get(`http://localhost:5000/api/reviews/asset/${id}`, { headers })
      ]);
      
      console.log('Asset loaded:', assetResponse.data);
      setAsset(assetResponse.data.asset);
      setReviews(reviewsResponse.data.reviews || []);
    } catch (error) {
      console.error('Error loading asset details:', error);
      setError('Asset not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // FIX #1: Add time component to dates for availability check
  const checkAvailability = useCallback(async () => {
    if (!bookingData.start_date || !bookingData.end_date) return;

    try {
      const token = localStorage.getItem('authToken');
      // Convert YYYY-MM-DD to YYYY-MM-DDTHH:MM:SS format
      const startDateTime = `${bookingData.start_date}T00:00:00`;
      const endDateTime = `${bookingData.end_date}T23:59:59`;
      
      const response = await axios.get(
        `http://localhost:5000/api/bookings/asset/${id}/availability`,
        {
          params: {
            start_date: startDateTime,
            end_date: endDateTime
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      setAvailability(response.data);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  }, [id, bookingData.start_date, bookingData.end_date]);

  useEffect(() => {
    loadAssetDetails();
  }, [loadAssetDetails]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotalPrice = () => {
    if (!asset || !bookingData.start_date || !bookingData.end_date) return 0;
    
    const startDate = new Date(bookingData.start_date);
    const endDate = new Date(bookingData.end_date);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff > 0 ? daysDiff * asset.price_per_day : 0;
  };

  // FIX #2: Add time component to dates when submitting booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.user_type !== 'client') {
      setError('Only clients can make bookings');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const totalPrice = calculateTotalPrice();

      // Convert YYYY-MM-DD to YYYY-MM-DDTHH:MM:SS format
      const startDateTime = `${bookingData.start_date}T00:00:00`;
      const endDateTime = `${bookingData.end_date}T23:59:59`;

      await axios.post(
        'http://localhost:5000/api/bookings/',
        {
          asset_id: parseInt(id),
          start_date: startDateTime,
          end_date: endDateTime,
          total_price: totalPrice,
          special_requests: bookingData.special_requests
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccessMessage('Booking request submitted successfully!');
      setBookingData({
        start_date: '',
        end_date: '',
        special_requests: ''
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const getAssetIcon = (type) => {
    switch (type) {
      case 'yacht': return '🛥️';
      case 'car': return '🚗';
      case 'jet': return '✈️';
      default: return '🏖️';
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p>Loading asset details...</p>
      </div>
    );
  }

  if (error && !asset) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#722f37', marginBottom: '1rem' }}>{error}</h2>
        <Link to="/assets" className="btn btn-gold">
          Back to Browse Assets
        </Link>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p>Asset not found</p>
        <Link to="/assets" className="btn btn-gold">
          Back to Browse Assets
        </Link>
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
            to="/assets" 
            style={{ 
              color: '#d4af37', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            ← Back to Assets
          </Link>
        </div>

        <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
          {/* Left Column - Asset Details */}
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              {/* Main Image */}
              <div style={{ 
                height: '400px', 
                backgroundColor: '#f3f4f6',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                marginBottom: '1.5rem',
                position: 'relative'
              }}>
                {asset.images && asset.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${asset.images[0].image_url}`}
                    alt={asset.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 3rem;">${getAssetIcon(asset.asset_type)}</div>`;
                    }}
                  />
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    fontSize: '3rem'
                  }}>
                    {getAssetIcon(asset.asset_type)}
                  </div>
                )}

                {/* Availability Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  backgroundColor: asset.is_available ? '#10b981' : '#ef4444',
                  color: 'white'
                }}>
                  {asset.is_available ? 'AVAILABLE' : 'UNAVAILABLE'}
                </div>

                {/* Asset Type Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  backgroundColor: '#d4af37',
                  color: '#000000',
                  textTransform: 'uppercase'
                }}>
                  {asset.asset_type}
                </div>
              </div>

              {/* Thumbnail Images */}
              {asset.images && asset.images.length > 1 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  {asset.images.slice(1).map((image, index) => (
                    <div key={index} style={{ 
                      height: '100px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.5rem',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={`http://localhost:5000${image.image_url}`}
                        alt={`${asset.title} ${index + 2}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Asset Info */}
              <h1 style={{ 
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '1rem'
              }}>
                {asset.title}
              </h1>

              <p style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '1.5rem'
              }}>
                ${asset.price_per_day}/day
              </p>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{ color: '#666666' }}>📍 Location:</div>
                <div style={{ fontWeight: '600' }}>{asset.location}</div>

                {asset.brand && (
                  <>
                    <div style={{ color: '#666666' }}>🏷️ Brand:</div>
                    <div style={{ fontWeight: '600' }}>{asset.brand}</div>
                  </>
                )}

                {asset.model && (
                  <>
                    <div style={{ color: '#666666' }}>🔧 Model:</div>
                    <div style={{ fontWeight: '600' }}>{asset.model}</div>
                  </>
                )}

                {asset.year && (
                  <>
                    <div style={{ color: '#666666' }}>📅 Year:</div>
                    <div style={{ fontWeight: '600' }}>{asset.year}</div>
                  </>
                )}

                {asset.capacity && (
                  <>
                    <div style={{ color: '#666666' }}>👥 Capacity:</div>
                    <div style={{ fontWeight: '600' }}>{asset.capacity} people</div>
                  </>
                )}
              </div>

              <div style={{ 
                padding: '1.5rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.75rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  Description
                </h3>
                <p style={{ color: '#666666', lineHeight: '1.6' }}>
                  {asset.description || 'No description available'}
                </p>
              </div>

              {/* Owner Info */}
              <div style={{ 
                padding: '1.5rem',
                backgroundColor: '#faf8f5',
                borderRadius: '0.75rem',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}>
                <h3 style={{ 
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#722f37'
                }}>
                  Owner
                </h3>
                <p style={{ color: '#666666' }}>
                  {asset.owner?.first_name} {asset.owner?.last_name}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div>
            <div className="card">
              <h2 style={{ 
                fontSize: '1.75rem',
                color: '#722f37',
                marginBottom: '1rem'
              }}>
                Book This Asset
              </h2>

              {!isAuthenticated ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#666666', marginBottom: '1.5rem' }}>
                    Please log in to make a booking
                  </p>
                  <Link to="/login" className="btn btn-gold" style={{ width: '100%' }}>
                    Login to Book
                  </Link>
                </div>
              ) : user?.user_type !== 'client' ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#666666' }}>
                    Only clients can make bookings
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  {successMessage && (
                    <div style={{ 
                      backgroundColor: '#d1fae5', 
                      color: '#065f46', 
                      padding: '1rem', 
                      borderRadius: '0.5rem',
                      marginBottom: '1.5rem',
                      border: '1px solid #6ee7b7'
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
                      border: '1px solid #fca5a5'
                    }}>
                      {error}
                    </div>
                  )}

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={bookingData.start_date}
                      onChange={handleBookingChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={bookingData.end_date}
                      onChange={handleBookingChange}
                      required
                      min={bookingData.start_date || new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {availability && (
                    <div style={{ 
                      padding: '1rem',
                      backgroundColor: availability.is_available ? '#d1fae5' : '#fee2e2',
                      color: availability.is_available ? '#065f46' : '#991b1b',
                      borderRadius: '0.5rem',
                      marginBottom: '1.5rem',
                      border: `1px solid ${availability.is_available ? '#6ee7b7' : '#fca5a5'}`
                    }}>
                      {availability.is_available ? '✓ Available for selected dates' : '✗ Not available for selected dates'}
                    </div>
                  )}

                  {bookingData.start_date && bookingData.end_date && calculateTotalPrice() > 0 && (
                    <div style={{ 
                      padding: '1.5rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.75rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#666666' }}>Duration:</span>
                        <span style={{ fontWeight: '600' }}>
                          {Math.ceil((new Date(bookingData.end_date) - new Date(bookingData.start_date)) / (1000 * 3600 * 24))} days
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '2px solid #e5e7eb' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Total:</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d4af37' }}>
                          ${calculateTotalPrice().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="special_requests"
                      value={bookingData.special_requests}
                      onChange={handleBookingChange}
                      rows="4"
                      placeholder="Any special requirements or requests..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading || !availability?.is_available}
                    className="btn btn-gold"
                    style={{ 
                      width: '100%',
                      padding: '1rem',
                      fontSize: '1.1rem',
                      opacity: (bookingLoading || !availability?.is_available) ? 0.5 : 1,
                      cursor: (bookingLoading || !availability?.is_available) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {bookingLoading ? 'Processing...' : 'REQUEST BOOKING'}
                  </button>
                </form>
              )}
            </div>

            {/* Reviews Section */}
            {reviews && reviews.length > 0 && (
              <div className="card" style={{ marginTop: '2rem' }}>
                <h2 style={{ 
                  fontSize: '1.5rem',
                  color: '#722f37',
                  marginBottom: '1.5rem'
                }}>
                  Reviews ({reviews.length})
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {reviews.map((review) => (
                    <div 
                      key={review.id}
                      style={{ 
                        padding: '1.5rem',
                        backgroundColor: '#faf8f5',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <strong style={{ color: '#1a1a1a' }}>
                          {review.reviewer?.first_name} {review.reviewer?.last_name}
                        </strong>
                        <div style={{ color: '#d4af37', fontWeight: '600' }}>
                          {'⭐'.repeat(review.rating)}
                        </div>
                      </div>
                      <p style={{ color: '#666666', lineHeight: '1.6' }}>
                        {review.comment}
                      </p>
                      <p style={{ color: '#999999', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailPage;