/*import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';

// project imports
import Dot from 'components/@extended/Dot';

// Status component for bookings
function PaymentStatus({ status }) {
  let color;
  let title = status;

  switch (status) {
    case 'Booked':
      color = 'primary';
      break;
    case 'Approved':
      color = 'success';
      break;
    case 'Cancelled':
      color = 'error';
      break;
    case 'Completed':
      color = 'info';
      break;
    default:
      color = 'warning';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// Table headers
const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Patient Name'
  },
  {
    id: 'phoneNumber',
    align: 'left',
    disablePadding: false,
    label: 'Phone Number'
  },
  {
    id: 'paymentAmount',
    align: 'left',
    disablePadding: false,
    label: 'Amount'
  },
  {
    id: 'paymentDate',
    align: 'left',
    disablePadding: false,
    label: 'Payment Date'
  },
  {
    id: 'paymentMethod',
    align: 'left',
    disablePadding: false,
    label: 'Payment Mode'
  },
  {
    id: 'paymentStatus',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'actions',
    align: 'center',
    disablePadding: false,
    label: 'Mark as Paid'
  }
];

export default function PaymentTable({ payments }) {
  console.log("booookkkk", payments)
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments
                .map((booking, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    tabIndex={-1}
                    key={booking.bookingId || index}
                  >
                    <TableCell>
                      <Typography variant="body2">{booking.userName || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{booking.mobileNo || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.slot} {booking.paymentAmount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.slot} {booking.paymentDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.paymentMethod || 'Offline'}
                        color={booking.paymentMethod === 'Online' ? 'success' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <PaymentStatus status={booking.paymentStatus || 'Unpaid'} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" justifyContent="center">


                        {booking.status !== 'Approved' && booking.status !== 'Cancelled' && (
                          <Tooltip title="Approve Booking">
                            <IconButton aria-label="approve" onClick={() => onApprove(booking)} color="success" size="small">
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}


                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2, color: 'text.secondary' }}>
                    No bookings found for the selected date.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
PaymentTable.propTypes = {
  status: PropTypes.string
};

PaymentTable.propTypes = {
  bookings: PropTypes.array,
  onViewDetails: PropTypes.func,
  onApprove: PropTypes.func,
  onCancel: PropTypes.func
};*/

/*import PropTypes from 'prop-types';

// material-ui imports
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';

// project imports
import Dot from 'components/@extended/Dot';

// Status component for payments
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

// Table headers
const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Patient Name'
  },
  {
    id: 'phoneNumber',
    align: 'left',
    disablePadding: false,
    label: 'Phone Number'
  },
  {
    id: 'paymentAmount',
    align: 'left',
    disablePadding: false,
    label: 'Amount'
  },
  {
    id: 'paymentDate',
    align: 'left',
    disablePadding: false,
    label: 'Payment Date'
  },
  {
    id: 'paymentMethod',
    align: 'left',
    disablePadding: false,
    label: 'Payment Mode'
  },
  {
    id: 'paymentStatus',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'actions',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

export default function PaymentTable({ payments, onViewDetails, onMarkAsPaid }) {
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={payment.id || index}
                >
                  <TableCell>
                    <Typography variant="body2">{payment.userName || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payment.mobileNo || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.paymentAmount || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.paymentDate || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.paymentMethod || 'Offline'}
                      color={
                        payment.paymentMethod === 'Online' ? 'success' : 
                        payment.paymentMethod === 'Credit Card' ? 'primary' : 
                        payment.paymentMethod === 'Debit Card' ? 'primary' : 
                        payment.paymentMethod === 'Cash' ? 'secondary' : 
                        payment.paymentMethod === 'Bank Transfer' ? 'info' : 
                        'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <PaymentStatus status={payment.paymentStatus || 'Pending'} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      {/*<Tooltip title="View Details">
                        <IconButton 
                          aria-label="view" 
                          onClick={() => onViewDetails(payment)} 
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {payment.paymentStatus !== 'Paid' && (
                        <Tooltip title="Mark as Paid">
                          <IconButton 
                            aria-label="mark-paid" 
                            onClick={() => onMarkAsPaid(payment)} 
                            color="success" 
                            size="small"
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2, color: 'text.secondary' }}>
                    No payment records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

PaymentTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      userName: PropTypes.string,
      mobileNo: PropTypes.string,
      paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paymentDate: PropTypes.string,
      paymentMethod: PropTypes.string,
      paymentStatus: PropTypes.string
    })
  ),
  onViewDetails: PropTypes.func.isRequired,
  onMarkAsPaid: PropTypes.func.isRequired
};

PaymentTable.defaultProps = {
  payments: []
};*/

