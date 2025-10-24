import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assetsAPI } from '../services/api';

const ManageAssetsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'owner') {
      navigate('/dashboard');
      return;
    }
    loadAssets();
  }, [isAuthenticated, user, navigate]);

  const loadAssets = async () => {
    try {
      const response = await assetsAPI.getMyAssets();
      setAssets(response.data.assets);
    } catch (error) {
      console.error('Error loading assets:', error);
      setError('Failed to load your assets');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (assetId, currentStatus) => {
    try {
      await assetsAPI.update(assetId, { is_available: !currentStatus });
      setSuccessMessage('Asset availability updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadAssets();
    } catch (error) {
      console.error('Error updating asset:', error);
      setError('Failed to update asset availability');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteAsset = async (assetId, assetTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${assetTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await assetsAPI.delete(assetId);
      setSuccessMessage('Asset deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      setError('Failed to delete asset');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p>Loading your assets...</p>
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
            Manage Your Assets
          </h1>
          <p style={{ color: '#666666', fontSize: '1.1rem' }}>
            Update, toggle availability, or remove your luxury assets
          </p>
        </div>

        {successMessage && (
          <div style={{ 
            backgroundColor: '#d1fae5', 
            color: '#065f46', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginBottom: '2rem',
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
            marginBottom: '2rem',
            border: '1px solid #fca5a5'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <Link to="/assets/create" className="btn btn-gold">
            + Add New Asset
          </Link>
        </div>

        {assets.length > 0 ? (
          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {assets.map(asset => (
              <div key={asset.id} className="card" style={{ position: 'relative' }}>
                <div style={{ 
                  height: '200px', 
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.75rem 0.75rem 0 0',
                  overflow: 'hidden',
                  marginBottom: '1rem'
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
                        e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af; font-size: 3rem;">🏖️</div>';
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
                      {asset.asset_type === 'yacht' && '🛥️'}
                      {asset.asset_type === 'car' && '🚗'}
                      {asset.asset_type === 'jet' && '✈️'}
                      {asset.asset_type === 'other' && '🏖️'}
                    </div>
                  )}
                </div>

                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  backgroundColor: asset.is_available ? '#d1fae5' : '#fee2e2',
                  color: asset.is_available ? '#065f46' : '#991b1b',
                  border: `2px solid ${asset.is_available ? '#6ee7b7' : '#fca5a5'}`
                }}>
                  {asset.is_available ? 'Available' : 'Unavailable'}
                </div>

                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: '#1a1a1a',
                    marginBottom: '0.5rem'
                  }}>
                    {asset.title}
                  </h3>

                  <p style={{ color: '#666666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    📍 {asset.location}
                  </p>

                  {asset.brand && asset.model && (
                    <p style={{ color: '#8b4513', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                      {asset.brand} {asset.model} {asset.year && `(${asset.year})`}
                    </p>
                  )}

                  <p style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    color: '#d4af37',
                    marginBottom: '1rem'
                  }}>
                    ${asset.price_per_day}/day
                  </p>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '0.5rem',
                    marginTop: '1rem'
                  }}>
                    <button
                      onClick={() => handleToggleAvailability(asset.id, asset.is_available)}
                      className="btn"
                      style={{ 
                        fontSize: '0.85rem',
                        padding: '0.5rem',
                        backgroundColor: asset.is_available ? '#fbbf24' : '#10b981',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      {asset.is_available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>

                    <Link
                      to={`/assets/${asset.id}`}
                      className="btn btn-secondary"
                      style={{ 
                        fontSize: '0.85rem',
                        padding: '0.5rem',
                        textAlign: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      View Details
                    </Link>
                  </div>

                  <button
                    onClick={() => handleDeleteAsset(asset.id, asset.title)}
                    className="btn"
                    style={{ 
                      fontSize: '0.85rem',
                      padding: '0.5rem',
                      width: '100%',
                      marginTop: '0.5rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    Delete Asset
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ color: '#722f37', marginBottom: '1rem' }}>No Assets Yet</h3>
            <p style={{ color: '#666666', marginBottom: '2rem' }}>
              Start by adding your first luxury asset to the marketplace
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

export default ManageAssetsPage;