import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assetsAPI } from '../services/api';

const HomePage = () => {
  const [featuredAssets, setFeaturedAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load some featured assets for the homepage
    assetsAPI.getAll()
      .then(response => {
        // Show first 3 assets as featured
        setFeaturedAssets(response.data.assets.slice(0, 3));
      })
      .catch(error => {
        console.error('Error loading assets:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #722f37 50%, #d4af37 100%)', 
        color: 'white', 
        padding: '5rem 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle overlay pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.3
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '1.5rem', 
            fontWeight: 'bold',
            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            letterSpacing: '0.05em'
          }}>
            Luxury Asset Rentals
          </h1>
          <p style={{ 
            fontSize: '1.5rem', 
            marginBottom: '3rem', 
            opacity: '0.95',
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.6'
          }}>
            Yachts, Cars & Jets - Experience luxury like never before
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/assets" className="btn btn-gold" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
              Browse Assets
            </Link>
            <Link to="/register" className="btn btn-maroon" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Assets Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '3rem', 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            position: 'relative'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none'
            }}>
              Featured Luxury Assets
            </span>
          </h2>
          
          {featuredAssets.length > 0 ? (
            <div className="grid grid-3">
              {featuredAssets.map(asset => (
                <div key={asset.id} className="card">
                  <div style={{ 
                    height: '200px', 
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
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
                      fontSize: '2rem'
                    }}>
                      {asset.asset_type === 'yacht' && '🛥️'}
                      {asset.asset_type === 'car' && '🚗'}
                      {asset.asset_type === 'jet' && '✈️'}
                      {asset.asset_type === 'other' && '🏖️'}
                    </div>
                  </div>
                  
                  <h3 className="card-title">{asset.title}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    📍 {asset.location}
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d97706' }}>
                    ${asset.price_per_day}/day
                  </p>
                  
                  <Link 
                    to={`/assets/${asset.id}`} 
                    className="btn btn-maroon"
                    style={{ marginTop: '1rem', width: '100%' }}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p>No assets available yet. Be the first to list your luxury asset!</p>
              <Link to="/register" className="btn btn-brown" style={{ marginTop: '1rem' }}>
                List Your Asset
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;