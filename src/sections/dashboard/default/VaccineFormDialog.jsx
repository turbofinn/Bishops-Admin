import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const FALLBACK_IMAGES = [
  '/src/assets/vaccines/bv2.webp',
  '/src/assets/vaccines/bv3.webp',
  '/src/assets/vaccines/bv4.webp',
  '/src/assets/vaccines/bv5.webp',
  '/src/assets/vaccines/bv6.webp'
];

export default function VaccineFormDialog({ open, onClose, onSave, vaccine }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    compositions: '',
    description: '',
    price: '',
    pictureUrl: FALLBACK_IMAGES[0],
    status: 'Available'
  });
  const [errors, setErrors] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [originalName, setOriginalName] = useState(''); // Track original name for reference
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (vaccine) {
        // Store original values when editing
        setOriginalName(vaccine.name || '');
        
        setFormData({
          id: vaccine.vaccineID || '',
          name: vaccine.name || '',
          compositions: vaccine.compositions || '',
          description: vaccine.description || '',
          price: vaccine.price || '',
          pictureUrl: vaccine.pictureUrl || FALLBACK_IMAGES[0],
          status: vaccine.status || 'Available'
        });
        setUploadedImage(null);
      } else {
        // Reset form for new vaccine
        setOriginalName('');
        setFormData({
          id: '',
          name: '',
          compositions: '',
          description: '',
          price: '',
          pictureUrl: FALLBACK_IMAGES[0],
          status: 'Available'
        });
        setUploadedImage(null);
      }
      setErrors({});
    }
  }, [open, vaccine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'price' ? value : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectImage = (imageUrl) => {
    setFormData(prev => ({ ...prev, pictureUrl: imageUrl }));
    setUploadedImage(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setFormData(prev => ({ ...prev, pictureUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.compositions.trim()) newErrors.compositions = 'Compositions are required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price === '' || isNaN(parseFloat(formData.price))) newErrors.price = 'Valid price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // For debugging - log the form data we're sending
      console.log('Submitting form data:', formData);
      console.log('Original name was:', originalName);
      onSave(formData);
    }
  };

  const dialogTitle = formData.id ? 'Edit Vaccine' : 'Add New Vaccine';

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
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
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {originalName && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Original Name: {originalName}
                </Typography>
              </Box>
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
              name="compositions"
              label="Compositions"
              fullWidth
              margin="normal"
              value={formData.compositions}
              onChange={handleChange}
              error={!!errors.compositions}
              helperText={errors.compositions}
              required
            />
            
            <TextField
              name="description"
              label="Description"
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
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
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Unavailable">Unavailable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Selected Image:
              </Typography>
              <Box 
                sx={{ 
                  mt: 2,
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Avatar
                  src={uploadedImage || formData.pictureUrl}
                  alt="Vaccine"
                  variant="rounded"
                  sx={{ 
                    width: 150, 
                    height: 150,
                    border: '1px solid #e0e0e0',
                    bgcolor: 'background.paper'
                  }}
                >
                  <ImageIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={triggerFileInput}
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
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