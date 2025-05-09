import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import PropTypes from 'prop-types';

const LogoutButton = ({ variant = 'icon' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth data from storage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login', { replace: true });
  };

  if (variant === 'button') {
    return (
      <Button
        variant="outlined"
        color="error"
        onClick={handleLogout}
        startIcon={<LogoutOutlined />}
      >
        Logout
      </Button>
    );
  }

  return (
    <Tooltip title="Logout">
      <IconButton onClick={handleLogout} color="error">
        <LogoutOutlined />
      </IconButton>
    </Tooltip>
  );
};

LogoutButton.propTypes = {
  variant: PropTypes.oneOf(['icon', 'button'])
};

export default LogoutButton; 