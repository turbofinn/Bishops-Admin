

/*import { useState, useEffect } from 'react';

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
import BookingTable from '../../sections/dashboard/default/BookingTable';
import PaymentTable from '../../sections/dashboard/default/PaymentTable';

export default function PaymentPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const [consultantID, setConsultantID] = useState('');
    const [pharmacyNo, setPharmacyNo] = useState('PN1853278176');

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    console.log("payments", payments)



    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    /*const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const formattedDate = formatDate(selectedDate);

            const response = await fetch(
                'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-payment-by-date',
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

            if (data && Array.isArray(data.payments)) {
                setpayments(data.payments);
            } else if (data?.responseStatus?.code !== 1001) {
                setpayments([]);
                setSnackbar({
                    open: true,
                    message: data.responseStatus.message || 'No payments found for the specified date',
                    severity: 'info'
                });
            } else {
                setpayments([]);
            }
        } catch (err) {
            console.error('Error fetching payments:', err);
            setError('Failed to fetch payments. Please try again.');
            setSnackbar({
                open: true,
                message: 'Failed to fetch payments. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchPayments = async () => {
    try {
        setLoading(true);
        setError(null);
        const formattedDate = formatDate(selectedDate);

        const response = await fetch(
            'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-payment-by-date',
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
                },
                body: JSON.stringify({
                    date: formattedDate,
                    includePaymentMethods: true,  // Explicitly request payment methods
                    ...(selectedStatus && { status: selectedStatus }),
                    ...(consultantID && { consultantID }),
                    pharmacyNo
                })
            }
        );

        const data = await response.json();

        if (data && Array.isArray(data.payments)) {
            // Transform payment methods to consistent format
            const paymentsWithMethods = data.payments.map(payment => ({
                ...payment,
                // Ensure paymentMethod exists and has a default value
                paymentMethod: payment.paymentMethod || payment.method || 'Offline',
                // Normalize method names if needed
                paymentMethod: normalizePaymentMethod(payment.paymentMethod)
            }));
            
            setPayments(paymentsWithMethods);
        } else if (data?.responseStatus?.code === 1001) {
            setPayments([]);
            setSnackbar({
                open: true,
                message: data.responseStatus.message || 'No payments found for the specified date',
                severity: 'info'
            });
        } else {
            setPayments([]);
        }
    } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to fetch payments. Please try again.');
        setSnackbar({
            open: true,
            message: 'Failed to fetch payments. Please try again.',
            severity: 'error'
        });
    } finally {
        setLoading(false);
    }
};

// Helper function to normalize payment method names
const normalizePaymentMethod = (method) => {
    if (!method) return 'Offline';
    
    const methodMap = {
        'cc': 'Credit Card',
        'card': 'Credit Card',
        'debit': 'Debit Card',
        'online': 'Online',
        'cash': 'Cash',
        'transfer': 'Bank Transfer',
        // Add other mappings as needed
    };
    
    return methodMap[method.toLowerCase()] || method;
};

    useEffect(() => {
        fetchPayments();
    }, []);



    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });


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
                                    <MenuItem value="Paid">Paid</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Button
                                variant="contained"
                                onClick={fetchPayments}
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
                        <Typography variant="h5">Vaccination payments</Typography>
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
                        <PaymentTable
                            payments={payments}
                        />
                    )}
                </MainCard>
            </Grid>

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
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dot from 'components/@extended/Dot';

// Project imports
import MainCard from 'components/MainCard';
import PaymentTable from '../../sections/dashboard/default/PaymentTable';

export default function PaymentPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const [consultantID, setConsultantID] = useState('');
    const [pharmacyNo] = useState('PN1853278176');

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const [detailsDialog, setDetailsDialog] = useState({
        open: false,
        payment: null
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

    const PaymentStatus = ({ status }) => {
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
    };

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const formattedDate = formatAPIDate(selectedDate);

            const response = await fetch(
                'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-payment-by-date',
                {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
                    },
                    body: JSON.stringify({
                        date: formattedDate,
                        includePaymentMethods: true,
                        ...(selectedStatus && { status: selectedStatus }),
                        ...(consultantID && { consultantID }),
                        pharmacyNo
                    })
                }
            );

            const data = await response.json();

            if (data && Array.isArray(data.payments)) {
                const paymentsWithMethods = data.payments.map(payment => ({
                    ...payment,
                    paymentMethod: normalizePaymentMethod(payment.paymentMethod || payment.method),
                    formattedDate: formatDisplayDate(payment.date || selectedDate)
                }));
                
                setPayments(paymentsWithMethods);
            } else if (data?.responseStatus?.code === 1001) {
                setPayments([]);
                setSnackbar({
                    open: true,
                    message: data.responseStatus.message || 'No payments found for the specified date',
                    severity: 'info'
                });
            } else {
                setPayments([]);
            }
        } catch (err) {
            console.error('Error fetching payments:', err);
            setError('Failed to fetch payments. Please try again.');
            setSnackbar({
                open: true,
                message: 'Failed to fetch payments. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = (updatedPayment) => {
        setPayments(prevPayments => 
            prevPayments.map(payment => 
                payment.id === updatedPayment.id ? { ...payment, status: 'PAID', paymentStatus: 'PAID' } : payment
            )
        );
        fetchPayments(); // Refresh the list
    };

    useEffect(() => {
        fetchPayments();
    }, [selectedDate, selectedStatus]);

    const handleViewDetails = (payment) => {
        setDetailsDialog({
            open: true,
            payment: payment
        });
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
    const handleCloseDetailsDialog = () => setDetailsDialog({ open: false, payment: null });

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
                                    <MenuItem value="Paid">Paid</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Button
                                variant="contained"
                                onClick={fetchPayments}
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
                        <Typography variant="h5">Vaccination Payments</Typography>
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
                        <PaymentTable
                            payments={payments}
                            onViewDetails={handleViewDetails}
                            onMarkAsPaid={handleMarkAsPaid}
                        />
                    )}
                </MainCard>
            </Grid>

            <Dialog
                open={detailsDialog.open}
                onClose={handleCloseDetailsDialog}
                aria-labelledby="payment-details-dialog-title"
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
                    id="payment-details-dialog-title"
                >
                    Payment Details
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDetailsDialog}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ mt: 2, p: 3 }}>
                    {detailsDialog.payment && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                                    Patient Information
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1" fontWeight="bold">Patient Name</Typography>
                                            <Typography variant="body1">{detailsDialog.payment.userName || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1" fontWeight="bold">Appointment Type</Typography>
                                            <Typography variant="body1">{detailsDialog.payment.type || 'Vaccination/Consultation'}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1" fontWeight="bold">Date</Typography>
                                            <Typography variant="body1">{formatDisplayDate(detailsDialog.payment.date) || 'N/A'}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                                    Payment Information
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1" fontWeight="bold">Amount</Typography>
                                            <Typography variant="body1">₹{detailsDialog.payment.amount || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1" fontWeight="bold">Payment Status</Typography>
                                            <PaymentStatus status={detailsDialog.payment.status || 'Pending'} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1" fontWeight="bold">Payment Method</Typography>
                                            <Chip
                                                label={detailsDialog.payment.paymentMethod || 'Offline'}
                                                color={
                                                    detailsDialog.payment.paymentMethod === 'Online' ? 'success' :
                                                    detailsDialog.payment.paymentMethod === 'Credit Card' ? 'primary' :
                                                    detailsDialog.payment.paymentMethod === 'Debit Card' ? 'primary' :
                                                    detailsDialog.payment.paymentMethod === 'Cash' ? 'secondary' :
                                                    detailsDialog.payment.paymentMethod === 'Bank Transfer' ? 'info' :
                                                    'default'
                                                }
                                                size="small"
                                            />
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