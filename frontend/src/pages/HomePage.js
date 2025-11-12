import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [imagePath, setImagePath] = useState('/images/yachtbg.jpg');

  // Try different image paths if one fails
  const imagePaths = [
    '/images/yachtbg.jpg',
    './images/yachtbg.jpg',
    '/yachtbg.jpg',
    `${process.env.PUBLIC_URL}/images/yachtbg.jpg`,
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=80' // Fallback yacht image
  ];

  useEffect(() => {
    // Test if image loads
    const img = new Image();
    img.onload = () => {
      console.log('✅ Yacht image loaded successfully from:', imagePath);
    };
    img.onerror = () => {
      console.error('❌ Failed to load yacht image from:', imagePath);
      setImageError(true);
      // Try next path
      const currentIndex = imagePaths.indexOf(imagePath);
      if (currentIndex < imagePaths.length - 1) {
        console.log('Trying next path:', imagePaths[currentIndex + 1]);
        setImagePath(imagePaths[currentIndex + 1]);
      }
    };
    img.src = imagePath;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePath]); // Only depend on imagePath, not imagePaths array

  return (
    <div style={{ 
      background: '#FFFFFF',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* SOPHISTICATED GEOMETRIC PATTERN OVERLAY - From Dashboard */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
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
        animation: 'subtleMove 60s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>

      {/* Hero Section with Yacht Background */}
      <section style={{ 
        position: 'relative',
        color: '#FFFFFF', 
        padding: '8rem 0',
        textAlign: 'center',
        overflow: 'hidden',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Yacht Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}></div>

        {/* Dark overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.65) 0%, rgba(114, 47, 55, 0.5) 50%, rgba(0, 0, 0, 0.65) 100%)',
          zIndex: 1
        }}></div>

        {/* Gold accent line top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          zIndex: 2
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          {/* Debug info - remove this after it works */}
          {imageError && (
            <div style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              background: 'rgba(255, 0, 0, 0.8)',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px',
              zIndex: 9999
            }}>
              Image loading issue. Check console. Current path: {imagePath}
            </div>
          )}

          {/* Logo */}
          <div style={{ marginBottom: '2.5rem' }}>
            <img 
              src="/images/apex-logo.png" 
              alt="Apex Rentals" 
              style={{ 
                height: '140px',
                width: 'auto',
                animation: 'fadeInScale 1s ease-out',
                filter: 'drop-shadow(0 8px 16px rgba(212, 175, 55, 0.6))'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <h1 style={{ 
            fontSize: '5rem', 
            marginBottom: '1.5rem', 
            fontWeight: 'bold',
            color: '#FFFFFF',
            letterSpacing: '0.15em',
            lineHeight: '1.2',
            textShadow: '3px 3px 12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.4)'
          }}>
            APEX RENTALS
          </h1>
          
          {/* Gold decorative line */}
          <div style={{
            width: '200px',
            height: '3px',
            background: '#D4AF37',
            margin: '2rem auto',
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)'
          }}></div>

          <p style={{ 
            fontSize: '1.8rem', 
            marginBottom: '3.5rem', 
            color: '#FFFFFF',
            maxWidth: '800px',
            margin: '0 auto 3.5rem auto',
            lineHeight: '1.6',
            fontWeight: '300',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
          }}>
            Experience unparalleled luxury with our exclusive collection of yachts, exotic cars, and private jets
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/assets" 
              className="btn btn-gold" 
              style={{ 
                fontSize: '1.3rem', 
                padding: '1.5rem 3.5rem',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.6)',
                background: '#D4AF37',
                color: '#000000',
                border: '2px solid #D4AF37',
                borderRadius: '0.5rem',
                fontWeight: '700',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#FFFFFF';
                e.target.style.color = '#000000';
                e.target.style.borderColor = '#FFFFFF';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#D4AF37';
                e.target.style.color = '#000000';
                e.target.style.borderColor = '#D4AF37';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.6)';
              }}
            >
              Explore Collection
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="btn"
                style={{ 
                  fontSize: '1.3rem', 
                  padding: '1.5rem 3.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '3px solid #FFFFFF',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.color = '#000000';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.color = '#FFFFFF';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        {/* Gold accent line bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          zIndex: 2
        }}></div>
      </section>

      {/* Categories Section */}
      <section style={{ 
        padding: '6rem 0', 
        background: 'transparent',
        position: 'relative'
      }}>
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '3.5rem', 
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '1rem',
              letterSpacing: '0.05em'
            }}>
              Choose Your Luxury Experience
            </h2>
            
            {/* Gold decorative line */}
            <div style={{
              width: '150px',
              height: '3px',
              background: '#D4AF37',
              margin: '1.5rem auto',
              borderRadius: '2px'
            }}></div>

            <p style={{ color: '#333333', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto' }}>
              Select from our curated collection of premium assets
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '3rem' }}>
            {/* Yacht Category */}
            <div 
              style={{ 
                padding: 0,
                overflow: 'hidden',
                border: '3px solid #D4AF37',
                borderRadius: '1rem',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.borderColor = '#B8941F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#D4AF37';
              }}
            >
              <div style={{ 
                height: '280px', 
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600" 
                  alt="Yachts" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(212, 175, 55, 0.95)',
                  color: '#000000',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '2rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}>
                  PREMIUM
                </div>
              </div>
              <div style={{ padding: '2.5rem' }}>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: '#000000',
                  letterSpacing: '0.03em'
                }}>
                  Luxury Yachts
                </h3>
                <p style={{ 
                  color: '#666666',
                  lineHeight: '1.7',
                  fontSize: '1.1rem',
                  marginBottom: '2rem'
                }}>
                  Sail the seas in unmatched elegance. Our fleet features world-class vessels with premium amenities
                </p>
                <Link 
                  to="/assets?category=yacht" 
                  style={{ 
                    display: 'inline-block',
                    color: '#D4AF37',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid #D4AF37',
                    paddingBottom: '0.25rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#000000';
                    e.target.style.borderColor = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#D4AF37';
                    e.target.style.borderColor = '#D4AF37';
                  }}
                >
                  VIEW YACHTS →
                </Link>
              </div>
            </div>

            {/* Car Category */}
            <div 
              style={{ 
                padding: 0,
                overflow: 'hidden',
                border: '3px solid #D4AF37',
                borderRadius: '1rem',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.borderColor = '#B8941F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#D4AF37';
              }}
            >
              <div style={{ 
                height: '280px', 
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600" 
                  alt="Exotic Cars" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(212, 175, 55, 0.95)',
                  color: '#000000',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '2rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}>
                  EXCLUSIVE
                </div>
              </div>
              <div style={{ padding: '2.5rem' }}>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: '#000000',
                  letterSpacing: '0.03em'
                }}>
                  Exotic Cars
                </h3>
                <p style={{ 
                  color: '#666666',
                  lineHeight: '1.7',
                  fontSize: '1.1rem',
                  marginBottom: '2rem'
                }}>
                  Drive your dreams with our collection of supercars and luxury vehicles from prestigious brands
                </p>
                <Link 
                  to="/assets?category=car" 
                  style={{ 
                    display: 'inline-block',
                    color: '#D4AF37',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid #D4AF37',
                    paddingBottom: '0.25rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#000000';
                    e.target.style.borderColor = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#D4AF37';
                    e.target.style.borderColor = '#D4AF37';
                  }}
                >
                  VIEW CARS →
                </Link>
              </div>
            </div>

            {/* Jet Category */}
            <div 
              style={{ 
                padding: 0,
                overflow: 'hidden',
                border: '3px solid #D4AF37',
                borderRadius: '1rem',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.borderColor = '#B8941F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#D4AF37';
              }}
            >
              <div style={{ 
                height: '280px', 
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600" 
                  alt="Private Jets" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(212, 175, 55, 0.95)',
                  color: '#000000',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '2rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}>
                  ELITE
                </div>
              </div>
              <div style={{ padding: '2.5rem' }}>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: '#000000',
                  letterSpacing: '0.03em'
                }}>
                  Private Jets
                </h3>
                <p style={{ 
                  color: '#666666',
                  lineHeight: '1.7',
                  fontSize: '1.1rem',
                  marginBottom: '2rem'
                }}>
                  Soar above the clouds in ultimate comfort with our exclusive private aviation services
                </p>
                <Link 
                  to="/assets?category=jet" 
                  style={{ 
                    display: 'inline-block',
                    color: '#D4AF37',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid #D4AF37',
                    paddingBottom: '0.25rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#000000';
                    e.target.style.borderColor = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#D4AF37';
                    e.target.style.borderColor = '#D4AF37';
                  }}
                >
                  VIEW JETS →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ 
        padding: '6rem 0',
        background: 'rgba(212, 175, 55, 0.03)',
        position: 'relative',
        borderTop: '3px solid #D4AF37',
        borderBottom: '3px solid #D4AF37'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '1rem',
              letterSpacing: '0.05em'
            }}>
              HOW IT WORKS
            </h2>
            <div style={{
              width: '150px',
              height: '3px',
              background: '#D4AF37',
              margin: '1.5rem auto',
              borderRadius: '2px'
            }}></div>
            <p style={{ fontSize: '1.2rem', color: '#333333', maxWidth: '700px', margin: '0 auto' }}>
              Rent luxury assets in four simple steps
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {/* Step 1 */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 2rem',
                background: '#D4AF37',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
                fontWeight: 'bold',
                color: '#000000',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                border: '4px solid #000000',
                position: 'relative',
                zIndex: 1
              }}>
                1
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '1rem',
                letterSpacing: '0.05em'
              }}>
                BROWSE ASSETS
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '1.05rem' }}>
                Explore our curated collection of luxury yachts, exotic cars, and private jets. Filter by category, location, and price to find your perfect match.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 2rem',
                background: '#D4AF37',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
                fontWeight: 'bold',
                color: '#000000',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                border: '4px solid #000000',
                position: 'relative',
                zIndex: 1
              }}>
                2
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '1rem',
                letterSpacing: '0.05em'
              }}>
                REQUEST BOOKING
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '1.05rem' }}>
                Select your desired dates and submit a booking request. Our system checks real-time availability and calculates the total price automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 2rem',
                background: '#D4AF37',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
                fontWeight: 'bold',
                color: '#000000',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                border: '4px solid #000000',
                position: 'relative',
                zIndex: 1
              }}>
                3
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '1rem',
                letterSpacing: '0.05em'
              }}>
                GET CONFIRMED
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '1.05rem' }}>
                The asset owner reviews your request and confirms the booking. Receive instant notification via email and track status in your dashboard.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 2rem',
                background: '#D4AF37',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
                fontWeight: 'bold',
                color: '#000000',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                border: '4px solid #000000',
                position: 'relative',
                zIndex: 1
              }}>
                4
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '1rem',
                letterSpacing: '0.05em'
              }}>
                ENJOY LUXURY
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '1.05rem' }}>
                Experience your luxury rental with complete peace of mind. After your journey, leave a review to help future clients and earn rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '6rem 0',
        background: 'linear-gradient(135deg, rgba(245, 245, 245, 0.8) 0%, rgba(250, 250, 250, 0.8) 100%)',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '3.5rem', 
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '1rem',
              letterSpacing: '0.05em'
            }}>
              Why Choose Apex Rentals
            </h2>
            
            <div style={{
              width: '150px',
              height: '3px',
              background: '#D4AF37',
              margin: '1.5rem auto',
              borderRadius: '2px'
            }}></div>

            <p style={{ color: '#333333', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto' }}>
              We provide exceptional service and unmatched luxury
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '3rem' }}>
            <div style={{ 
              textAlign: 'center',
              padding: '3rem 2rem',
              background: '#FFFFFF',
              borderRadius: '1rem',
              border: '2px solid #E5E5E5',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#E5E5E5';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            >
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1.5rem',
                color: '#D4AF37'
              }}>
                ✓
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#000000',
                letterSpacing: '0.02em'
              }}>
                Verified Assets
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '1.1rem' }}>
                Every asset in our collection is thoroughly vetted and maintained to the highest standards
              </p>
            </div>

            <div style={{ 
              textAlign: 'center',
              padding: '3rem 2rem',
              background: '#FFFFFF',
              borderRadius: '1rem',
              border: '2px solid #E5E5E5',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#E5E5E5';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            >
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1.5rem',
                color: '#D4AF37'
              }}>
                🛡️
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#000000',
                letterSpacing: '0.02em'
              }}>
                Secure Bookings
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '1.1rem' }}>
                Your transactions are protected with industry-leading security and insurance coverage
              </p>
            </div>

            <div style={{ 
              textAlign: 'center',
              padding: '3rem 2rem',
              background: '#FFFFFF',
              borderRadius: '1rem',
              border: '2px solid #E5E5E5',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#E5E5E5';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            >
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1.5rem',
                color: '#D4AF37'
              }}>
                ⭐
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#000000',
                letterSpacing: '0.02em'
              }}>
                Premium Support
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '1.1rem' }}>
                24/7 concierge service to ensure your experience exceeds expectations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ 
        padding: '6rem 0',
        background: 'transparent',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '3.5rem', 
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '1rem',
              letterSpacing: '0.05em'
            }}>
              Meet Our Team
            </h2>
            
            <div style={{
              width: '150px',
              height: '3px',
              background: '#D4AF37',
              margin: '1.5rem auto',
              borderRadius: '2px'
            }}></div>

            <p style={{ color: '#333333', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto' }}>
              The talented developers behind Apex Rentals
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Aurelio - Backend Developer */}
            <div style={{
              textAlign: 'center',
              background: '#FFFFFF',
              padding: '3rem 2rem',
              borderRadius: '1rem',
              border: '2px solid #E5E5E5',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#E5E5E5';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}
            >
              <div style={{
                width: '180px',
                height: '180px',
                margin: '0 auto 2rem',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid #D4AF37',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src="/images/aurelio.jpg"
                  alt="Aurelio G. Pagan Santana"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span style={{ 
                  fontSize: '4rem', 
                  color: '#000000',
                  position: 'absolute'
                }}>👨‍💻</span>
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '0.5rem',
                letterSpacing: '0.02em'
              }}>
                Aurelio G. Pagan Santana
              </h3>
              <p style={{ 
                fontSize: '1.2rem',
                color: '#D4AF37',
                marginBottom: '1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Backend Developer
              </p>
              <p style={{ 
                color: '#666666',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                Architecting robust server-side solutions, database design, and API development with Python/Flask
              </p>
            </div>

            {/* Joan - Frontend Developer */}
            <div style={{
              textAlign: 'center',
              background: '#FFFFFF',
              padding: '3rem 2rem',
              borderRadius: '1rem',
              border: '2px solid #E5E5E5',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#E5E5E5';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}
            >
              <div style={{
                width: '180px',
                height: '180px',
                margin: '0 auto 2rem',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid #D4AF37',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src="/images/joan.jpg"
                  alt="Joan Martinez"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span style={{ 
                  fontSize: '4rem', 
                  color: '#000000',
                  position: 'absolute'
                }}>👨‍💻</span>
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '0.5rem',
                letterSpacing: '0.02em'
              }}>
                Joan Martinez
              </h3>
              <p style={{ 
                fontSize: '1.2rem',
                color: '#D4AF37',
                marginBottom: '1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Frontend Developer
              </p>
              <p style={{ 
                color: '#666666',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                Crafting exceptional user experiences with React, modern JavaScript, and elegant CSS design
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '6rem 0',
        background: 'transparent',
        color: '#000000',
        textAlign: 'center',
        position: 'relative',
        borderTop: '3px solid #D4AF37'
      }}>
        <div className="container" style={{ position: 'relative' }}>
          <h2 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold',
            marginBottom: '2rem',
            color: '#000000',
            letterSpacing: '0.05em'
          }}>
            Ready to Experience Luxury?
          </h2>
          
          {/* Gold decorative line */}
          <div style={{
            width: '150px',
            height: '3px',
            background: '#D4AF37',
            margin: '1.5rem auto 2rem',
            borderRadius: '2px'
          }}></div>

          <p style={{ 
            fontSize: '1.4rem', 
            marginBottom: '3rem',
            color: '#333333',
            maxWidth: '700px',
            margin: '0 auto 3rem'
          }}>
            Join thousands of satisfied clients who trust Apex Rentals
          </p>
          <Link 
            to="/assets" 
            className="btn btn-gold"
            style={{ 
              fontSize: '1.3rem', 
              padding: '1.5rem 3.5rem',
              textDecoration: 'none',
              background: '#D4AF37',
              color: '#000000',
              border: '2px solid #D4AF37',
              fontWeight: '700',
              borderRadius: '0.5rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#000000';
              e.target.style.color = '#D4AF37';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#D4AF37';
              e.target.style.color = '#000000';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

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

export default HomePage;