import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assetsAPI } from '../services/api';

const AddAssetPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    asset_type: 'car',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: '',
    price_per_day: '',
    location: '',
    latitude: '',
    longitude: ''
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Create preview URLs
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setError('');
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, index) => index !== indexToRemove);
      // Clean up URL to prevent memory leaks
      if (prev[indexToRemove]) {
        URL.revokeObjectURL(prev[indexToRemove].url);
      }
      return newPreviews;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData to handle both text and file data
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('asset_type', formData.asset_type);
      formDataToSend.append('price_per_day', formData.price_per_day);
      formDataToSend.append('location', formData.location.trim());
      
      // Add optional fields
      if (formData.brand.trim()) formDataToSend.append('brand', formData.brand.trim());
      if (formData.model.trim()) formDataToSend.append('model', formData.model.trim());
      if (formData.year) formDataToSend.append('year', formData.year);
      if (formData.capacity) formDataToSend.append('capacity', formData.capacity);
      if (formData.latitude) formDataToSend.append('latitude', formData.latitude);
      if (formData.longitude) formDataToSend.append('longitude', formData.longitude);
      
      // Add image files
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      console.log('Submitting form data with', images.length, 'images');

      // Send FormData instead of JSON
      const response = await fetch('http://localhost:5000/api/assets/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          // Don't set Content-Type header - let browser set it for FormData
        },
        body: formDataToSend
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create asset');
      }

      console.log('Asset created successfully:', responseData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Asset creation error:', error);
      setError(error.message || 'Failed to create asset. Please check all required fields.');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authorized
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Please log in to add assets</h1>
        <Link to="/login" className="btn btn-gold">Login</Link>
      </div>
    );
  }

  if (user?.user_type !== 'owner') {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Only asset owners can add new assets</h1>
        <Link to="/dashboard" className="btn btn-gold">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #faf8f5 0%, #f5f3f0 100%)',
      minHeight: '100vh',
      padding: '2rem 0'
    }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
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

        <div className="card">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              Add New Luxury Asset
            </h1>
            <p style={{ color: '#666666', fontSize: '1.1rem' }}>
              List your premium asset on our exclusive marketplace
            </p>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#991b1b', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              marginBottom: '2rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                color: '#722f37', 
                fontSize: '1.5rem', 
                marginBottom: '1.5rem',
                borderBottom: '2px solid #d4af37',
                paddingBottom: '0.5rem'
              }}>
                Basic Information
              </h2>

              <div className="form-group">
                <label htmlFor="title" className="form-label">Asset Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., BMW M4 CS - Track-Ready Beast"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your luxury asset, its features, and what makes it special..."
                  required
                  rows="4"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="asset_type" className="form-label">Asset Type *</label>
                  <select
                    id="asset_type"
                    name="asset_type"
                    className="form-select"
                    value={formData.asset_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="car">🚗 Luxury Car</option>
                    <option value="yacht">🛥️ Yacht</option>
                    <option value="jet">✈️ Private Jet</option>
                    <option value="other">🏖️ Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="capacity" className="form-label">Capacity (People)</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    className="form-input"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="4"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                color: '#722f37', 
                fontSize: '1.5rem', 
                marginBottom: '1.5rem',
                borderBottom: '2px solid #d4af37',
                paddingBottom: '0.5rem'
              }}>
                Vehicle Details
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="brand" className="form-label">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    className="form-input"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="BMW"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="model" className="form-label">Model</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    className="form-input"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="M4 CS"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year" className="form-label">Year</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    className="form-input"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1980"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </div>
            </div>

            {/* Location & Pricing */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                color: '#722f37', 
                fontSize: '1.5rem', 
                marginBottom: '1.5rem',
                borderBottom: '2px solid #d4af37',
                paddingBottom: '0.5rem'
              }}>
                Location & Pricing
              </h2>

              <div className="form-group">
                <label htmlFor="location" className="form-label">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-input"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Los Angeles, CA"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="price_per_day" className="form-label">Daily Rate ($) *</label>
                  <input
                    type="number"
                    id="price_per_day"
                    name="price_per_day"
                    className="form-input"
                    value={formData.price_per_day}
                    onChange={handleInputChange}
                    placeholder="850"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="latitude" className="form-label">Latitude (Optional)</label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    className="form-input"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="34.0522"
                    step="any"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longitude" className="form-label">Longitude (Optional)</label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    className="form-input"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="-118.2437"
                    step="any"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                color: '#722f37', 
                fontSize: '1.5rem', 
                marginBottom: '1.5rem',
                borderBottom: '2px solid #d4af37',
                paddingBottom: '0.5rem'
              }}>
                Images
              </h2>

              <div className="form-group">
                <label htmlFor="images" className="form-label">Upload Images (Max 5)</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  className="form-input"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ padding: '0.75rem' }}
                />
                <p style={{ color: '#666666', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  Supported formats: JPG, PNG, GIF. Max 5MB per image.
                </p>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  {imagePreviews.map((preview, index) => (
                    <div key={preview.id} style={{ position: 'relative' }}>
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          border: '2px solid #e5e7eb'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end',
              paddingTop: '2rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <Link to="/dashboard" className="btn btn-secondary">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn btn-gold"
                disabled={loading}
                style={{ minWidth: '150px' }}
              >
                {loading ? 'Creating...' : 'Create Asset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAssetPage;