/*import { useState, useEffect } from 'react';

// material-ui
import { enGB } from 'date-fns/locale';
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
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dot from 'components/@extended/Dot';


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


  // Add this component near the top of AppointmentPage.jsx
function PaymentStatus({ status }) {
  let color;
  let title = status;

  switch (status) {
    case 'Paid':
      color = 'success';
      break;
    case 'Pending':
      color = 'warning';
      break;
    case 'Failed':
      color = 'error';
      break;
    case 'Refunded':
      color = 'info';
      break;
    default:
      color = 'primary';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

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
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` },
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
   paymentMethod: normalizePaymentMethod(booking.paymentMethod),
  paymentAmount: booking.paymentAmount || 'N/A',
 paymentStatus: booking.paymentStatus ? 
    (booking.paymentStatus.toUpperCase() === 'PAID' ? 'Paid' : 'Pending') : 
    'Pending',
  status: booking.status || 'Booked',
  userID: booking.userID || '',
  pharmacyNo: booking.consultantID || pharmacyNo,
  type: booking.type || '',
  consultationType: booking.consultationType || '',
  isConsultation: booking.type === 'consultation' || false,
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

  /*const confirmAction = async () => {
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
  };*/

  /*const confirmAction = async () => {
  const { action, booking } = confirmDialog;
  try {
    setLoading(true);
    
    const requestBody = {
      bookingId: booking.bookingId,
      paymentId: booking.paymentId || 'N/A',
      action: "UpdateBooking",
      status: action === 'approve' ? "Accept" : "Cancel",
      date: formatDate(selectedDate)
    };

    const response = await fetch(
      'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
        },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to update booking');
    }

    // Update local state
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
    
    // Close dialogs
    setDetailsDialog({ ...detailsDialog, open: false });
    setConfirmDialog({ ...confirmDialog, open: false });

  } catch (err) {
    console.error('Update booking error:', err);
    setSnackbar({
      open: true,
      message: `Failed to update booking: ${err.message}`,
      severity: 'error'
    });
  } finally {
    setLoading(false);
  }
};
  const normalizePaymentMethod = (method) => {
  if (!method) return 'Offline';
  
  const methodMap = {
    'cc': 'Credit Card',
    'card': 'Credit Card',
    'debit': 'Debit Card',
    'online': 'Online',
    'cash': 'Cash',
    'transfer': 'Bank Transfer',
  };
  
  return methodMap[method.toLowerCase()] || method;
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
   
      <Dialog
              open={detailsDialog.open}
              onClose={handleCloseDetailsDialog}
              aria-labelledby="booking-details-dialog-title"
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  minWidth: '800px'
                }
              }}
            >
              <DialogTitle 
                sx={{ 
                  m: 0, 
                  p: 3,
                  bgcolor: 'primary.main', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '1.5rem'
                }}
                id="booking-details-dialog-title"
              >
                Booking Details
                <IconButton
                  aria-label="close"
                  onClick={handleCloseDetailsDialog}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon fontSize="large" />
                </IconButton>
              </DialogTitle>
      
              <DialogContent sx={{ mt: 2, p: 3 }}>
                {detailsDialog.booking && (
                  <Grid container spacing={3}>
                    {/* Patient Information Section 
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                        Patient Information
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">Patient Name</Typography>
                            <Typography variant="body1">{detailsDialog.booking.name || 'N/A'}</Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">Phone Number</Typography>
                            <Typography variant="body1">{detailsDialog.booking.phoneNumber || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">Appointment Date</Typography>
                            <Typography variant="body1">{detailsDialog.booking.bookingDate}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">Time Slot</Typography>
                            <Typography variant="body1">
                              {detailsDialog.booking.slot} {detailsDialog.booking.meridiem || ''}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">Booking Type</Typography>
                            <Typography variant="body1">
                              {detailsDialog.booking.type || 'N/A'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
      
                    {/* Payment Details Section 
                   {/* <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                        Payment Details
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">Booking ID</Typography>
                            <Typography variant="body1">{detailsDialog.booking.bookingId}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">Payment Amount</Typography>
                            <Typography variant="body1">{detailsDialog.booking.paymentAmount || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">Status</Typography>
                            <Typography variant="body1">
                              <Chip 
                                label={detailsDialog.booking.status || 'Booked'} 
                                color={
                                  detailsDialog.booking.status === 'Approved' ? 'success' : 
                                  detailsDialog.booking.status === 'Cancelled' ? 'error' : 'primary'
                                }
                                size="small"
                              />
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight="bold">Payment Method</Typography>
                            <Typography variant="body1">{detailsDialog.booking.paymentMethod || 'N/A'}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    {/* Payment Details Section 
<Grid item xs={12}>
  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
    Payment Details
  </Typography>
  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle1" fontWeight="bold">Booking ID</Typography>
        <Typography variant="body1">{detailsDialog.booking.bookingId}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle1" fontWeight="bold">Payment Amount</Typography>
        <Typography variant="body1">{detailsDialog.booking.paymentAmount || 'N/A'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle1" fontWeight="bold">Payment Status</Typography>
        <Typography variant="body1">
          <PaymentStatus status={detailsDialog.booking.paymentStatus || 'Pending'} />
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle1" fontWeight="bold">Payment Method</Typography>
        <Typography variant="body1">
          <Chip
            label={detailsDialog.booking.paymentMethod || 'Offline'}
            color={
              detailsDialog.booking.paymentMethod === 'Online' ? 'success' : 
              detailsDialog.booking.paymentMethod === 'Credit Card' ? 'primary' : 
              detailsDialog.booking.paymentMethod === 'Debit Card' ? 'primary' : 
              detailsDialog.booking.paymentMethod === 'Cash' ? 'secondary' : 
              detailsDialog.booking.paymentMethod === 'Bank Transfer' ? 'info' : 
              'default'
            }
            size="small"
          />
        </Typography>
      </Grid>
    </Grid>
  </Paper>
</Grid>
                         {/* Consultation Information Section 
<Grid item xs={12}>
  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
    Consultation Information
  </Typography>
  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" fontWeight="bold">Consultation Type</Typography>
        <Typography variant="body1">
          {detailsDialog.booking.consultationType || 'N/A'}
        </Typography>
      </Grid>
    </Grid>
  </Paper>
</Grid>
                         
                    
                  </Grid>
                )}
              </DialogContent>
      
              <DialogActions sx={{ px: 4, pb: 4, pt: 2 }}>
                <Button 
                  onClick={handleCloseDetailsDialog} 
                  color="secondary" 
                  variant="outlined"
                  size="large"
                  sx={{ minWidth: '120px' }}
                >
                  Close
                </Button>
                {detailsDialog.booking && detailsDialog.booking.status !== 'Approved' && detailsDialog.booking.status !== 'Cancelled' && (
                  <Button
                    onClick={() => {
                      handleCloseDetailsDialog();
                      handleApproveBooking(detailsDialog.booking);
                    }}
                    color="primary"
                    variant="contained"
                    size="large"
                    sx={{ minWidth: '120px' }}
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
                    size="large"
                    sx={{ minWidth: '120px' }}
                  >
                    Cancel
                  </Button>
                )}
              </DialogActions>
            </Dialog>
      
            {/* Confirm Action Dialog 
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
      

      {/* Confirm Action Dialog 
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

      {/* Notification Snackbar 
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
}*/

