import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

export default function VaccineFormDialog({ open, onClose, onSave, vaccine }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    category: 'Travel vaccines',
    status: 'Available'
  });
  const [errors, setErrors] = useState({});
  const [originalName, setOriginalName] = useState('');

  useEffect(() => {
    if (open) {
      if (vaccine) {
        setOriginalName(vaccine.name || '');
        setFormData({
          id: vaccine.vaccineID || '',
          name: vaccine.name || '',
          price: vaccine.price || '',
          category: vaccine.category || 'Travel vaccines',
          status: vaccine.status || 'Available'
        });
      } else {
        setOriginalName('');
        setFormData({
          id: '',
          name: '',
          price: '',
          category: 'Travel vaccines',
          status: 'Available'
        });
      }
      setErrors({});
    }
  }, [open, vaccine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.price === '' || isNaN(parseFloat(formData.price))) newErrors.price = 'Valid price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const dialogTitle = formData.id ? 'Edit Vaccine' : 'Add New Vaccine';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minWidth: 400
        }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {dialogTitle}
        <IconButton aria-label="close" onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 1, px: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {originalName && (
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Original Name: {originalName}
              </Typography>
            )}

            <TextField
              name="name"
              label="Vaccine Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />

            <TextField
              name="price"
              label="Price"
              fullWidth
              margin="normal"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>
              }}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value="Travel vaccines">Travel vaccines</MenuItem>
                <MenuItem value="Weightloss service">Weightloss service</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select labelId="status-label" id="status" name="status" value={formData.status} label="Status" onChange={handleChange}>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Unavailable">Unavailable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {formData.id ? 'Update Vaccine' : 'Add Vaccine'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

VaccineFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  vaccine: PropTypes.object
};
