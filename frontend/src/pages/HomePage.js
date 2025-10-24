import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ 
      background: '#FFFFFF',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* CSS PATTERN OVERLAY - DIRECTLY IN COMPONENT */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212, 175, 55, 0.08) 35px, rgba(212, 175, 55, 0.08) 70px),
          repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(0, 0, 0, 0.03) 35px, rgba(0, 0, 0, 0.03) 70px)
        `,
        zIndex: -1,
        pointerEvents: 'none'
      }}></div>

      {/* Hero Section */}
      <section style={{ 
        background: 'transparent', 
        color: '#000000', 
        padding: '8rem 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Gold accent line top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ marginBottom: '2.5rem' }}>
            <img 
              src="/images/apex-logo.png" 
              alt="Apex Rentals" 
              style={{ 
                height: '140px',
                width: 'auto',
                animation: 'fadeInScale 1s ease-out',
                filter: 'drop-shadow(0 4px 8px rgba(212, 175, 55, 0.3))'
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
            color: '#000000',
            letterSpacing: '0.15em',
            lineHeight: '1.2',
            textShadow: '2px 2px 4px rgba(212, 175, 55, 0.1)'
          }}>
            APEX RENTALS
          </h1>
          
          {/* Gold decorative line */}
          <div style={{
            width: '200px',
            height: '3px',
            background: '#D4AF37',
            margin: '2rem auto',
            borderRadius: '2px'
          }}></div>

          <p style={{ 
            fontSize: '1.8rem', 
            marginBottom: '3.5rem', 
            color: '#333333',
            maxWidth: '800px',
            margin: '0 auto 3.5rem auto',
            lineHeight: '1.6',
            fontWeight: '300'
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
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
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
              Explore Collection
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="btn"
                style={{ 
                  fontSize: '1.3rem', 
                  padding: '1.5rem 3.5rem',
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #000000',
                  color: '#000000',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#000000';
                  e.target.style.color = '#FFFFFF';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.color = '#000000';
                  e.target.style.transform = 'translateY(0)';
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
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)'
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
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.borderWidth = '4px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderWidth = '3px';
              }}
            >
              <div style={{ 
                height: '280px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=600&fit=crop"
                  alt="Luxury Yacht"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.4) 0%, rgba(30, 58, 95, 0.3) 100%)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                }}>
                  Yachts
                </div>
              </div>
              <div style={{ padding: '2.5rem', background: 'rgba(255, 255, 255, 0.95)' }}>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: '1rem',
                  letterSpacing: '0.02em'
                }}>
                  Luxury Yachts
                </h3>
                <p style={{ 
                  color: '#333333', 
                  marginBottom: '2rem',
                  lineHeight: '1.7',
                  fontSize: '1.05rem'
                }}>
                  Sail the seas in navy blue elegance with white accents and golden luxury touches.
                </p>
                <Link 
                  to="/assets?category=yacht" 
                  className="btn"
                  style={{ 
                    width: '100%',
                    background: '#D4AF37',
                    color: '#000000',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    borderRadius: '0.5rem',
                    border: '2px solid #D4AF37',
                    transition: 'all 0.3s',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
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
                  Explore Yachts
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
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.borderWidth = '4px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderWidth = '3px';
              }}
            >
              <div style={{ 
                height: '280px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop"
                  alt="Exotic Car"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.4) 0%, rgba(220, 38, 38, 0.3) 100%)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                }}>
                  Cars
                </div>
              </div>
              <div style={{ padding: '2.5rem', background: 'rgba(255, 255, 255, 0.95)' }}>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: '1rem',
                  letterSpacing: '0.02em'
                }}>
                  Exotic Cars
                </h3>
                <p style={{ 
                  color: '#333333', 
                  marginBottom: '2rem',
                  lineHeight: '1.7',
                  fontSize: '1.05rem'
                }}>
                  Drive passion and power in bold red elegance with black sophistication and golden details.
                </p>
                <Link 
                  to="/assets?category=car" 
                  className="btn"
                  style={{ 
                    width: '100%',
                    background: '#D4AF37',
                    color: '#000000',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    borderRadius: '0.5rem',
                    border: '2px solid #D4AF37',
                    transition: 'all 0.3s',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
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
                  Explore Cars
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
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.borderWidth = '4px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderWidth = '3px';
              }}
            >
              <div style={{ 
                height: '280px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop"
                  alt="Private Jet"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(45, 55, 72, 0.4) 0%, rgba(74, 85, 104, 0.3) 100%)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                }}>
                  Jets
                </div>
              </div>
              <div style={{ padding: '2.5rem', background: 'rgba(255, 255, 255, 0.95)' }}>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: '1rem',
                  letterSpacing: '0.02em'
                }}>
                  Private Jets
                </h3>
                <p style={{ 
                  color: '#333333', 
                  marginBottom: '2rem',
                  lineHeight: '1.7',
                  fontSize: '1.05rem'
                }}>
                  Soar in sleek grey sophistication with black elegance and golden premium touches.
                </p>
                <Link 
                  to="/assets?category=jet" 
                  className="btn"
                  style={{ 
                    width: '100%',
                    background: '#D4AF37',
                    color: '#000000',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    borderRadius: '0.5rem',
                    border: '2px solid #D4AF37',
                    transition: 'all 0.3s',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
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
                  Explore Jets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ 
        padding: '6rem 0',
        background: 'rgba(248, 248, 248, 0.8)',
        position: 'relative',
        borderTop: '3px solid #D4AF37'
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
              Why Choose Apex Rentals
            </h2>
            
            {/* Gold decorative line */}
            <div style={{
              width: '150px',
              height: '3px',
              background: '#D4AF37',
              margin: '1.5rem auto',
              borderRadius: '2px'
            }}></div>

            <p style={{ color: '#333333', fontSize: '1.3rem' }}>
              Experience luxury redefined with unmatched service
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '4rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '100px',
                height: '100px',
                margin: '0 auto 2rem',
                background: '#D4AF37',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                border: '4px solid #000000'
              }}>
                ✓
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '1rem'
              }}>
                Premium Selection
              </h3>
              <p style={{ color: '#333333', lineHeight: '1.7', fontSize: '1.05rem' }}>
                Handpicked collection of the finest luxury assets worldwide
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '100px',
                height: '100px',
                margin: '0 auto 2rem',
                background: '#D4AF37',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                border: '4px solid #000000'
              }}>
                🔒
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '1rem'
              }}>
                Secure Booking
              </h3>
              <p style={{ color: '#333333', lineHeight: '1.7', fontSize: '1.05rem' }}>
                Safe and encrypted transactions for complete peace of mind
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '100px',
                height: '100px',
                margin: '0 auto 2rem',
                background: '#D4AF37',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                border: '4px solid #000000'
              }}>
                🌟
              </div>
              <h3 style={{ 
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '1rem'
              }}>
                24/7 Concierge
              </h3>
              <p style={{ color: '#333333', lineHeight: '1.7', fontSize: '1.05rem' }}>
                Dedicated support for an unparalleled luxury experience
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
      `}</style>
    </div>
  );
};

export default HomePage;