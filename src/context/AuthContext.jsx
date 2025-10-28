import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token) {
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      fetchUser(token);
    }
    setLoading(false);
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };

  const login = async (token, user) => {
    try {
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { token, user };
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('login-response'); // Clear SSO login response
    
    // Clear auth header
    delete api.defaults.headers.common['Authorization'];
    
    // Reset state
    setUser(null);

    // Notify Courtroom iframe of logout if it exists
    const iframe = document.getElementById('courtroom-iframe');
    if (iframe) {
      try {
        iframe.contentWindow.postMessage({ action: 'logout' }, 'http://localhost:5010');
      } catch (error) {
        console.warn('Failed to notify Courtroom of logout:', error);
      }
    }
  };

  // Permission checks
  const canAccessPromptBar = () => {
    return user && user.verified;
  };

  const canPostBlog = () => {
    return user && user.verified && user.role === 'lawyer';
  };

  const canReplyInCourtroom = () => {
    return user && user.verified && (user.role === 'lawyer' || user.role === 'law_student');
  };

  const canViewBlog = () => {
    return user && user.verified;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      canAccessPromptBar,
      canPostBlog,
      canReplyInCourtroom,
      canViewBlog,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