import { useState, useEffect } from 'react';
import { enGB } from 'date-fns/locale';

// Material-UI imports
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
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dot from 'components/@extended/Dot';

// Project imports
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

  // For display (DD-MM-YYYY)
  const formatDisplayDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  // For API (YYYY-MM-DD)
  const formatAPIDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  function PaymentStatus({ status }) {
    let color;
    let title = status;

    switch (status) {
      case 'Paid': color = 'success'; break;
      case 'Pending': color = 'warning'; break;
      case 'Failed': color = 'error'; break;
      case 'Refunded': color = 'info'; break;
      default: color = 'primary';
    }

    return (
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
        <Dot color={color} />
        <Typography>{title}</Typography>
      </Stack>
    );
  }

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const formattedDate = formatAPIDate(selectedDate);

      const response = await fetch(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-bookings-by-date',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
          },
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
          paymentMethod: normalizePaymentMethod(booking.paymentMethod),
          paymentAmount: booking.paymentAmount || 'N/A',
          paymentStatus: booking.paymentStatus ? 
            (booking.paymentStatus.toUpperCase() === 'PAID' ? 'Paid' : 'Pending') : 
            'Pending',
          status: booking.status || 'Booked',
          userID: booking.userID || '',
          pharmacyNo: booking.consultantID || pharmacyNo,
          type: booking.type || '',
          consultationType: booking.consultationType || '',
          isConsultation: booking.type === 'consultation' || false,
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
  }, [selectedDate, selectedStatus]);

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
      
      const requestBody = {
        bookingId: booking.bookingId,
        paymentId: booking.paymentId || 'N/A',
        action: "UpdateBooking",
        status: action === 'approve' ? "Accept" : "Cancel",
        date: formatAPIDate(selectedDate)
      };

      const response = await fetch(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
          },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update booking');
      }

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
      
      setDetailsDialog({ ...detailsDialog, open: false });
      setConfirmDialog({ ...confirmDialog, open: false });

    } catch (err) {
      console.error('Update booking error:', err);
      setSnackbar({
        open: true,
        message: `Failed to update booking: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizePaymentMethod = (method) => {
    if (!method) return 'Offline';
    const methodMap = {
      'cc': 'Credit Card',
      'card': 'Credit Card',
      'debit': 'Debit Card',
      'online': 'Online',
      'cash': 'Cash',
      'transfer': 'Bank Transfer',
    };
    return methodMap[method.toLowerCase()] || method;
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
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  inputFormat="dd-MM-yyyy"
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
              {formatDisplayDate(selectedDate)}
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

      <Dialog
        open={detailsDialog.open}
        onClose={handleCloseDetailsDialog}
        aria-labelledby="booking-details-dialog-title"
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            minWidth: '800px'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            m: 0, 
            p: 3,
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1.5rem'
          }}
          id="booking-details-dialog-title"
        >
          Booking Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDetailsDialog}
            sx={{ color: 'white' }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2, p: 3 }}>
          {detailsDialog.booking && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Patient Information
                </Typography>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Patient Name</Typography>
                      <Typography variant="body1">{detailsDialog.booking.name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Phone Number</Typography>
                      <Typography variant="body1">{detailsDialog.booking.phoneNumber || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Appointment Date</Typography>
                      <Typography variant="body1">{formatDisplayDate(detailsDialog.booking.bookingDate)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Time Slot</Typography>
                      <Typography variant="body1">
                        {detailsDialog.booking.slot} {detailsDialog.booking.meridiem || ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Booking Type</Typography>
                      <Typography variant="body1">
                        {detailsDialog.booking.type || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Payment Details
                </Typography>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Booking ID</Typography>
                      <Typography variant="body1">{detailsDialog.booking.bookingId}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Payment Amount</Typography>
                      <Typography variant="body1">{detailsDialog.booking.paymentAmount || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Payment Status</Typography>
                      <Typography variant="body1">
                        <PaymentStatus status={detailsDialog.booking.paymentStatus || 'Pending'} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Payment Method</Typography>
                      <Typography variant="body1">
                        <Chip
                          label={detailsDialog.booking.paymentMethod || 'Offline'}
                          color={
                            detailsDialog.booking.paymentMethod === 'Online' ? 'success' : 
                            detailsDialog.booking.paymentMethod === 'Credit Card' ? 'primary' : 
                            detailsDialog.booking.paymentMethod === 'Debit Card' ? 'primary' : 
                            detailsDialog.booking.paymentMethod === 'Cash' ? 'secondary' : 
                            detailsDialog.booking.paymentMethod === 'Bank Transfer' ? 'info' : 
                            'default'
                          }
                          size="small"
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Consultation Information
                </Typography>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold">Consultation Type</Typography>
                      <Typography variant="body1">
                        {detailsDialog.booking.consultationType || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 4, pt: 2 }}>
          <Button 
            onClick={handleCloseDetailsDialog} 
            color="secondary" 
            variant="outlined"
            size="large"
            sx={{ minWidth: '120px' }}
          >
            Close
          </Button>
          {detailsDialog.booking && detailsDialog.booking.status !== 'Approved' && detailsDialog.booking.status !== 'Cancelled' && (
            <Button
              onClick={() => {
                handleCloseDetailsDialog();
                handleApproveBooking(detailsDialog.booking);
              }}
              color="primary"
              variant="contained"
              size="large"
              sx={{ minWidth: '120px' }}
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
              size="large"
              sx={{ minWidth: '120px' }}
            >
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>

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