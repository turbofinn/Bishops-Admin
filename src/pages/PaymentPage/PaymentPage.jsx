/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// project imports
import MainCard from 'components/MainCard';
import PaymentTable from '../../sections/dashboard/default/PaymentTable';

export default function PaymentPage() {
    const [payments, setpayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const [consultantID, setConsultantID] = useState('');
    const [pharmacyNo, setPharmacyNo] = useState('PN1853278176');
    const [mobileNo, setMobileNo] = useState('');

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const formattedDate = formatDate(selectedDate);

            const payload = {
                date: formattedDate,
                ...(selectedStatus && { status: selectedStatus }),
                ...(consultantID && { consultantID }),
                ...(mobileNo && { mobileNo }),
                pharmacyNo
            };

            const token = localStorage.getItem('bishops-token');
            const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-payment-by-date', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data && Array.isArray(data.payments)) {
                // Filter by mobile number if provided (client-side filtering)
                let filteredPayments = data.payments;
                if (mobileNo) {
                    filteredPayments = data.payments.filter(payment => 
                        payment.mobileNo && payment.mobileNo.includes(mobileNo)
                    );
                }
                
                setpayments(filteredPayments);
                
                if (mobileNo) {
                    setSnackbar({
                        open: true,
                        message: `Found ${filteredPayments.length} payment(s) for mobile number ${mobileNo}`,
                        severity: filteredPayments.length > 0 ? 'success' : 'info'
                    });
                }
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

    useEffect(() => {
        fetchPayments();
    }, []);

   
    useEffect(() => {
        const handleHeaderSearch = (event) => {
            const { mobileNo: searchMobileNo } = event.detail;
            setMobileNo(searchMobileNo);
        };

        window.addEventListener('headerSearch', handleHeaderSearch);

        return () => {
            window.removeEventListener('headerSearch', handleHeaderSearch);
        };
    }, []);

    useEffect(() => {
        if (mobileNo) {
            fetchPayments();
        }
    }, [mobileNo]);

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <MainCard>
                    <Grid container spacing={2} alignItems="center">
                        {mobileNo && (
                            <Grid item xs={12}>
                                <Alert
                                    severity="info"
                                    onClose={() => {
                                        setMobileNo('');
                                        fetchPayments();
                                    }}
                                >
                                    Showing results for mobile number: <strong>{mobileNo}</strong>
                                </Alert>
                            </Grid>
                        )}
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Booking Date"
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
                            <Button variant="contained" onClick={fetchPayments} disabled={loading} fullWidth>
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
                        <PaymentTable payments={payments} />
                    )}
                </MainCard>
            </Grid>

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
