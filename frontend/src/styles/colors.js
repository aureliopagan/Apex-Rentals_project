// Apex Rentals Color Themes by Asset Type

export const colors = {
    // Yacht Theme - Navy Blue, White, Black, Gold
    yacht: {
      primary: '#0A1929',      // Navy Blue
      secondary: '#D4AF37',    // Gold
      accent: '#FFFFFF',       // White
      dark: '#000000',         // Black
      light: '#F8F9FA',        // Light background
      gradient: 'linear-gradient(135deg, #0A1929 0%, #1e3a5f 50%, #D4AF37 100%)',
      cardBg: '#FFFFFF',
      textPrimary: '#0A1929',
      textSecondary: '#666666',
    },
    
    // Jet Theme - Grey, Black, White, Gold
    jet: {
      primary: '#2D3748',      // Dark Grey
      secondary: '#D4AF37',    // Gold
      accent: '#FFFFFF',       // White
      dark: '#000000',         // Black
      light: '#F7FAFC',        // Light background
      gradient: 'linear-gradient(135deg, #000000 0%, #2D3748 50%, #D4AF37 100%)',
      cardBg: '#FFFFFF',
      textPrimary: '#2D3748',
      textSecondary: '#666666',
    },
    
    // Car Theme - Red, Black, White, Gold
    car: {
      primary: '#991B1B',      // Deep Red
      secondary: '#D4AF37',    // Gold
      accent: '#FFFFFF',       // White
      dark: '#000000',         // Black
      light: '#FEF2F2',        // Light background
      gradient: 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #D4AF37 100%)',
      cardBg: '#FFFFFF',
      textPrimary: '#991B1B',
      textSecondary: '#666666',
    },
    
    // Default/General Theme - Maroon, Gold, White
    default: {
      primary: '#722F37',      // Maroon
      secondary: '#D4AF37',    // Gold
      accent: '#FFFFFF',       // White
      dark: '#1A1A1A',         // Almost Black
      light: '#FAF8F5',        // Cream background
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #722f37 50%, #d4af37 100%)',
      cardBg: '#FFFFFF',
      textPrimary: '#1A1A1A',
      textSecondary: '#666666',
    },
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  };
  
  export const getThemeColors = (assetType) => {
    const type = assetType?.toLowerCase();
    return colors[type] || colors.default;
  };