/*import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui imports
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// project imports
import Dot from 'components/@extended/Dot';

// Status component for payments
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

// Table headers
const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Patient Name'
  },
  {
    id: 'phoneNumber',
    align: 'left',
    disablePadding: false,
    label: 'Phone Number'
  },
  {
    id: 'paymentAmount',
    align: 'left',
    disablePadding: false,
    label: 'Amount'
  },
  {
    id: 'paymentDate',
    align: 'left',
    disablePadding: false,
    label: 'Payment Date'
  },
  {
    id: 'paymentMethod',
    align: 'left',
    disablePadding: false,
    label: 'Payment Mode'
  },
  {
    id: 'paymentStatus',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'actions',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

export default function PaymentTable({ payments, onViewDetails, onMarkAsPaid }) {
  const [loading, setLoading] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenConfirmation = (payment) => {
    setCurrentPayment(payment);
    setConfirmOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmOpen(false);
    setCurrentPayment(null);
  };

  const handleOfflinePaymentConfirm = async () => {
    if (!currentPayment) return;

    try {
      setLoading(true);
      
      const paymentId = currentPayment.paymentId || currentPayment.id;
      const bookingId = currentPayment.bookingId || currentPayment.bookingID;
      
      if (!paymentId || !bookingId) {
        throw new Error('Missing payment ID or booking ID');
      }

      const response = await fetch(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
          },
          body: JSON.stringify({
            paymentId,
            bookingId,
            action: "UpdateBooking",
            status: "Offline",
            date: currentPayment.date || new Date().toISOString().split('T')[0]
          })
        }
      );

      const data = await response.json();

      if (data.responseStatus?.code === 1000) {
        setSnackbar({
          open: true,
          message: 'Payment marked as paid successfully',
          severity: 'success'
        });
        onMarkAsPaid(currentPayment);
      } else {
        throw new Error(data.responseStatus?.message || 'Failed to update payment');
      }
    } catch (err) {
      console.error('Error updating payment:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to mark payment as paid',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const renderPaymentMethod = (payment) => {
    if (payment.paymentMethod === 'Offline') {
      return (
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => handleOpenConfirmation(payment)}
          disabled={loading && currentPayment?.id === payment.id}
        >
          {loading && currentPayment?.id === payment.id ? (
            <CircularProgress size={20} />
          ) : (
            'Mark as Paid'
          )}
        </Button>
      );
    }
    
    return (
      <Chip
        label={payment.paymentMethod || 'Offline'}
        color={
          payment.paymentMethod === 'Online' ? 'success' : 
          payment.paymentMethod === 'Credit Card' ? 'primary' : 
          payment.paymentMethod === 'Debit Card' ? 'primary' : 
          payment.paymentMethod === 'Cash' ? 'secondary' : 
          payment.paymentMethod === 'Bank Transfer' ? 'info' : 
          'default'
        }
        size="small"
      />
    );
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={payment.id || index}
                >
                  <TableCell>
                    <Typography variant="body2">{payment.userName || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payment.mobileNo || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ₹{payment.paymentAmount || payment.amount || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.paymentDate || payment.date || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderPaymentMethod(payment)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatus status={payment.paymentStatus || payment.status || 'Pending'} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      {payment.paymentStatus !== 'Paid' && payment.paymentMethod !== 'Offline' && (
                        <Tooltip title="Mark as Paid">
                          <IconButton 
                            aria-label="mark-paid" 
                            onClick={() => onMarkAsPaid(payment)} 
                            color="success" 
                            size="small"
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2, color: 'text.secondary' }}>
                    No payment records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog 
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirmation}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to mark this payment as paid?
          </Typography>
          {currentPayment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2"><strong>Patient:</strong> {currentPayment.userName}</Typography>
              <Typography variant="body2"><strong>Amount:</strong> ₹{currentPayment.paymentAmount || currentPayment.amount}</Typography>
              {currentPayment.bookingId && (
                <Typography variant="body2"><strong>Booking ID:</strong> {currentPayment.bookingId}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleOfflinePaymentConfirm} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
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
    </Box>
  );
}

PaymentTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      paymentId: PropTypes.string,
      userName: PropTypes.string,
      mobileNo: PropTypes.string,
      paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paymentDate: PropTypes.string,
      date: PropTypes.string,
      paymentMethod: PropTypes.string,
      paymentStatus: PropTypes.string,
      status: PropTypes.string,
      bookingId: PropTypes.string,
      bookingID: PropTypes.string
    })
  ),
  onViewDetails: PropTypes.func,
  onMarkAsPaid: PropTypes.func.isRequired
};

PaymentTable.defaultProps = {
  payments: [],
  onViewDetails: () => {}
};*/

