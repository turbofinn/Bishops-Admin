// material-ui
import { useTheme } from '@mui/material/styles';
import logo from './logo.webp'; // Adjust the path as needed

export default function LogoMain() {
  const theme = useTheme();
  return (
    <img
      src={logo}
      alt="Logo"
      width="100"
      style={{ filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }}
    />
  );
}