import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assetsAPI, bookingsAPI, reviewsAPI } from '../services/api';

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

  const loadAssetDetails = useCallback(async () => {
    try {
      const [assetResponse, reviewsResponse] = await Promise.all([
        assetsAPI.getById(id),
        reviewsAPI.getAssetReviews(id)
      ]);
      
      setAsset(assetResponse.data.asset);
      setReviews(reviewsResponse.data.reviews);
    } catch (error) {
      console.error('Error loading asset details:', error);
      setError('Asset not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkAvailability = useCallback(async () => {
    try {
      const response = await bookingsAPI.checkAvailability(
        id, 
        bookingData.start_date, 
        bookingData.end_date
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
    if (bookingData.start_date && bookingData.end_date) {
      checkAvailability();
    }
  }, [checkAvailability, bookingData.start_date, bookingData.end_date]);

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

  const handleBooking = async (e) => {
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
      await bookingsAPI.create({
        asset_id: parseInt(id),
        start_date: bookingData.start_date + 'T10:00:00',
        end_date: bookingData.end_date + 'T18:00:00',
        special_requests: bookingData.special_requests
      });

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Booking failed. Please try again.');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <h1>{error}</h1>
        <Link to="/assets" className="btn btn-gold" style={{ marginTop: '2rem' }}>
          Back to Assets
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
        {/* Back Navigation */}
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

        <div className="grid grid-2" style={{ gap: '3rem' }}>
          {/* Left Column - Asset Details */}
          <div>
            {/* Asset Images */}
            <div style={{ 
              height: '400px', 
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '1rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '6rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {getAssetIcon(asset?.asset_type)}
              
              {/* Availability Badge */}
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                backgroundColor: asset?.is_available ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {asset?.is_available ? 'Available' : 'Unavailable'}
              </div>
            </div>

            {/* Asset Information */}
            <div className="card">
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h1 style={{ 
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                    lineHeight: '1.2'
                  }}>
                    {asset?.title}
                  </h1>
                  <span style={{ 
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    color: '#b8941f',
                    borderRadius: '2rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    border: '2px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    {asset?.asset_type}
                  </span>
                </div>

                <p style={{ color: '#666666', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  📍 {asset?.location}
                </p>

                {asset?.brand && asset?.model && (
                  <p style={{ color: '#8b4513', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    {asset.brand} {asset.model} {asset.year && `(${asset.year})`}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                  {asset?.capacity && (
                    <div>
                      <p style={{ color: '#666666', fontSize: '0.9rem' }}>Capacity</p>
                      <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>👥 {asset.capacity} people</p>
                    </div>
                  )}
                  <div>
                    <p style={{ color: '#666666', fontSize: '0.9rem' }}>Price</p>
                    <p style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      ${asset?.price_per_day?.toLocaleString()}/day
                    </p>
                  </div>
                </div>

                {/* Description */}
                {asset?.description && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: '#722f37', marginBottom: '1rem', fontSize: '1.2rem' }}>
                      Description
                    </h3>
                    <p style={{ lineHeight: '1.6', color: '#666666' }}>
                      {asset.description}
                    </p>
                  </div>
                )}

                {/* Reviews Section */}
                <div>
                  <h3 style={{ color: '#722f37', marginBottom: '1rem', fontSize: '1.2rem' }}>
                    Reviews ({reviews.length})
                  </h3>
                  
                  {reviews.length > 0 ? (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {reviews.slice(0, 3).map(review => (
                        <div key={review.id} style={{ 
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem',
                          backgroundColor: '#fefefe'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '600' }}>
                              {review.reviewer?.first_name} {review.reviewer?.last_name}
                            </span>
                            <div className="stars">
                              {'⭐'.repeat(review.rating)}
                            </div>
                          </div>
                          <p style={{ color: '#666666', fontSize: '0.9rem' }}>
                            {review.comment}
                          </p>
                          <p style={{ color: '#999999', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      ))}
                      {reviews.length > 3 && (
                        <p style={{ textAlign: 'center', color: '#d4af37', fontSize: '0.9rem' }}>
                          +{reviews.length - 3} more reviews
                        </p>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: '#666666', fontStyle: 'italic' }}>
                      No reviews yet. Be the first to book and review!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#722f37',
                marginBottom: '1.5rem'
              }}>
                Book This Asset
              </h2>

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

              {!isAuthenticated ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ marginBottom: '1rem', color: '#666666' }}>
                    Please log in to book this asset
                  </p>
                  <Link to="/login" className="btn btn-gold">
                    Login to Book
                  </Link>
                </div>
              ) : user?.user_type !== 'client' ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#666666' }}>
                    Only clients can make bookings
                  </p>
                </div>
              ) : !asset?.is_available ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#991b1b', fontWeight: '600' }}>
                    This asset is currently unavailable
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBooking}>
                  <div className="form-group">
                    <label htmlFor="start_date" className="form-label">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      className="form-input"
                      value={bookingData.start_date}
                      onChange={handleBookingChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="end_date" className="form-label">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      name="end_date"
                      className="form-input"
                      value={bookingData.end_date}
                      onChange={handleBookingChange}
                      min={bookingData.start_date || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {/* Availability Check */}
                  {availability && (
                    <div style={{ 
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      backgroundColor: availability.is_available ? '#d1fae5' : '#fee2e2',
                      color: availability.is_available ? '#065f46' : '#991b1b',
                      border: `1px solid ${availability.is_available ? '#a7f3d0' : '#fecaca'}`
                    }}>
                      {availability.is_available ? (
                        <p>✅ Available for selected dates</p>
                      ) : (
                        <p>❌ Not available for selected dates</p>
                      )}
                    </div>
                  )}

                  {/* Price Calculation */}
                  {calculateTotalPrice() > 0 && (
                    <div style={{ 
                      padding: '1rem',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Daily Rate:</span>
                        <span>${asset?.price_per_day?.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Duration:</span>
                        <span>{Math.ceil((new Date(bookingData.end_date) - new Date(bookingData.start_date)) / (1000 * 60 * 60 * 24))} days</span>
                      </div>
                      <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid rgba(212, 175, 55, 0.3)' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        <span>Total:</span>
                        <span style={{ color: '#d4af37' }}>${calculateTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="special_requests" className="form-label">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="special_requests"
                      name="special_requests"
                      className="form-textarea"
                      value={bookingData.special_requests}
                      onChange={handleBookingChange}
                      placeholder="Any special requests or requirements..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-gold"
                    style={{ width: '100%' }}
                    disabled={bookingLoading || !availability?.is_available}
                  >
                    {bookingLoading ? 'Processing...' : `Book Now - $${calculateTotalPrice().toLocaleString()}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailPage;