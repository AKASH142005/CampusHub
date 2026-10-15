import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campushub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campushub_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.user);
          localStorage.setItem('campushub_user', JSON.stringify(res.user));
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('campushub_token', data.token);
    localStorage.setItem('campushub_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('campushub_token', data.token);
    localStorage.setItem('campushub_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('campushub_token');
    localStorage.removeItem('campushub_user');
  };

  // Quick switch for demo testing
  const quickLogin = async (role = 'STUDENT') => {
    const credentials = {
      STUDENT: { email: 'student@campushub.edu', password: 'Student@123' },
      FACULTY: { email: 'faculty@campushub.edu', password: 'Faculty@123' },
      ADMIN: { email: 'admin@campushub.edu', password: 'Admin@123' }
    };
    const cred = credentials[role.toUpperCase()] || credentials.STUDENT;
    return await login(cred.email, cred.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        quickLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
