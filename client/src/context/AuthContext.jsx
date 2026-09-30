import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('alumni_portal_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (user && user.token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser((prev) => ({ ...prev, ...data.user }));
          setUserProfile(data.profile);
        } catch (error) {
          console.error('Failed to fetch user state:', error);
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('alumni_portal_user', JSON.stringify(data));
    
    // Fetch profile
    try {
      const meRes = await API.get('/auth/me');
      setUserProfile(meRes.data.profile);
    } catch (e) {
      console.error(e);
    }
    return data;
  };

  const register = async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    setUser(data);
    localStorage.setItem('alumni_portal_user', JSON.stringify(data));
    try {
      const meRes = await API.get('/auth/me');
      setUserProfile(meRes.data.profile);
    } catch (e) {
      console.error(e);
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('alumni_portal_user');
  };

  const updateProfileState = (updatedProfile, updatedUser) => {
    if (updatedProfile) setUserProfile(updatedProfile);
    if (updatedUser) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('alumni_portal_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        login,
        register,
        logout,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
