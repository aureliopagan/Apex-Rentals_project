import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const AssetsPage = () => {
  const location = useLocation();
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

  // Read category from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setFilters(prev => ({
        ...prev,
        type: category
      }));
    }
  }, [location.search]);

  const loadAssets = async () => {
    try {
      console.log('Loading assets...');
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

  const getAssetImage = (type) => {
    switch (type) {
      case 'yacht': 
        return 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&h=300&fit=crop';
      case 'car': 
        return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop';
      case 'jet': 
        return 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop';
      default: 
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
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
                placeholder="Any"
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
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#1a1a1a',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              CLEAR FILTERS
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#666666', fontSize: '1rem' }}>
            Showing <strong>{filteredAssets.length}</strong> of <strong>{assets.length}</strong> assets
            {filters.type && ` (${filters.type}s only)`}
          </p>
        </div>

        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {filteredAssets.map(asset => (
              <div key={asset.id} className="card" style={{ 
                padding: '0',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                {/* Asset Image */}
                <div style={{ 
                  height: '220px', 
                  backgroundColor: '#f3f4f6',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {asset.images && asset.images.length > 0 ? (
                    <img 
                      src={asset.images[0].image_url} 
                      alt={asset.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = getAssetImage(asset.asset_type);
                      }}
                    />
                  ) : (
                    <img 
                      src={getAssetImage(asset.asset_type)} 
                      alt={asset.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  
                  {/* Asset Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {getAssetIcon(asset.asset_type)} {asset.asset_type}
                  </div>
                </div>

                {/* Asset Details */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    color: '#1a1a1a'
                  }}>
                    {asset.title}
                  </h3>
                  
                  {asset.brand && asset.model && (
                    <p style={{ 
                      color: '#666666', 
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}>
                      {asset.brand} {asset.model} {asset.year && `(${asset.year})`}
                    </p>
                  )}

                  <p style={{ 
                    color: '#666666', 
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}>
                    📍 {asset.location}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <span style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: '#d4af37'
                      }}>
                        ${asset.price_per_day}
                      </span>
                      <span style={{ 
                        fontSize: '0.9rem', 
                        color: '#666666' 
                      }}>
                        /day
                      </span>
                    </div>
                    
                    {!asset.is_available && (
                      <span style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        UNAVAILABLE
                      </span>
                    )}
                  </div>

                  <Link 
                    to={`/assets/${asset.id}`}
                    className="btn btn-gold"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      width: '100%',
                      textDecoration: 'none'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <p style={{ fontSize: '1.5rem', color: '#666666', marginBottom: '1rem' }}>
              {filters.type ? `No ${filters.type}s found` : 'No assets found'}
            </p>
            <p style={{ color: '#999999', marginBottom: '2rem' }}>
              {filters.type || filters.location || filters.min_price || filters.max_price 
                ? 'Try adjusting your filters' 
                : 'Be the first to list a luxury asset!'}
            </p>
            {(filters.type || filters.location || filters.min_price || filters.max_price) && (
              <button 
                onClick={clearFilters}
                className="btn btn-gold"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsPage;