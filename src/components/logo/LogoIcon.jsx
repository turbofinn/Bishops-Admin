// material-ui
import { useTheme } from '@mui/material/styles';
import logo from '../../assets/Blogo3.svg'; 

export default function LogoIcon() {
  const theme = useTheme();
  return (
    <img
      src={logo}
      alt="Bishops Pharmacy Logo"
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: '50px',
        filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
      }}
    />
  );
}