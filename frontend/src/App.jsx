import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getAppTheme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';

import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import NoticesPage from './pages/NoticesPage';
import EventsPage from './pages/EventsPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('campushub_theme_mode') || 'light';
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const nextMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('campushub_theme_mode', nextMode);
      return nextMode;
    });
  };

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route
              path="/"
              element={<MainLayout currentMode={mode} onToggleTheme={toggleTheme} />}
            >
              <Route index element={<Dashboard />} />
              <Route path="notices" element={<NoticesPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="marketplace" element={<MarketplacePage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
