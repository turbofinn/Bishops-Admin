/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

export default function Search() {
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      if (location.pathname === '/dashboard/payments') {
        const event = new CustomEvent('headerSearch', {
          detail: { mobileNo: searchValue.trim() }
        });
        window.dispatchEvent(event);
      }
      setSearchValue('');
    }
  };

  const getPlaceholder = () => {
    if (location.pathname === '/dashboard/payments') {
      return 'Search by mobile number...';
    }
    return 'Ctrl + K';
  };

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearch}
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchOutlined />
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'weight'
          }}
          placeholder={getPlaceholder()}
        />
      </FormControl>
    </Box>
  );
}