/*import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui imports
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// project imports
import Dot from 'components/@extended/Dot';

// Status component for payments
function PaymentStatus({ status }) {
  let color;
  let title = status;

  switch (status) {
    case 'Paid':
      color = 'success';
      title = 'Paid';
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

// Table headers
const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Patient Name'
  },
  {
    id: 'phoneNumber',
    align: 'left',
    disablePadding: false,
    label: 'Phone Number'
  },
  {
    id: 'paymentAmount',
    align: 'left',
    disablePadding: false,
    label: 'Amount'
  },
  {
    id: 'paymentDate',
    align: 'left',
    disablePadding: false,
    label: 'Payment Date'
  },
  {
    id: 'paymentMethod',
    align: 'left',
    disablePadding: false,
    label: 'Payment Mode'
  },
  {
    id: 'paymentStatus',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'actions',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

export default function PaymentTable({ payments, onViewDetails, onMarkAsPaid }) {
  const [loading, setLoading] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenConfirmation = (payment) => {
    setCurrentPayment(payment);
    setConfirmOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmOpen(false);
    setCurrentPayment(null);
  };

  /*const handleOfflinePaymentConfirm = async () => {
    if (!currentPayment) return;

    try {
      setLoading(true);
      
      const paymentId = currentPayment.paymentId || currentPayment.id;
      const bookingId = currentPayment.bookingId || currentPayment.bookingID;
      
      if (!paymentId || !bookingId) {
        throw new Error('Missing payment ID or booking ID');
      }

      const response = await fetch(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
          },
          body: JSON.stringify({
            paymentId,
            bookingId,
            action: "UpdateBooking",
            status: "Offline",
            date: currentPayment.date || new Date().toISOString().split('T')[0]
          })
        }
      );

      const data = await response.json();

      // Check for both possible success response formats
      if (data.response?.code === 1001 || data.responseStatus?.code === 1000) {
        setSnackbar({
          open: true,
          message: data.response?.message || data.responseStatus?.message || 'Payment marked as paid successfully',
          severity: 'success'
        });
        
        // Update the payment status to 'Paid'
        onMarkAsPaid({ 
          ...currentPayment, 
          paymentStatus: 'Paid', 
          status: 'Paid' 
        });
        
        setConfirmOpen(false);
        return;
      }

      throw new Error(data.response?.message || data.responseStatus?.message || 'Failed to update payment');
    } catch (err) {
      console.error('Error updating payment:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to mark payment as paid',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (payment) => {
    if (payment.paymentMethod === 'Offline') {
      // If payment is already paid, show a disabled "Paid" button
      if (payment.paymentStatus === 'Paid' || payment.status === 'Paid') {
        return (
          <Button 
            variant="contained" 
            size="small"
            disabled
            sx={{ 
              backgroundColor: '#4caf50', 
              color: 'white',
              '&:hover': {
                backgroundColor: '#4caf50'
              }
            }}
          >
            Paid
          </Button>
        );
      }
      */

      /*const handleOfflinePaymentConfirm = async () => {
    if (!currentPayment) return;

    try {
      setLoading(true);
      
      const paymentId = currentPayment.paymentId || currentPayment.id;
      const bookingId = currentPayment.bookingId || currentPayment.bookingID;
      
      if (!paymentId || !bookingId) {
        throw new Error('Missing payment ID or booking ID');
      }

      const response = await fetch(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
          },
          body: JSON.stringify({
            paymentId,
            bookingId,
            action: "UpdateBooking",
            status: "Offline",
            date: currentPayment.date || new Date().toISOString().split('T')[0]
          })
        }
      );

      const data = await response.json();

      if (data.response?.code === 1001 || data.responseStatus?.code === 1000) {
        setSnackbar({
          open: true,
          message: 'Payment successfully marked as paid',
          severity: 'success'
        });
        
        // Update the payment status locally
        const updatedPayment = {
          ...currentPayment,
          paymentStatus: 'Paid',
          status: 'Paid'
        };
        
        // Notify parent component
        onMarkAsPaid(updatedPayment);
        
        setConfirmOpen(false);
        return;
      }

      throw new Error(data.response?.message || data.responseStatus?.message || 'Payment update failed');
    } catch (err) {
      console.error('Error updating payment:', err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

   const renderPaymentMethod = (payment) => {
    if (payment.paymentMethod === 'Offline') {
      // Check if payment is already paid
      const isPaid = payment.paymentStatus === 'Paid' || payment.status === 'Paid';
      
      return (
        <Button 
          variant={isPaid ? "contained" : "outlined"}
          size="small"
          onClick={isPaid ? null : () => handleOpenConfirmation(payment)}
          disabled={loading && currentPayment?.id === payment.id}
          sx={isPaid ? { 
            backgroundColor: '#4caf50', 
            color: 'white',
            '&:hover': {
              backgroundColor: '#4caf50'
            }
          } : {}}
        >
          {loading && currentPayment?.id === payment.id ? (
            <CircularProgress size={20} />
          ) : isPaid ? (
            'Paid'
          ) : (
            'Mark as Paid'
          )}
        </Button>
      );
    }
    
    return (
      <Chip
        label={payment.paymentMethod || 'Offline'}
        color={
          payment.paymentMethod === 'Online' ? 'success' : 
          payment.paymentMethod === 'Credit Card' ? 'primary' : 
          payment.paymentMethod === 'Debit Card' ? 'primary' : 
          payment.paymentMethod === 'Cash' ? 'secondary' : 
          payment.paymentMethod === 'Bank Transfer' ? 'info' : 
          'default'
        }
        size="small"
      />
    );
  };

     
    
    return (
      <Chip
        label={payment.paymentMethod || 'Offline'}
        color={
          payment.paymentMethod === 'Online' ? 'success' : 
          payment.paymentMethod === 'Credit Card' ? 'primary' : 
          payment.paymentMethod === 'Debit Card' ? 'primary' : 
          payment.paymentMethod === 'Cash' ? 'secondary' : 
          payment.paymentMethod === 'Bank Transfer' ? 'info' : 
          'default'
        }
        size="small"
      />
    );
  };

  
    
  

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={payment.id || index}
                >
                  <TableCell>
                    <Typography variant="body2">{payment.userName || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payment.mobileNo || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ₹{payment.paymentAmount || payment.amount || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.paymentDate || payment.date || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderPaymentMethod(payment)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatus status={payment.paymentStatus || payment.status || 'Pending'} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      {payment.paymentStatus !== 'Paid' && payment.paymentMethod !== 'Offline' && (
                        <Tooltip title="Mark as Paid">
                          <IconButton 
                            aria-label="mark-paid" 
                            onClick={() => onMarkAsPaid(payment)} 
                            color="success" 
                            size="small"
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2, color: 'text.secondary' }}>
                    No payment records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog 
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirmation}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to mark this payment as paid?
          </Typography>
          {currentPayment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2"><strong>Patient:</strong> {currentPayment.userName}</Typography>
              <Typography variant="body2"><strong>Amount:</strong> ₹{currentPayment.paymentAmount || currentPayment.amount}</Typography>
              {currentPayment.bookingId && (
                <Typography variant="body2"><strong>Booking ID:</strong> {currentPayment.bookingId}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleOfflinePaymentConfirm} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
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
    </Box>
  );


PaymentTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      paymentId: PropTypes.string,
      userName: PropTypes.string,
      mobileNo: PropTypes.string,
      paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paymentDate: PropTypes.string,
      date: PropTypes.string,
      paymentMethod: PropTypes.string,
      paymentStatus: PropTypes.string,
      status: PropTypes.string,
      bookingId: PropTypes.string,
      bookingID: PropTypes.string
    })
  ),
  onViewDetails: PropTypes.func,
  onMarkAsPaid: PropTypes.func.isRequired
};

PaymentTable.defaultProps = {
  payments: [],
  onViewDetails: () => {}
};*/

