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

function BookingStatus({ status }) {
  let color;
  let title = status;

  switch (status) {
    case 'Booked':
      color = 'primary';
      break;
    case 'Accepted':
      color = 'success';
      break;
    case 'Cancelled':
      color = 'error';
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
    id: 'vaccinesIDs',
    align: 'left',
    disablePadding: false,
    label: 'Vaccines'
  },
  {
    id: 'slot',
    align: 'left',
    disablePadding: false,
    label: 'Time Slot'
  },
  {
    id: 'paymentStatus',
    align: 'left',
    disablePadding: false,
    label: 'Payment Status'
  },
  {
    id: 'status',
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

export default function BookingTable({ bookings, onViewDetails, onApprove, onCancel }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [updatedBookings, setUpdatedBookings] = useState([]);

  const displayBookings = updatedBookings.length > 0 ? 
    bookings.map(booking => {
      const updated = updatedBookings.find(b => b.bookingId === booking.bookingId);
      return updated || booking;
    }) : 
    bookings;

  return (
    <Box>
      {error && (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
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
            {displayBookings && displayBookings.length > 0 ? (
              displayBookings
                .filter((booking) => booking.type && booking.type.trim().toLowerCase() === 'vaccination')
                .map((booking, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    tabIndex={-1}
                    key={booking.bookingId || index}
                  >
                    <TableCell>
                      <Typography variant="body2">{booking.name || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{booking.phoneNumber || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {booking.vaccinesIDs && typeof booking.vaccinesIDs === 'string' && 
                          JSON.parse(booking.vaccinesIDs).map((vaccine, i) => (
                            <Chip 
                              key={i} 
                              label={vaccine.vaccineName} 
                              size="small" 
                              sx={{ color: 'black', backgroundColor: 'transparent', border: 'none' }} 
                            />
                          ))
                        }
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.slot} {booking.meridiem}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <PaymentStatus status={booking.paymentStatus || 'Pending'} />
                    </TableCell>
                    <TableCell>
                      <BookingStatus status={booking.status || 'Booked'} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton 
                            aria-label="view" 
                            onClick={() => onViewDetails(booking)} 
                            color="primary" 
                            size="small"
                            disabled={isUpdating}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {booking.status !== 'Accepted' && booking.status !== 'Cancelled' && (
                          <Tooltip title="Accept Booking">
                            <IconButton 
                              aria-label="approve" 
                              onClick={() => onApprove(booking)} 
                              color="success" 
                              size="small"
                              disabled={isUpdating}
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {booking.status !== 'Cancelled' && (
                          <Tooltip title="Cancel Booking">
                            <IconButton 
                              aria-label="cancel" 
                              onClick={() => onCancel(booking)} 
                              color="error" 
                              size="small"
                              disabled={isUpdating}
                            >
                              <CancelIcon fontSize="small" />
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

BookingStatus.propTypes = {
  status: PropTypes.string
};

PaymentStatus.propTypes = {
  status: PropTypes.oneOf(['Paid', 'Pending', 'Failed', 'Refunded'])
};

BookingTable.propTypes = {
  bookings: PropTypes.array,
  onViewDetails: PropTypes.func,
  onApprove: PropTypes.func,
  onCancel: PropTypes.func
};



