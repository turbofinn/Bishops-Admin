/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// project imports
import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AuthCard from './AuthCard';

// assets
import AuthBackground from './AuthBackground';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AuthBackground />
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid sx={{ px: 3, mt: 3 }} size={12}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Logo to="/" />
          </Box>
        </Grid>

        {/* Modern Asymmetrical Layout */}
        <Grid size={12} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 3, py: 2 }}>
          <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
            <Grid container spacing={6} alignItems="center" sx={{ minHeight: '70vh' }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.1
                    }}
                  >
                    Bishops Pharmacy
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 3,
                      lineHeight: 1.4
                    }}
                  >
                    Admin Management System
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6
                    }}
                  >
                    Streamline your pharmacy operations with our comprehensive admin dashboard. Manage appointments, track vaccine
                    inventory, handle patient bookings, and monitor performance metrics all in one powerful platform.
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                  <AuthCard sx={{ width: '100%', maxWidth: 420, boxShadow: 6, borderRadius: 4 }}>{children}</AuthCard>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid sx={{ p: 3, textAlign: 'center' }} size={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Powered by{' '}
            <Link
              href="https://algoflowai.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              AlgoFlowAI
            </Link>
          </Typography>
          <AuthFooter />
        </Grid>
      </Grid>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
