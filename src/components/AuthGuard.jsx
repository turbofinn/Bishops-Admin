import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = 
      localStorage.getItem('isLoggedIn') === 'true' || 
      sessionStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;