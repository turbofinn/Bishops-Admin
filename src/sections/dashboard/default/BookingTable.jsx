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
function BookingStatus({ status }) {
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
    id: 'paymentMethod',
    align: 'left',
    disablePadding: false,
    label: 'Payment'
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
                <TableCell
                  key={headCell.id}
                  align={headCell.align}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking, index) => (
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
                    <Stack direction="row" spacing={1}>
                      {booking.vaccinesIDs?.split(',').map((vaccine, i) => (
                        <Chip 
                          key={i} 
                          label={vaccine.trim()} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.slot} {booking.meridiem}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={booking.paymentMethod || 'N/A'} 
                      color={booking.paymentMethod === 'CARD' ? 'success' : 'primary'} 
                      size="small" 
                    />
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
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {booking.status !== 'Approved' && booking.status !== 'Cancelled' && (
                        <Tooltip title="Approve Booking">
                          <IconButton 
                            aria-label="approve" 
                            onClick={() => onApprove(booking)}
                            color="success"
                            size="small"
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

BookingTable.propTypes = {
  bookings: PropTypes.array,
  onViewDetails: PropTypes.func,
  onApprove: PropTypes.func,
  onCancel: PropTypes.func
};