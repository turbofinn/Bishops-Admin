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
    id: 'consultationType',
    align: 'left',
    disablePadding: false,
    label: 'Consultation Type'
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

export default function AppointmentTable({ bookings, onViewDetails, onApprove, onCancel }) {
  // Filter to show only consultation appointments
  const consultationBookings = bookings.filter(booking => 
    booking.type === 'consultation' || booking.type === 'Consultation'
  );

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
            {consultationBookings && consultationBookings.length > 0 ? (
              consultationBookings.map((booking, index) => (
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
                    <Chip 
                      label={booking.consultationType || 'General Consultation'} 
                      color="secondary"
                      size="small"
                    />
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
                        <IconButton aria-label="view" onClick={() => onViewDetails(booking)} color="primary" size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {booking.status !== 'Approved' && booking.status !== 'Cancelled' && (
                        <Tooltip title="Approve Booking">
                          <IconButton aria-label="approve" onClick={() => onApprove(booking)} color="success" size="small">
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {booking.status !== 'Cancelled' && (
                        <Tooltip title="Cancel Booking">
                          <IconButton aria-label="cancel" onClick={() => onCancel(booking)} color="error" size="small">
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
                    No consultation bookings found for the selected date.
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

AppointmentTable.propTypes = {
  bookings: PropTypes.array,
  onViewDetails: PropTypes.func,
  onApprove: PropTypes.func,
  onCancel: PropTypes.func
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

// Payment Status component - Updated
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

// Consultation Type component
function ConsultationType({ type }) {
  let displayType;
  let color = 'secondary';
  
  const lowerType = type?.toLowerCase();
  
  if (lowerType?.includes('travel') || lowerType === 'travel clinic') {
    displayType = 'Travel Clinic';
    color = 'primary';
  } else if (lowerType?.includes('ear') || lowerType === 'ear microsuction') {
    displayType = 'Ear Microsuction';
    color = 'info';
  } else if (lowerType?.includes('weight') || lowerType === 'weight loss') {
    displayType = 'Weight Loss';
    color = 'success';
  } else {
    displayType = 'General Consultation';
    color = 'secondary';
  }

  return (
    <Chip 
      label={displayType} 
      color={color}
      size="small"
    />
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
    id: 'consultationType',
    align: 'left',
    disablePadding: false,
    label: 'Consultation Type'
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

export default function AppointmentTable({ bookings, onViewDetails, onApprove, onCancel }) {
  const consultationBookings = bookings.filter(booking => 
    booking.type && (booking.type.toLowerCase() === 'consultation' || 
                    booking.type.toLowerCase() === 'travel clinic' ||
                    booking.type.toLowerCase() === 'ear microsuction' ||
                    booking.type.toLowerCase() === 'weight loss')
  );

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
            {consultationBookings && consultationBookings.length > 0 ? (
              consultationBookings.map((booking, index) => (
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
                    <ConsultationType type={booking.consultationType || booking.type} />
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
                        <IconButton aria-label="view" onClick={() => onViewDetails(booking)} color="primary" size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {booking.status !== 'Approved' && booking.status !== 'Cancelled' && (
                        <Tooltip title="Approve Booking">
                          <IconButton aria-label="approve" onClick={() => onApprove(booking)} color="success" size="small">
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {booking.status !== 'Cancelled' && (
                        <Tooltip title="Cancel Booking">
                          <IconButton aria-label="cancel" onClick={() => onCancel(booking)} color="error" size="small">
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
                    No consultation bookings found for the selected date.
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

ConsultationType.propTypes = {
  type: PropTypes.string
};

AppointmentTable.propTypes = {
  bookings: PropTypes.array,
  onViewDetails: PropTypes.func,
  onApprove: PropTypes.func,
  onCancel: PropTypes.func
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

// Payment Status component - Updated
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

// Consultation Type component
function ConsultationType({ type }) {
  let displayType;
  let color = 'secondary';
  
  const lowerType = type?.toLowerCase();
  
  if (lowerType?.includes('travel') || lowerType === 'travel clinic') {
    displayType = 'Travel Clinic';
    color = 'primary';
  } else if (lowerType?.includes('ear') || lowerType === 'ear microsuction') {
    displayType = 'Ear Microsuction';
    color = 'info';
  } else if (lowerType?.includes('weight') || lowerType === 'weight loss') {
    displayType = 'Weight Loss';
    color = 'success';
  } else {
    displayType = 'General Consultation';
    color = 'secondary';
  }

  return (
    <Chip 
      label={displayType} 
      color={color}
      size="small"
    />
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
    id: 'consultationType',
    align: 'left',
    disablePadding: false,
    label: 'Consultation Type'
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

export default function AppointmentTable({ bookings, onViewDetails, onApprove, onCancel }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const consultationBookings = bookings.filter(booking => 
    booking.type && (booking.type.toLowerCase() === 'consultation' || 
                    booking.type.toLowerCase() === 'travel clinic' ||
                    booking.type.toLowerCase() === 'ear microsuction' ||
                    booking.type.toLowerCase() === 'weight loss')
  );

  const handleApprove = async (booking) => {
    setIsUpdating(true);
    try {
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: booking.paymentId || 'N/A',
          bookingId: booking.bookingId,
          action: 'UpdateBooking',
          status: 'Accept',
          date: booking.date // Make sure your booking object has a date field
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      const data = await response.json();
      console.log('Booking approved successfully:', data);
      
      // Call the onApprove prop if it exists to update the UI
      if (onApprove) {
        onApprove(booking);
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async (booking) => {
    setIsUpdating(true);
    try {
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/update-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: booking.paymentId || 'N/A',
          bookingId: booking.bookingId,
          action: 'UpdateBooking',
          status: 'Cancel',
          date: booking.date // Make sure your booking object has a date field
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      const data = await response.json();
      console.log('Booking cancelled successfully:', data);
      
      // Call the onCancel prop if it exists to update the UI
      if (onCancel) {
        onCancel(booking);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsUpdating(false);
    }
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
            {consultationBookings && consultationBookings.length > 0 ? (
              consultationBookings.map((booking, index) => (
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
                    <ConsultationType type={booking.consultationType || booking.type} />
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

                      {booking.status !== 'Approved' && booking.status !== 'Cancelled' && (
                        <Tooltip title="Approve Booking">
                          <IconButton 
                            aria-label="approve" 
                            onClick={() => handleApprove(booking)} 
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
                            onClick={() => handleCancel(booking)} 
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
                    No consultation bookings found for the selected date.
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

ConsultationType.propTypes = {
  type: PropTypes.string
};

AppointmentTable.propTypes = {
  bookings: PropTypes.array,
  onViewDetails: PropTypes.func,
  onApprove: PropTypes.func,
  onCancel: PropTypes.func
};*/


import PropTypes from 'prop-types';
import { useState } from 'react';
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dot from 'components/@extended/Dot';

function BookingStatus({ status }) {
  let color;
  let title = status;

  switch (status) {
    case 'Booked': color = 'primary'; break;
    case 'Accepted': color = 'success'; break;
    case 'Cancelled': color = 'error'; break;
    case 'Completed': color = 'info'; break;
    default: color = 'warning';
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

function ConsultationType({ type }) {
  let displayType;
  let color = 'secondary';
  
  const lowerType = type?.toLowerCase();
  
  if (lowerType?.includes('travel') || lowerType === 'travel clinic') {
    displayType = 'Travel Clinic';
    color = 'primary';
  } else if (lowerType?.includes('ear') || lowerType === 'ear microsuction') {
    displayType = 'Ear Microsuction';
    color = 'info';
  } else if (lowerType?.includes('weight') || lowerType === 'weight loss') {
    displayType = 'Weight Loss';
    color = 'success';
  } else {
    displayType = 'General Consultation';
    color = 'secondary';
  }

  return (
    <Chip 
      label={displayType} 
      color={color}
      size="small"
    />
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
    id: 'consultationType',
    align: 'left',
    disablePadding: false,
    label: 'Consultation Type'
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

export default function AppointmentTable({ bookings, onViewDetails, onApprove, onCancel }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const consultationBookings = bookings.filter(booking => 
    booking.type && (booking.type.toLowerCase() === 'consultation' || 
                    booking.type.toLowerCase() === 'travel clinic' ||
                    booking.type.toLowerCase() === 'ear microsuction' ||
                    booking.type.toLowerCase() === 'weight loss')
  );

  const handleApprove = async (booking) => {
    setIsUpdating(true);
    try {
      if (onApprove) {
        await onApprove(booking);
      }
    } catch (error) {
      console.error('Error approving booking:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async (booking) => {
    setIsUpdating(true);
    try {
      if (onCancel) {
        await onCancel(booking);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsUpdating(false);
    }
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
            {consultationBookings.length > 0 ? (
              consultationBookings.map((booking, index) => (
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
                    <ConsultationType type={booking.consultationType || booking.type} />
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
                          onClick={() => onViewDetails(booking)} 
                          color="primary" 
                          size="small"
                          disabled={isUpdating}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {booking.status !== 'Accepted' && booking.status !== 'Cancelled' && (
                        <Tooltip title="Approve Booking">
                          <IconButton 
                            onClick={() => handleApprove(booking)} 
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
                            onClick={() => handleCancel(booking)} 
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
                    No consultation bookings found
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

ConsultationType.propTypes = {
  type: PropTypes.string
};

AppointmentTable.propTypes = {
  bookings: PropTypes.array,
  onViewDetails: PropTypes.func,
  onApprove: PropTypes.func,
  onCancel: PropTypes.func
};