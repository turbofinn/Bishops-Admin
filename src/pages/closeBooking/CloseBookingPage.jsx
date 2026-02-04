/* eslint-disable prettier/prettier */
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';

import MainCard from 'components/MainCard';

export default function CloseBookingPage() {
  // Get current date and time for default values
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    closeTime: getCurrentTime(),
    isClosed: false,
    openTime: getCurrentTime(),
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const PHARMACY_NO = 'PN1853278176';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.isClosed) {
      if (!formData.closeTime) {
        newErrors.closeTime = 'Close time is required';
      }
      
      if (!formData.openTime) {
        newErrors.openTime = 'Open time is required';
      }
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      const token = localStorage.getItem('bishops-token');
      const apiPayload = {
        pharmacyNo: PHARMACY_NO,
        date: formData.date,
        closeTime: formData.closeTime,
        isClosed: formData.isClosed,
        openTime: formData.openTime,
        reason: formData.reason
      };

      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/schedule-override', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(apiPayload)
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Booking closure saved successfully!',
          severity: 'success'
        });
        
        // Reset form
        setFormData({
          date: getCurrentDate(),
          closeTime: getCurrentTime(),
          isClosed: false,
          openTime: getCurrentTime(),
          reason: ''
        });
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to save booking closure: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Close Booking
        </Typography>

        <MainCard sx={{ boxShadow: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="date"
                  label="Date"
                  type="date"
                  fullWidth
                  value={formData.date}
                  onChange={handleChange}
                  error={!!errors.date}
                  helperText={errors.date}
                  InputLabelProps={{
                    shrink: true
                  }}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={<Switch checked={formData.isClosed} onChange={handleSwitchChange} name="isClosed" color="primary" />}
                  label="Completely Closed (No bookings allowed)"
                  sx={{ ml: 0 }}
                />
              </Grid>

              {!formData.isClosed && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name="openTime"
                      label="Open Time"
                      type="time"
                      fullWidth
                      value={formData.openTime}
                      onChange={handleChange}
                      error={!!errors.openTime}
                      helperText={errors.openTime}
                      InputLabelProps={{
                        shrink: true
                      }}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name="closeTime"
                      label="Close Time"
                      type="time"
                      fullWidth
                      value={formData.closeTime}
                      onChange={handleChange}
                      error={!!errors.closeTime}
                      helperText={errors.closeTime}
                      InputLabelProps={{
                        shrink: true
                      }}
                      required
                    />
                  </Grid>
                </>
              )}

              <Grid size={{ xs: 12 }}>
                <TextField
                  name="reason"
                  label="Reason"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  error={!!errors.reason}
                  helperText={errors.reason}
                  placeholder="e.g.Holiday Closure."
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={saving}
                    size="large"
                  >
                    {saving ? 'Saving...' : 'Close Booking'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', fontWeight: 'bold', fontSize: '1.1rem', border: '2px solid', borderColor: snackbar.severity === 'success' ? 'green' : 'red' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
