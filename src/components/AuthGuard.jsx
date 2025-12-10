/* eslint-disable prettier/prettier */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const isValidJWT = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every((part) => part.length > 0);
};

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('bishops-token');
      const refreshToken = localStorage.getItem('bishops-refersh-token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (!isLoggedIn || !accessToken || !refreshToken || !isValidJWT(accessToken) || !isValidJWT(refreshToken)) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('bishops-token');
        localStorage.removeItem('bishops-refersh-token');
        navigate('/login', { replace: true });
      }
    };
    checkAuth();

    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn' || e.key === 'bishops-token' || e.key === 'bishops-refersh-token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [navigate]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
