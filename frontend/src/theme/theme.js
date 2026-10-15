import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const getAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#6366f1' : '#4f46e5', // Modern Indigo
        light: '#818cf8',
        dark: '#3730a3',
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#06b6d4', // Vibrant Cyan
        light: '#22d3ee',
        dark: '#0891b2',
        contrastText: '#ffffff'
      },
      accent: {
        main: '#ec4899', // Pink / Rose Accent
        purple: '#a855f7'
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669'
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706'
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626'
      },
      background: {
        default: isDark ? '#0b0f19' : '#f8fafc',
        paper: isDark ? '#111827' : '#ffffff',
        subtle: isDark ? '#1f2937' : '#f1f5f9'
      },
      text: {
        primary: isDark ? '#f9fafb' : '#0f172a',
        secondary: isDark ? '#9ca3af' : '#64748b'
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h1: {
        fontFamily: "'Outfit', 'Inter', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.025em'
      },
      h2: {
        fontFamily: "'Outfit', 'Inter', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.02em'
      },
      h3: {
        fontFamily: "'Outfit', 'Inter', sans-serif",
        fontWeight: 600,
        letterSpacing: '-0.02em'
      },
      h4: {
        fontFamily: "'Outfit', 'Inter', sans-serif",
        fontWeight: 600,
        letterSpacing: '-0.015em'
      },
      h5: {
        fontFamily: "'Outfit', 'Inter', sans-serif",
        fontWeight: 600,
        letterSpacing: '-0.01em'
      },
      h6: {
        fontFamily: "'Outfit', 'Inter', sans-serif",
        fontWeight: 600
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 600
      },
      button: {
        fontFamily: "'Outfit', 'Inter', sans-serif",
        fontWeight: 600,
        textTransform: 'none'
      }
    },
    shape: {
      borderRadius: 12
    },
    shadows: [
      'none',
      isDark ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.05)',
      isDark ? '0 4px 6px -1px rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0,0,0,0.06)',
      isDark ? '0 10px 15px -3px rgba(0,0,0,0.6)' : '0 10px 15px -3px rgba(0,0,0,0.07)',
      ...Array(21).fill(isDark ? '0 12px 24px -4px rgba(0,0,0,0.7)' : '0 12px 24px -4px rgba(0,0,0,0.08)')
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 18px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 6px 20px rgba(99, 102, 241, 0.35)'
                : '0 6px 20px rgba(79, 70, 229, 0.25)'
            }
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.4)'
              : '0 4px 20px rgba(148, 163, 184, 0.08)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)'
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none'
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600
          }
        }
      }
    }
  });

  return responsiveFontSizes(theme);
};
