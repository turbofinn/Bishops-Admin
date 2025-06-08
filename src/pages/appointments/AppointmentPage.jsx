import { useState, useEffect } from 'react';

// material-ui
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
import Stack from '@mui/material/Stack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

// project imports
import MainCard from 'components/MainCard';
import AppointmentTable from '../../sections/dashboard/default/AppointmentTable';

export default function AppointmentPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState('Booked');
  const [consultantID, setConsultantID] = useState('');
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

      const response = await fetch(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-bookings-by-date',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: formattedDate,
            ...(selectedStatus && { status: selectedStatus }),
            ...(consultantID && { consultantID }),
            pharmacyNo
          })
        }
      );

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
          paymentMethod: booking.paymentMethod || 'N/A',
          status: booking.status || 'Booked',
          userID: booking.userID || '',
          pharmacyNo: booking.consultantID || pharmacyNo,
          type: booking.type || '',
          consultationType: booking.consultationType || ''
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
      console.error('Error fetching bookings:', err);
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
      const updatedBookings = bookings.map(b =>
        b.bookingId === booking.bookingId
          ? { ...b, status: action === 'approve' ? 'Approved' : 'Cancelled' }
          : b
      );
      setBookings(updatedBookings);
      setSnackbar({
        open: true,
        message: `Booking successfully ${action === 'approve' ? 'approved' : 'cancelled'}`,
        severity: 'success'
      });
    } catch (err) {
      console.error(`Error ${action}ing booking:`, err);
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
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
        
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                onClick={fetchBookings}
                disabled={loading}
                fullWidth
              >
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
            <Typography variant="subtitle2">
              {formatDate(selectedDate)}
            </Typography>
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
      <Dialog
        open={detailsDialog.open}
        onClose={handleCloseDetailsDialog}
        aria-labelledby="booking-details-dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="booking-details-dialog-title">
          Booking Details
        </DialogTitle>
        <DialogContent>
          {detailsDialog.booking && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Booking ID</Typography>
                        <Typography variant="body2">{detailsDialog.booking.bookingId}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Status</Typography>
                        <Typography variant="body2">{detailsDialog.booking.status || 'Booked'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Appointment Date</Typography>
                        <Typography variant="body2">{detailsDialog.booking.bookingDate}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Time Slot</Typography>
                        <Typography variant="body2">{detailsDialog.booking.slot} {detailsDialog.booking.meridiem}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>Patient Information</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Patient Name</Typography>
                        <Typography variant="body2">{detailsDialog.booking.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Phone Number</Typography>
                        <Typography variant="body2">{detailsDialog.booking.phoneNumber}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">User ID</Typography>
                        <Typography variant="body2">{detailsDialog.booking.userID}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Payment Method</Typography>
                        <Typography variant="body2">{detailsDialog.booking.paymentMethod}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>Vaccine Information</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Selected Vaccines</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {detailsDialog.booking.vaccinesIDs?.split(',').map((vaccine, i) => (
                        <Chip 
                          key={i} 
                          label={vaccine.trim()} 
                          color="primary" 
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Close</Button>
          {detailsDialog.booking && detailsDialog.booking.status !== 'Approved' && detailsDialog.booking.status !== 'Cancelled' && (
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
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button 
            onClick={confirmAction} 
            color={confirmDialog.action === 'approve' ? 'success' : 'error'} 
            variant="contained" 
            autoFocus
          >
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}