/*import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui imports
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// project imports
import Dot from 'components/@extended/Dot';

// Status component for payments
function PaymentStatus({ status }) {
  let color;
  let title = status;

  switch (status) {
    case 'Paid':
      color = 'success';
      title = 'Paid';
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

// Table headers
const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Patient Name'
  },
  {
    id: 'phoneNumber',
    align: 'left',
    disablePadding: false,
    label: 'Phone Number'
  },
  {
    id: 'paymentAmount',
    align: 'left',
    disablePadding: false,
    label: 'Amount'
  },
  {
    id: 'paymentDate',
    align: 'left',
    disablePadding: false,
    label: 'Payment Date'
  },
  {
    id: 'paymentMethod',
    align: 'left',
    disablePadding: false,
    label: 'Payment Mode'
  },
  {
    id: 'paymentStatus',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'actions',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

export default function PaymentTable({ payments, onViewDetails, onMarkAsPaid }) {
  const [loading, setLoading] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenConfirmation = (payment) => {
    setCurrentPayment(payment);
    setConfirmOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmOpen(false);
    setCurrentPayment(null);
  };

  const handleOfflinePaymentConfirm = async () => {
    if (!currentPayment) return;

    try {
      setLoading(true);
      
      const paymentId = currentPayment.paymentId || currentPayment.id;
      const bookingId = currentPayment.bookingId || currentPayment.bookingID;
      
      if (!paymentId || !bookingId) {
        throw new Error('Missing payment ID or booking ID');
      }

      const response = await fetch(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
          },
          body: JSON.stringify({
            paymentId,
            bookingId,
            action: "UpdateBooking",
            status: "Offline",
            date: currentPayment.date || new Date().toISOString().split('T')[0]
          })
        }
      );

      const data = await response.json();

      if (data.response?.code === 1001 || data.responseStatus?.code === 1000) {
        setSnackbar({
          open: true,
          message: 'Payment successfully marked as paid',
          severity: 'success'
        });
        
        const updatedPayment = {
          ...currentPayment,
          paymentStatus: 'Paid',
          status: 'Paid'
        };
        
        onMarkAsPaid(updatedPayment);
        setConfirmOpen(false);
        return;
      }

      throw new Error(data.response?.message || data.responseStatus?.message || 'Payment update failed');
    } catch (err) {
      console.error('Error updating payment:', err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (payment) => {
    if (payment.paymentMethod === 'Offline') {
      const isPaid = payment.paymentStatus === 'Paid' || payment.status === 'Paid';
      
      return (
        <Button 
          variant={isPaid ? "contained" : "outlined"}
          size="small"
          onClick={isPaid ? null : () => handleOpenConfirmation(payment)}
          disabled={loading && currentPayment?.id === payment.id}
          sx={isPaid ? { 
            backgroundColor: '#4caf50', 
            color: 'white',
            '&:hover': {
              backgroundColor: '#4caf50'
            }
          } : {}}
        >
          {loading && currentPayment?.id === payment.id ? (
            <CircularProgress size={20} />
          ) : isPaid ? (
            'Paid'
          ) : (
            'Mark as Paid'
          )}
        </Button>
      );
    }
    
    return (
      <Chip
        label={payment.paymentMethod || 'Offline'}
        color={
          payment.paymentMethod === 'Online' ? 'success' : 
          payment.paymentMethod === 'Credit Card' ? 'primary' : 
          payment.paymentMethod === 'Debit Card' ? 'primary' : 
          payment.paymentMethod === 'Cash' ? 'secondary' : 
          payment.paymentMethod === 'Bank Transfer' ? 'info' : 
          'default'
        }
        size="small"
      />
    );
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={payment.id || index}
                >
                  <TableCell>
                    <Typography variant="body2">{payment.userName || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payment.mobileNo || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ₹{payment.paymentAmount || payment.amount || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.paymentDate || payment.date || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderPaymentMethod(payment)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatus status={payment.paymentStatus || payment.status || 'Pending'} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      {payment.paymentStatus !== 'Paid' && payment.paymentMethod !== 'Offline' && (
                        <Tooltip title="Mark as Paid">
                          <IconButton 
                            aria-label="mark-paid" 
                            onClick={() => onMarkAsPaid(payment)} 
                            color="success" 
                            size="small"
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2, color: 'text.secondary' }}>
                    No payment records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirmation}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to mark this payment as paid?
          </Typography>
          {currentPayment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2"><strong>Patient:</strong> {currentPayment.userName}</Typography>
              <Typography variant="body2"><strong>Amount:</strong> ₹{currentPayment.paymentAmount || currentPayment.amount}</Typography>
              {currentPayment.bookingId && (
                <Typography variant="body2"><strong>Booking ID:</strong> {currentPayment.bookingId}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleOfflinePaymentConfirm} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
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
    </Box>
  );
}

PaymentTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      paymentId: PropTypes.string,
      userName: PropTypes.string,
      mobileNo: PropTypes.string,
      paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paymentDate: PropTypes.string,
      date: PropTypes.string,
      paymentMethod: PropTypes.string,
      paymentStatus: PropTypes.string,
      status: PropTypes.string,
      bookingId: PropTypes.string,
      bookingID: PropTypes.string
    })
  ),
  onViewDetails: PropTypes.func,
  onMarkAsPaid: PropTypes.func.isRequired
};

PaymentTable.defaultProps = {
  payments: [],
  onViewDetails: () => {}
};*/

