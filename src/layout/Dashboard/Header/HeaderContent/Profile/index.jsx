/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

export default function Profile() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true'
  );

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true';
      const accessToken = localStorage.getItem('bishops-token');

      if (!loggedIn || !accessToken) {
        setIsLoggedIn(false);
        navigate('/login', { replace: true });
      } else {
        setIsLoggedIn(loggedIn);
      }
    };

    checkAuth();

    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn' || e.key === 'bishops-token') {
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

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    handleClose();
    navigate('/login');
  };

  if (!isLoggedIn) return null;

  const displayName = 'Bishops Admin';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        onClick={handleOpen}
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ p: 0.25, borderRadius: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ p: 0.25 }}>
          <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>B</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600, ml: 0.5 }}>
            Bishops Admin
          </Typography>
          <ExpandMoreIcon fontSize="small" sx={{ ml: 0.25, opacity: 0.8 }} />
        </Stack>
      </ButtonBase>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { minWidth: 120, py: 0, boxShadow: 'none', border: '1px solid', borderColor: 'divider' } }}
      >
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 0.2,
            px: 1,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <LogoutOutlined />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
