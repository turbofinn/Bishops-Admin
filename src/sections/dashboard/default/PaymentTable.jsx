import PropTypes from 'prop-types';
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
};
