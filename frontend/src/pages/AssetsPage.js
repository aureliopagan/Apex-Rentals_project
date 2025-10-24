import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    min_price: '',
    max_price: ''
  });

  const loadAssets = async () => {
    try {
      console.log('Loading assets...');
      // Use the exact URL format that works (with trailing slash based on your logs)
      const response = await axios.get('http://localhost:5000/api/assets/', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Assets response:', response.data);
      
      if (response.data && response.data.assets) {
        setAssets(response.data.assets);
        setError('');
        console.log(`Successfully loaded ${response.data.assets.length} assets`);
      } else {
        console.error('Unexpected response format:', response.data);
        setAssets([]);
        setError('Received unexpected data format from server');
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      console.error('Error details:', error.response);
      setError(`Failed to load assets: ${error.message}`);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...assets];

    if (filters.type) {
      filtered = filtered.filter(asset => asset.asset_type === filters.type);
    }

    if (filters.location) {
      filtered = filtered.filter(asset => 
        asset.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.min_price) {
      filtered = filtered.filter(asset => asset.price_per_day >= parseFloat(filters.min_price));
    }
    if (filters.max_price) {
      filtered = filtered.filter(asset => asset.price_per_day <= parseFloat(filters.max_price));
    }

    setFilteredAssets(filtered);
  }, [assets, filters]);

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      min_price: '',
      max_price: ''
    });
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
        <p>Loading luxury assets...</p>
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
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Browse Luxury Assets
          </h1>
          <p style={{ color: '#666666', fontSize: '1.1rem' }}>
            Discover premium yachts, exotic cars, and private jets
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
            <button 
              onClick={loadAssets}
              style={{
                marginLeft: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#991b1b',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        <div className="card" style={{ marginBottom: '3rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                ASSET TYPE
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem'
                }}
              >
                <option value="">All Types</option>
                <option value="yacht">Yacht</option>
                <option value="car">Car</option>
                <option value="jet">Jet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                LOCATION
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter city or region"
                value={filters.location}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                MIN PRICE/DAY
              </label>
              <input
                type="number"
                name="min_price"
                placeholder="$0"
                value={filters.min_price}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                MAX PRICE/DAY
              </label>
              <input
                type="number"
                name="max_price"
                placeholder="No limit"
                value={filters.max_price}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem'
                }}
              />
            </div>

            <button 
              onClick={clearFilters}
              className="btn btn-gold"
              style={{ height: 'fit-content' }}
            >
              CLEAR ALL
            </button>
          </div>
        </div>

        <div style={{ 
          marginBottom: '2rem', 
          padding: '1rem', 
          backgroundColor: 'rgba(114, 47, 55, 0.1)',
          borderRadius: '0.5rem',
          color: '#722f37',
          fontWeight: '600'
        }}>
          Showing {filteredAssets.length} of {assets.length} luxury assets
        </div>

        {filteredAssets.length > 0 ? (
          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {filteredAssets.map(asset => (
              <div key={asset.id} className="card" style={{ 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ 
                  height: '200px', 
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.75rem 0.75rem 0 0',
                  overflow: 'hidden',
                  marginBottom: '1rem',
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
                        e.target.parentElement.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af; font-size: 4rem;">${getAssetIcon(asset.asset_type)}</div>`;
                      }}
                    />
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      fontSize: '4rem'
                    }}>
                      {getAssetIcon(asset.asset_type)}
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    backgroundColor: asset.is_available ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    backdropFilter: 'blur(8px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {asset.is_available ? 'Available' : 'Unavailable'}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      color: '#1a1a1a',
                      flex: 1
                    }}>
                      {asset.title}
                    </h3>
                    <span style={{ 
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      color: '#b8941f',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      marginLeft: '0.5rem'
                    }}>
                      {asset.asset_type}
                    </span>
                  </div>

                  <p style={{ color: '#666666', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    📍 {asset.location}
                  </p>

                  {asset.brand && asset.model && (
                    <p style={{ color: '#8b4513', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '500' }}>
                      {asset.brand} {asset.model} {asset.year && `(${asset.year})`}
                    </p>
                  )}

                  {asset.capacity && (
                    <p style={{ color: '#666666', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                      👥 Capacity: {asset.capacity} people
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                      <p style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ${asset.price_per_day.toLocaleString()}
                      </p>
                      <p style={{ color: '#666666', fontSize: '0.85rem' }}>per day</p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div className="stars">⭐⭐⭐⭐⭐</div>
                      <p style={{ color: '#666666', fontSize: '0.85rem' }}>4.8 (12 reviews)</p>
                    </div>
                  </div>

                  <Link 
                    to={`/assets/${asset.id}`} 
                    className={`btn ${asset.is_available ? 'btn-gold' : 'btn-secondary'}`}
                    style={{ width: '100%' }}
                  >
                    {asset.is_available ? 'View Details & Book' : 'View Details'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '1rem',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: '#722f37', marginBottom: '1rem' }}>No assets found</h3>
            <p style={{ color: '#666666', marginBottom: '2rem' }}>
              {assets.length === 0 
                ? 'No assets are currently available. Please check back later.'
                : 'Try adjusting your filters or browse all available assets'
              }
            </p>
            {assets.length > 0 && (
              <button onClick={clearFilters} className="btn btn-gold">
                Clear Filters
              </button>
            )}
          </div>
        )}

        <div style={{ 
          marginTop: '4rem',
          padding: '3rem',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #722f37 50%, #d4af37 100%)',
          borderRadius: '1rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Own a Luxury Asset?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: '0.9' }}>
            Join our exclusive marketplace and start earning from your premium assets
          </p>
          <Link to="/register" className="btn btn-gold" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            List Your Asset
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssetsPage;