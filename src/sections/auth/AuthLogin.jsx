import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, FormHelperText, Grid, InputAdornment, InputLabel,
  OutlinedInput, Stack, Typography, CircularProgress, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { v4 as uuidv4 } from 'uuid';

// ============================|| OTP LOGIN ||============================ //

export default function AuthLogin() {
  const [showOtp, setShowOtp] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const navigate = useNavigate();

  const handleCloseError = () => setError('');
  const handleCloseSuccess = () => setSuccess('');

  const sendOtp = async (mobileNo) => {
    const deviceID = uuidv4();
    try {
      const response = await axios.post('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/send-otp', {
        mobileNo,
        deviceID
      });
      localStorage.setItem('clientID', response.data.clientID);
      setSuccess('OTP sent successfully!');
      setShowOtp(true);
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP');
    }
  };

  const verifyOtp = async (values, setSubmitting) => {
    const clientID = localStorage.getItem('clientID');
    try {
      const response = await axios.post('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/verify-otp', {
        mobileNo: values.mobileNo,
        otp: values.otp,
        clientID
      });
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ mobileNo: values.mobileNo }));
      navigate('/dashboard/default');
    } catch (err) {
      console.error(err);
      setError('Invalid OTP');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          mobileNo: '',
          otp: ''
        }}
        validationSchema={Yup.object().shape({
          mobileNo: Yup.string()
            .matches(/^\d{10}$/, 'Enter a valid 10-digit mobile number')
            .required('Mobile number is required'),
          otp: showOtp
            ? Yup.string().matches(/^\d{4}$/, 'Enter a valid 4-digit OTP').required('OTP is required')
            : Yup.string()
        })}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          if (!showOtp) {
            sendOtp(values.mobileNo).finally(() => {
              setLoading(false);
              setSubmitting(false);
            });
          } else {
            verifyOtp(values, setSubmitting).finally(() => {
              setLoading(false);
            });
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="mobile-login">Mobile Number</InputLabel>
                  <OutlinedInput
                    id="mobile-login"
                    type="tel"
                    name="mobileNo"
                    placeholder="Enter mobile number"
                    value={values.mobileNo}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.mobileNo && errors.mobileNo)}
                  />
                  {touched.mobileNo && errors.mobileNo && (
                    <FormHelperText error>{errors.mobileNo}</FormHelperText>
                  )}
                </Stack>
              </Grid>

              {showOtp && (
                <Grid item xs={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="otp">OTP</InputLabel>
                    <OutlinedInput
                      id="otp"
                      type={showPassword ? 'text' : 'password'}
                      name="otp"
                      placeholder="Enter OTP"
                      value={values.otp}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword(!showPassword)}
                            color="secondary"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      fullWidth
                      error={Boolean(touched.otp && errors.otp)}
                    />
                    {touched.otp && errors.otp && (
                      <FormHelperText error>{errors.otp}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}

              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading || isSubmitting}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  >
                    {loading ? (showOtp ? 'Verifying...' : 'Sending OTP...') : (showOtp ? 'Verify OTP' : 'Send OTP')}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={3000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
