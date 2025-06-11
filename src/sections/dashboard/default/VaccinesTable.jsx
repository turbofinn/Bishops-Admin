import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

// project imports
import Dot from 'components/@extended/Dot';

const FALLBACK_IMAGES = [
  '/assets/bv2.webp',
  '/assets/bv3.webp',
  '/assets/bv4.webp',
  '/assets/bv5.webp',
  '/assets/bv6.webp'
];

const headCells = [
  {
    id: 'image',
    align: 'left',
    disablePadding: false,
    label: 'Image'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Vaccine Name'
  },
  {
    id: 'compositions',
    align: 'left',
    disablePadding: false,
    label: 'Compositions'
  },
  {
    id: 'description',
    align: 'left',
    disablePadding: false,
    label: 'Description'
  },
  {
    id: 'price',
    align: 'right',
    disablePadding: false,
    label: 'Price'
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

function VaccineStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 'Available':
      color = 'success';
      title = 'Available';
      break;
    case 'Unavailable':
      color = 'error';
      title = 'Unavailable';
      break;
    default:
      color = 'primary';
      title = 'Unknown';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function VaccinesTable({ vaccines, onEdit, onStatusChange }) {
  const [imageErrorMap, setImageErrorMap] = useState({});

  const handleEdit = (vaccine) => {
    if (onEdit) {
      onEdit(vaccine);
    }
  };

  const handleImageError = (vaccineName, index) => {
    setImageErrorMap(prev => ({
      ...prev,
      [vaccineName]: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
    }));
  };

  const getImageSource = (vaccine, index) => {
    if (imageErrorMap[vaccine.name]) {
      return imageErrorMap[vaccine.name];
    }
    return vaccine.pictureUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
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
            {vaccines.map((vaccine, index) => (
              <TableRow
                hover
                role="checkbox"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                tabIndex={-1}
                key={vaccine.vaccineID || index}
              >
                <TableCell>
                  <Avatar
                    alt={vaccine.name}
                    src={vaccine.pictureUrl}
                    sx={{
                      width: 56,
                      height: 56,
                      border: '1px solid #f0f0f0',
                      backgroundColor: '#ffffff'
                    }}
                    variant="rounded"
                    imgProps={{
                      onError: () => handleImageError(vaccine.name, index)
                    }}
                  />

                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {vaccine.name}
                  </Typography>
                </TableCell>
                <TableCell>{vaccine.compositions}</TableCell>
                <TableCell sx={{ maxWidth: '300px' }}>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {vaccine.description}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    €{vaccine.price}
                  </Typography>
                </TableCell>
                <TableCell>
                  <VaccineStatus status={vaccine.status} />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit Vaccine">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(vaccine)}
                      color="primary"
                      sx={{ mx: 0.5 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={vaccine.status === 'Available' ? 'Set Unavailable' : 'Set Available'}>
                    <Switch
                      checked={vaccine.status === 'Available'}
                      onChange={() => onStatusChange(vaccine, vaccine.status === 'Available' ? 'Unavailable' : 'Available')}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

VaccineStatus.propTypes = {
  status: PropTypes.string
};

VaccinesTable.propTypes = {
  vaccines: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onStatusChange: PropTypes.func
};