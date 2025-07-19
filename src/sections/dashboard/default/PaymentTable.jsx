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
import Alert from '@mui/material/Alert';

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// project imports
import Dot from 'components/@extended/Dot';

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

export default function PaymentTable({ payments, onConfirmPayment, PaymentStatus }) {
  const [error, setError] = useState(null);

  const renderPaymentMethod = (payment) => {
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

  const handleConfirm = (payment) => {
    onConfirmPayment(payment);
  };

  const getPatientName = (payment) => {
    return (
      payment.user?.name || 
      payment.user?.fullName ||
      payment.userName || 
      payment.patient?.name ||
      payment.patientName || 
      payment.name || 
      'N/A'
    );
  };

  const getPhoneNumber = (payment) => {
    return (
      payment.user?.phoneNumber ||
      payment.user?.mobileNo ||
      payment.user?.phone ||
      payment.mobileNo || 
      payment.phoneNumber || 
      payment.phone || 
      'N/A'
    );
  };

  const getPaymentAmount = (payment) => {
    return payment.paymentAmount || payment.amount || payment.totalAmount || 'N/A';
  };

  const getPaymentDate = (payment) => {
    return payment.paymentDate || payment.date || payment.createdAt || 'N/A';
  };

  const getPaymentStatus = (payment) => {
    return payment.paymentStatus || payment.status || 'Pending';
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

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
                  key={payment.id || payment._id || index}
                >
                  <TableCell>
                    <Typography variant="body2">{getPatientName(payment)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{getPhoneNumber(payment)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      £{getPaymentAmount(payment)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getPaymentDate(payment)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderPaymentMethod(payment)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatus status={getPaymentStatus(payment)} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      {getPaymentStatus(payment).toLowerCase() !== 'paid' && (
                        <Tooltip title="Confirm Payment">
                          <IconButton 
                            aria-label="confirm-payment" 
                            onClick={() => handleConfirm(payment)} 
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
      _id: PropTypes.string,
      paymentId: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
        fullName: PropTypes.string,
        phoneNumber: PropTypes.string,
        mobileNo: PropTypes.string,
        phone: PropTypes.string
      }),
      patient: PropTypes.shape({
        name: PropTypes.string
      }),
      userName: PropTypes.string,
      patientName: PropTypes.string,
      name: PropTypes.string,
      mobileNo: PropTypes.string,
      phoneNumber: PropTypes.string,
      phone: PropTypes.string,
      paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paymentDate: PropTypes.string,
      date: PropTypes.string,
      createdAt: PropTypes.string,
      paymentMethod: PropTypes.string,
      paymentStatus: PropTypes.string,
      status: PropTypes.string
    })
  ),
  onConfirmPayment: PropTypes.func.isRequired,
  PaymentStatus: PropTypes.func.isRequired
};

PaymentTable.defaultProps = {
  payments: []
};