/*import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui imports
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// project imports
import Dot from 'components/@extended/Dot';

// Status component for payments
function PaymentStatus({ status }) {
  let color;
  let title = status;

  switch (status) {
    case 'Paid':
      color = 'success';
      title = 'Paid';
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

// Table headers
const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Patient Name'
  },
  {
    id: 'phoneNumber',
    align: 'left',
    disablePadding: false,
    label: 'Phone Number'
  },
  {
    id: 'paymentAmount',
    align: 'left',
    disablePadding: false,
    label: 'Amount'
  },
  {
    id: 'paymentDate',
    align: 'left',
    disablePadding: false,
    label: 'Payment Date'
  },
  {
    id: 'paymentMethod',
    align: 'left',
    disablePadding: false,
    label: 'Payment Mode'
  },
  {
    id: 'paymentStatus',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'actions',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

export default function PaymentTable({ payments, onViewDetails, onMarkAsPaid }) {
  const [loading, setLoading] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenConfirmation = (payment) => {
    setCurrentPayment(payment);
    setConfirmOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmOpen(false);
    setCurrentPayment(null);
  };

  const handleConfirmPayment = async () => {
    if (!currentPayment) return;

    try {
      setLoading(true);
      
      const paymentId = currentPayment.paymentId || currentPayment.id;
      const bookingId = currentPayment.bookingId || currentPayment.bookingID;
      
      if (!paymentId || !bookingId) {
        throw new Error('Missing payment ID or booking ID');
      }

      const response = await fetch(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
          },
          body: JSON.stringify({
            paymentId,
            bookingId,
            action: "UpdateBooking",
            status: currentPayment.paymentMethod === 'Online' ? 'Online' : 'Offline',
            date: currentPayment.date || new Date().toISOString().split('T')[0]
          })
        }
      );

      const data = await response.json();

      if (data.response?.code === 1001 || data.responseStatus?.code === 1000) {
        setSnackbar({
          open: true,
          message: `Payment successfully confirmed as ${currentPayment.paymentMethod === 'Online' ? 'Online' : 'Offline'}`,
          severity: 'success'
        });
        
        const updatedPayment = {
          ...currentPayment,
          paymentStatus: 'Paid',
          status: 'Paid'
        };
        
        onMarkAsPaid(updatedPayment);
        setConfirmOpen(false);
        return;
      }

      throw new Error(data.response?.message || data.responseStatus?.message || 'Payment update failed');
    } catch (err) {
      console.error('Error updating payment:', err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (payment) => {
    const isPaid = payment.paymentStatus === 'Paid' || payment.status === 'Paid';
    
    return (
      <Chip
        label={payment.paymentMethod || 'Offline'}
        color={
          payment.paymentMethod === 'Online' ? 'success' : 
          payment.paymentMethod === 'Credit Card' ? 'primary' : 
          payment.paymentMethod === 'Debit Card' ? 'primary' : 
          payment.paymentMethod === 'Cash' ? 'secondary' : 
          payment.paymentMethod === 'Bank Transfer' ? 'info' : 
          'default'
        }
        size="small"
      />
    );
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={payment.id || index}
                >
                  <TableCell>
                    <Typography variant="body2">{payment.userName || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payment.mobileNo || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ₹{payment.paymentAmount || payment.amount || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.paymentDate || payment.date || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderPaymentMethod(payment)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatus status={payment.paymentStatus || payment.status || 'Pending'} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      {(payment.paymentStatus !== 'Paid' && payment.status !== 'Paid') && (
                        <Tooltip title={`Confirm as ${payment.paymentMethod === 'Online' ? 'Online' : 'Offline'}`}>
                          <IconButton 
                            aria-label="confirm-payment" 
                            onClick={() => handleOpenConfirmation(payment)} 
                            color="success" 
                            size="small"
                            disabled={loading && currentPayment?.id === payment.id}
                          >
                            {loading && currentPayment?.id === payment.id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CheckCircleOutlineIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2, color: 'text.secondary' }}>
                    No payment records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirmation}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to confirm this payment as {currentPayment?.paymentMethod === 'Online' ? 'Online' : 'Offline'}?
          </Typography>
          {currentPayment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2"><strong>Patient:</strong> {currentPayment.userName}</Typography>
              <Typography variant="body2"><strong>Amount:</strong> ₹{currentPayment.paymentAmount || currentPayment.amount}</Typography>
              {currentPayment.bookingId && (
                <Typography variant="body2"><strong>Booking ID:</strong> {currentPayment.bookingId}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmPayment} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Confirm as {currentPayment?.paymentMethod === 'Online' ? 'Online' : 'Offline'}
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
    </Box>
  );
}

PaymentTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      paymentId: PropTypes.string,
      userName: PropTypes.string,
      mobileNo: PropTypes.string,
      paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paymentDate: PropTypes.string,
      date: PropTypes.string,
      paymentMethod: PropTypes.string,
      paymentStatus: PropTypes.string,
      status: PropTypes.string,
      bookingId: PropTypes.string,
      bookingID: PropTypes.string
    })
  ),
  onViewDetails: PropTypes.func,
  onMarkAsPaid: PropTypes.func.isRequired
};

PaymentTable.defaultProps = {
  payments: [],
  onViewDetails: () => {}
};*/

