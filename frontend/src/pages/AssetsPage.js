import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { assetsAPI } from '../services/api';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    min_price: '',
    max_price: ''
  });

  const loadAssets = async () => {
    try {
      const response = await assetsAPI.getAll();
      setAssets(response.data.assets);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...assets];

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(asset => asset.asset_type === filters.type);
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(asset => 
        asset.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by price range
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
        {/* Header */}
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

        {/* Filters */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label className="form-label">Asset Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="yacht">🛥️ Yachts</option>
                <option value="car">🚗 Cars</option>
                <option value="jet">✈️ Jets</option>
                <option value="other">🏖️ Other</option>
              </select>
            </div>

            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter city or region"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Min Price/Day</label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleFilterChange}
                placeholder="$0"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Max Price/Day</label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                placeholder="No limit"
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={clearFilters} className="btn btn-secondary">
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <p style={{ color: '#722f37', fontWeight: '600' }}>
            Showing {filteredAssets.length} of {assets.length} luxury assets
          </p>
          {filteredAssets.length !== assets.length && (
            <button onClick={clearFilters} style={{ 
              color: '#d4af37', 
              background: 'none', 
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Show all assets
            </button>
          )}
        </div>

        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {filteredAssets.map(asset => (
              <div key={asset.id} className="card" style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                {/* Asset Image */}
                <div style={{ 
                  height: '220px', 
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  borderRadius: '0.75rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  position: 'relative',
                  overflow: 'hidden'
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
                        // Fallback to emoji if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{ 
                    display: asset.images && asset.images.length > 0 ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    fontSize: '3rem'
                  }}>
                    {getAssetIcon(asset.asset_type)}
                  </div>
                  
                  {/* Availability Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: asset.is_available ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {asset.is_available ? 'Available' : 'Booked'}
                  </div>
                </div>
                
                {/* Asset Info */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      lineHeight: '1.2'
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
                      border: '1px solid rgba(212, 175, 55, 0.2)'
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
                    
                    {/* Star Rating Placeholder */}
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
              Try adjusting your filters or browse all available assets
            </p>
            <button onClick={clearFilters} className="btn btn-gold">
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action for Owners */}
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