/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

import MainCard from 'components/MainCard';
import AppointmentTable from '../../sections/dashboard/default/AppointmentTable';

export default function AppointmentPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState('Booked');
  const [pharmacyNo, setPharmacyNo] = useState('PN1853278176');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    booking: null
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    action: null,
    booking: null
  });

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const formattedDate = formatDate(selectedDate);

      const token = localStorage.getItem('bishops-token');
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-bookings-by-date', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: formattedDate,
          ...(selectedStatus && { status: selectedStatus }),
          pharmacyNo
        })
      });

      const data = await response.json();

      if (data && Array.isArray(data.bookings)) {
        const transformedBookings = data.bookings.map((booking) => ({
          bookingId: booking.bookingID,
          name: booking.userName || 'N/A',
          phoneNumber: booking.mobileNo || 'N/A',
          vaccinesIDs: booking.vaccinationList || '',
          bookingDate: booking.date || formattedDate,
          slot: booking.slot || '',
          meridiem: booking.meridiem || 'AM',
          paymentMethod: booking.paymentMode || booking.paymentMethod || 'N/A',
          paymentStatus: booking.paymentStatus || 'N/A',
          paymentAmount: booking.paymentAmount || 'N/A',
          paymentId: booking.paymentId || 'N/A',
          appointmentNo: booking.appointmentNo || 'N/A',
          status: booking.status || 'Booked',
          userID: booking.userID || '',
          pharmacyNo: booking.consultantID || pharmacyNo,
          type: booking.type || '',
          consultationType: booking.consultationType || booking.consultancyType || 'N/A',
          isConsultation: booking.type?.toLowerCase() === 'consultation' || false,
          consultationDetails: booking.consultationDetails || null
        }));
        setBookings(transformedBookings);
      } else if (data?.responseStatus?.code === 1001) {
        setBookings([]);
        setSnackbar({
          open: true,
          message: data.responseStatus.message || 'No bookings found for the specified date',
          severity: 'info'
        });
      } else {
        setBookings([]);
      }
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
      setSnackbar({
        open: true,
        message: 'Failed to fetch bookings. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleViewDetails = (booking) => {
    setDetailsDialog({ open: true, booking });
  };

  const handleApproveBooking = (booking) => {
    setConfirmDialog({
      open: true,
      title: 'Approve Booking',
      content: `Are you sure you want to approve the booking for ${booking.name}?`,
      action: 'approve',
      booking
    });
  };

  const handleCancelBooking = (booking) => {
    setConfirmDialog({
      open: true,
      title: 'Cancel Booking',
      content: `Are you sure you want to cancel the booking for ${booking.name}?`,
      action: 'cancel',
      booking
    });
  };

  const confirmAction = async () => {
    const { action, booking } = confirmDialog;
    try {
      setLoading(true);

      const newStatus = action === 'approve' ? 'Accepted' : 'Cancelled';

      const payload = {
        action: 'UpdateBooking',
        bookingId: booking.bookingId,
        status: newStatus,
        date: booking.bookingDate
      };

      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bishops-token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data?.response?.code === 1001) {
        // Update local state only after successful API call
        const updatedBookings = bookings.map((b) => (b.bookingId === booking.bookingId ? { ...b, status: newStatus } : b));
        setBookings(updatedBookings);

        setSnackbar({
          open: true,
          message: `Booking successfully ${action === 'approve' ? 'approved' : 'cancelled'}`,
          severity: 'success'
        });
      } else {
        throw new Error(data?.response?.message || data?.responseStatus?.message || 'Failed to update booking');
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to ${action} booking. Please try again.`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const handleCloseDetailsDialog = () => setDetailsDialog({ ...detailsDialog, open: false });
  const handleCloseConfirmDialog = () => setConfirmDialog({ ...confirmDialog, open: false });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="Booked">Booked</MenuItem>
                  <MenuItem value="Accepted">Approved</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Button variant="contained" onClick={fetchBookings} disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Appointment Bookings</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2">{formatDate(selectedDate)}</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : (
            <AppointmentTable
              bookings={bookings}
              onViewDetails={handleViewDetails}
              onApprove={handleApproveBooking}
              onCancel={handleCancelBooking}
            />
          )}
        </MainCard>
      </Grid>
      {/* Booking Details Dialog */}
      <Dialog open={detailsDialog.open} onClose={handleCloseDetailsDialog} aria-labelledby="booking-details-dialog-title" maxWidth="md">
        <DialogTitle id="booking-details-dialog-title">Booking Details</DialogTitle>
        <DialogContent>
          {detailsDialog.booking && (
            <Box sx={{ pt: 1 }}>
              {/* Patient Information Section */}
              <Typography variant="h6" sx={{ mb: 1 }}>
                Patient Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Patient Name
                    </Typography>
                    <Typography variant="body1">{detailsDialog.booking.name || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">{detailsDialog.booking.phoneNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Appointment Date
                    </Typography>
                    <Typography variant="body1">{detailsDialog.booking.bookingDate || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Time Slot
                    </Typography>
                    <Typography variant="body1">
                      {detailsDialog.booking.slot} {detailsDialog.booking.meridiem}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Booking Type
                    </Typography>
                    <Typography variant="body1">
                      {detailsDialog.booking.isConsultation ? 'Consultation' : 'Vaccination'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      AppointmentNo ID
                    </Typography>
                    <Typography variant="body1">{detailsDialog.booking.appointmentNo || 'N/A'}</Typography>
                  </Grid>
                  {detailsDialog.booking.isConsultation && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Consultation Type
                      </Typography>
                      <Typography variant="body1">
                        {detailsDialog.booking.consultationType || 'N/A'}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Payment Details Section */}
              <Typography variant="h6" sx={{ mb: 1 }}>
                Payment Details
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Payment Amount
                    </Typography>
                    <Typography variant="body1">€ {detailsDialog.booking.paymentAmount || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Status
                    </Typography>
                    <Typography variant="body1">{detailsDialog.booking.status || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Payment Method
                    </Typography>
                    <Typography variant="body1">{detailsDialog.booking.paymentMethod || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Payment Status
                    </Typography>
                    <Typography variant="body1">{detailsDialog.booking.paymentStatus || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Vaccine Information Section - Only show if not consultation or has vaccines */}
              {(!detailsDialog.booking.isConsultation || 
                (detailsDialog.booking.vaccinesIDs && 
                 detailsDialog.booking.vaccinesIDs !== '[]' && 
                 JSON.parse(detailsDialog.booking.vaccinesIDs).length > 0)) && (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Vaccine Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Selected Vaccines
                    </Typography>
                    {detailsDialog.booking.vaccinesIDs && detailsDialog.booking.vaccinesIDs !== '[]' ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1
                        }}
                      >
                        {JSON.parse(detailsDialog.booking.vaccinesIDs).map((vaccine, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <Typography>{vaccine.vaccineName}</Typography>
                            <Typography variant="body2">Qty: {vaccine.quantity || 1}</Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No vaccines selected
                      </Typography>
                    )}
                  </Paper>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Close</Button>
          {detailsDialog.booking && detailsDialog.booking.status !== 'Accepted' && detailsDialog.booking.status !== 'Cancelled' && (
            <Button
              onClick={() => {
                handleCloseDetailsDialog();
                handleApproveBooking(detailsDialog.booking);
              }}
              color="success"
              variant="contained"
            >
              Approve
            </Button>
          )}
          {detailsDialog.booking && detailsDialog.booking.status !== 'Cancelled' && (
            <Button
              onClick={() => {
                handleCloseDetailsDialog();
                handleCancelBooking(detailsDialog.booking);
              }}
              color="error"
              variant="contained"
            >
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCloseConfirmDialog} aria-labelledby="confirm-dialog-title">
        <DialogTitle id="confirm-dialog-title">{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={confirmAction} color={confirmDialog.action === 'approve' ? 'success' : 'error'} variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
