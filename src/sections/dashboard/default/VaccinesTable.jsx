/* eslint-disable prettier/prettier */
import { useState } from 'react';
import PropTypes from 'prop-types';
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
import Tooltip from '@mui/material/Tooltip';

// project imports
import Dot from 'components/@extended/Dot';

const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Vaccine Name'
  },
  {
    id: 'category',
    align: 'left',
    disablePadding: false,
    label: 'Category'
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
  const handleEdit = (vaccine) => {
    if (onEdit) {
      onEdit(vaccine);
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
            {vaccines.map((vaccine, index) => (
              <TableRow
                hover
                role="checkbox"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                tabIndex={-1}
                key={vaccine.vaccineID || index}
              >
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {vaccine.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{vaccine.category || 'N/A'}</Typography>
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
                    <IconButton aria-label="edit" onClick={() => handleEdit(vaccine)} color="primary" sx={{ mx: 0.5 }}>
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