import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui imports
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// project imports
import Dot from 'components/@extended/Dot';

// Status component for payments
function PaymentStatus({ status }) {
  let color;
  let title = status;

  switch (status) {
    case 'Paid':
      color = 'success';
      title = 'Paid';
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

// Table headers
const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Patient Name'
  },
  {
    id: 'phoneNumber',
    align: 'left',
    disablePadding: false,
    label: 'Phone Number'
  },
  {
    id: 'paymentAmount',
    align: 'left',
    disablePadding: false,
    label: 'Amount'
  },
  {
    id: 'paymentDate',
    align: 'left',
    disablePadding: false,
    label: 'Payment Date'
  },
  {
    id: 'paymentMethod',
    align: 'left',
    disablePadding: false,
    label: 'Payment Mode'
  },
  {
    id: 'paymentStatus',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'actions',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

export default function PaymentTable({ payments, onViewDetails, onMarkAsPaid }) {
  const [loading, setLoading] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenConfirmation = (payment) => {
    setCurrentPayment(payment);
    setConfirmOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmOpen(false);
    setCurrentPayment(null);
  };

  const handleConfirmPayment = async () => {
    if (!currentPayment) return;

    try {
      setLoading(true);
      
      const paymentId = currentPayment.paymentId || currentPayment.id;
      const bookingId = currentPayment.bookingId || currentPayment.bookingID;
      
      if (!paymentId || !bookingId) {
        throw new Error('Missing payment ID or booking ID');
      }

      const response = await fetch(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bishops-token')}` 
          },
          body: JSON.stringify({
            paymentId,
            bookingId,
            action: "UpdateBooking",
            status: currentPayment.paymentMethod === 'Online' ? 'Online' : 'Offline',
            date: currentPayment.date || new Date().toISOString().split('T')[0]
          })
        }
      );

      const data = await response.json();

      if (data.response?.code === 1001 || data.responseStatus?.code === 1000) {
        setSnackbar({
          open: true,
          message: `Payment successfully confirmed as ${currentPayment.paymentMethod === 'Online' ? 'Online' : 'Offline'}`,
          severity: 'success'
        });
        
        const updatedPayment = {
          ...currentPayment,
          paymentStatus: 'Paid',
          status: 'Paid'
        };
        
        onMarkAsPaid(updatedPayment);
        setConfirmOpen(false);
        return;
      }

      throw new Error(data.response?.message || data.responseStatus?.message || 'Payment update failed');
    } catch (err) {
      console.error('Error updating payment:', err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (payment) => {
    const isPaid = payment.paymentStatus === 'Paid' || payment.status === 'Paid';
    
    return (
      <Chip
        label={payment.paymentMethod || 'Offline'}
        color={
          payment.paymentMethod === 'Online' ? 'success' : 
          payment.paymentMethod === 'Credit Card' ? 'primary' : 
          payment.paymentMethod === 'Debit Card' ? 'primary' : 
          payment.paymentMethod === 'Cash' ? 'secondary' : 
          payment.paymentMethod === 'Bank Transfer' ? 'info' : 
          'default'
        }
        size="small"
      />
    );
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={payment.id || index}
                >
                  <TableCell>
                    <Typography variant="body2">{payment.userName || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payment.mobileNo || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ₹{payment.paymentAmount || payment.amount || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.paymentDate || payment.date || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderPaymentMethod(payment)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatus status={payment.paymentStatus || payment.status || 'Pending'} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      {(payment.paymentStatus !== 'Paid' && payment.status !== 'Paid') && (
                        <Tooltip title={`Confirm as ${payment.paymentMethod === 'Online' ? 'Online' : 'Offline'}`}>
                          <IconButton 
                            aria-label="confirm-payment" 
                            onClick={() => handleOpenConfirmation(payment)} 
                            color="success" 
                            size="small"
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2, color: 'text.secondary' }}>
                    No payment records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirmation}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to confirm this payment as {currentPayment?.paymentMethod === 'Online' ? 'Online' : 'Offline'}?
          </Typography>
          {currentPayment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2"><strong>Patient:</strong> {currentPayment.userName}</Typography>
              <Typography variant="body2"><strong>Amount:</strong> ₹{currentPayment.paymentAmount || currentPayment.amount}</Typography>
              {currentPayment.bookingId && (
                <Typography variant="body2"><strong>Booking ID:</strong> {currentPayment.bookingId}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmPayment} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processing...' : `Confirm as ${currentPayment?.paymentMethod === 'Online' ? 'Online' : 'Offline'}`}
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
    </Box>
  );
}

PaymentTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      paymentId: PropTypes.string,
      userName: PropTypes.string,
      mobileNo: PropTypes.string,
      paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paymentDate: PropTypes.string,
      date: PropTypes.string,
      paymentMethod: PropTypes.string,
      paymentStatus: PropTypes.string,
      status: PropTypes.string,
      bookingId: PropTypes.string,
      bookingID: PropTypes.string
    })
  ),
  onViewDetails: PropTypes.func,
  onMarkAsPaid: PropTypes.func.isRequired
};

PaymentTable.defaultProps = {
  payments: [],
  onViewDetails: () => {}
};