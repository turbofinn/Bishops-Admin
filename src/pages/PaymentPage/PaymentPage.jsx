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
import Dot from 'components/@extended/Dot';

// Project imports
import MainCard from 'components/MainCard';
import PaymentTable from '../../sections/dashboard/default/PaymentTable';

export default function PaymentPage() {
    const [payments, setPayments] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [consultantID, setConsultantID] = useState('');
    const [pharmacyNo] = useState('PN1853278176');

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        content: '',
        action: null,
        payment: null,
    });

    const formatDisplayDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    };

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

    const normalizeStatus = (status) => {
        if (!status) return 'Pending';
        
        const statusMap = {
            'paid': 'Paid',
            'pending': 'Pending',
            'failed': 'Failed',
            'refunded': 'Refunded',
        };
        
        return statusMap[status.toLowerCase()] || status;
    };

    const PaymentStatus = ({ status }) => {
        let color;
        const normalizedStatus = normalizeStatus(status);
        let title = normalizedStatus;

        switch (normalizedStatus) {
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
                        status: selectedStatus.toLowerCase(),
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
                    formattedDate: formatDisplayDate(payment.date || selectedDate),
                    status: normalizeStatus(payment.status || payment.paymentStatus || 'pending')
                }));
                
                const filteredPayments = paymentsWithMethods.filter(payment => 
                    payment.status.toLowerCase() === selectedStatus.toLowerCase()
                );
                
                setPayments(filteredPayments);
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
            setInitialLoading(false);
            setSearchLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchLoading(true);
        setPayments([]);
        fetchPayments();
    };

    const handleConfirmPayment = (payment) => {
        setConfirmDialog({
            open: true,
            title: 'Confirm Payment',
            content: `Are you sure you want to confirm this payment as ${payment.paymentMethod === 'Online' ? 'Online' : 'Offline'}?`,
            action: 'confirm-payment',
            payment: payment
        });
    };

    const confirmAction = async () => {
        const { payment } = confirmDialog;
        try {
            setConfirmLoading(true);
            
            const requestBody = {
                bookingId: payment.bookingId || payment.bookingID,
                paymentId: payment.paymentId || payment.id,
                action: "UpdatePayment",
                status: "Offline",
                date: formatAPIDate(payment.bookingDate || payment.date || ""),
                pharmacyNo: pharmacyNo
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
                throw new Error(data?.message || 'Failed to update payment');
            }

            await fetchPayments();

            setSnackbar({
                open: true,
                message: 'Payment confirmed successfully',
                severity: 'success'
            });

        } catch (error) {
            console.error('Update error:', error);
            setSnackbar({
                open: true,
                message: `Operation failed: ${error.message}`,
                severity: 'error'
            });
        } finally {
            setConfirmLoading(false);
            setConfirmDialog({ ...confirmDialog, open: false });
        }
    };
    
    useEffect(() => {
        fetchPayments();
    }, []);

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
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
                                    <MenuItem value="paid">Paid</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                disabled={searchLoading}
                                fullWidth
                            >
                                {searchLoading ? <CircularProgress size={24} /> : 'Search'}
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
                    {initialLoading ? (
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
                            onConfirmPayment={handleConfirmPayment}
                            PaymentStatus={PaymentStatus}
                        />
                    )}
                </MainCard>
            </Grid>

            <Dialog
                open={confirmDialog.open}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="confirm-dialog-title"
            >
                <DialogTitle id="confirm-dialog-title">{confirmDialog.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{confirmDialog.content}</DialogContentText>
                    {confirmDialog.payment && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2"><strong>Patient:</strong> {confirmDialog.payment.userName}</Typography>
                            <Typography variant="body2"><strong>Amount:</strong> £{confirmDialog.payment.paymentAmount}</Typography>
                            {confirmDialog.payment.bookingId && (
                                <Typography variant="body2"><strong>Booking ID:</strong> {confirmDialog.payment.bookingId}</Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} disabled={confirmLoading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmAction} 
                        color="primary" 
                        variant="contained"
                        disabled={confirmLoading}
                        startIcon={confirmLoading ? <CircularProgress size={20} /> : null}
                    >
                        {confirmLoading ? 'Processing...' : 'Confirm'}
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