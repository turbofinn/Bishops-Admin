/*import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Material-UI imports
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
import CircularProgress from '@mui/material/CircularProgress';

const FALLBACK_IMAGES = [
  '/assets/bv2.webp',
  '/assets/bv3.webp',
  '/assets/bv4.webp',
  '/assets/bv5.webp',
  '/assets/bv6.webp'
];

export default function VaccineFormDialog({ open, onClose, onSave, vaccine }) {
  const [formData, setFormData] = useState({
    name: '',
    compositions: '',
    description: '',
    price: '',
    pictureUrl: FALLBACK_IMAGES[0],
    status: 'Available'
  });
  const [errors, setErrors] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (vaccine) {
        // Set the original name for reference
        setOriginalName(vaccine.name || '');
        
        // Set form data with the vaccine details
        setFormData({
          name: vaccine.name || '',
          compositions: vaccine.compositions || '',
          description: vaccine.description || '',
          price: vaccine.price || '',
          pictureUrl: vaccine.pictureUrl || FALLBACK_IMAGES[0],
          status: vaccine.status || 'Available'
        });
        
        // If there's an existing image, set it as the uploaded image
        if (vaccine.pictureUrl) {
          setUploadedImage(vaccine.pictureUrl);
        }
      } else {
        // Reset form for new vaccine
        setOriginalName('');
        setFormData({
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
      setIsSubmitting(false);
    }
  }, [open, vaccine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const uploadFileToS3 = async (url, file) => {
    const config = {
      headers: { 'Content-Type': file.type },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percent}%`);
      },
      ignoreDefaultAuth: true
    };
    await axios.put(url, file, config);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);

    const actualFileName = `${uuidv4()}_${uuidv4()}_${file.name}`;

    const data = {
      type: "VACCINE_IMAGE",
      mimeType: file.type,
      key: actualFileName
    };

    try {
      setUploading(true);
      const res = await axios.post(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/get-presigned-url', 
        data
      );

      if (!res.data?.response || res.data.response.responseCode !== 1001 || !res.data.url) {
        throw new Error('Failed to get presigned URL');
      }

      const uploadUrl = res.data.url;
      await uploadFileToS3(uploadUrl, file);

      // Update the form data with the new image URL
      setFormData(prev => ({
        ...prev,
        pictureUrl: actualFileName
      }));

    } catch (error) {
      console.error("Image upload failed:", error);
      setErrors(prev => ({ ...prev, image: 'Image upload failed. Please try again.' }));
    } finally {
      setUploading(false);
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        // Include the original name if we're editing
        ...(originalName && { originalName })
      });
    } catch (error) {
      console.error('Error saving vaccine:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogTitle = vaccine ? 'Update Vaccine' : 'Add New Vaccine';

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
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
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
                startAdornment: <InputAdornment position="start">£</InputAdornment>,
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
              <Typography variant="subtitle1">Vaccine Image</Typography>
              <Box sx={{ mt: 2, mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={uploadedImage || formData.pictureUrl}
                  variant="rounded"
                  alt="Vaccine Image"
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    border: '1px solid #e0e0e0', 
                    bgcolor: 'background.paper' 
                  }}
                >
                  {!uploadedImage && !formData.pictureUrl && <ImageIcon sx={{ fontSize: 40 }} />}
                </Avatar>
              </Box>

              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={triggerFileInput}
                fullWidth
                disabled={uploading || isSubmitting}
                sx={{ mb: 2 }}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
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
        <Button 
          onClick={onClose} 
          color="secondary" 
          variant="outlined"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          disabled={uploading || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Processing...' : vaccine ? 'Update Vaccine' : 'Add Vaccine'}
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
};*/

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Material-UI imports
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
import CircularProgress from '@mui/material/CircularProgress';

const FALLBACK_IMAGES = [
  '/assets/bv2.webp',
  '/assets/bv3.webp',
  '/assets/bv4.webp',
  '/assets/bv5.webp',
  '/assets/bv6.webp'
];

export default function VaccineFormDialog({ open, onClose, onSave, vaccine, existingVaccines = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    compositions: '',
    description: '',
    price: '',
    pictureUrl: FALLBACK_IMAGES[0],
    status: 'Available'
  });
  const [errors, setErrors] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const isWhitespace = (str) => !str || !str.trim();

  useEffect(() => {
    if (open) {
      if (vaccine) {
        setOriginalName(vaccine.name || '');
        setFormData({
          name: vaccine.name || '',
          compositions: vaccine.compositions || '',
          description: vaccine.description || '',
          price: vaccine.price || '',
          pictureUrl: vaccine.pictureUrl || FALLBACK_IMAGES[0],
          status: vaccine.status || 'Available'
        });
        if (vaccine.pictureUrl) {
          setUploadedImage(vaccine.pictureUrl);
        }
      } else {
        setOriginalName('');
        setFormData({
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
      setIsSubmitting(false);
    }
  }, [open, vaccine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const uploadFileToS3 = async (url, file) => {
    const config = {
      headers: { 'Content-Type': file.type },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percent}%`);
      },
      ignoreDefaultAuth: true
    };
    await axios.put(url, file, config);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);

    const actualFileName = `${uuidv4()}_${uuidv4()}_${file.name}`;

    const data = {
      type: "VACCINE_IMAGE",
      mimeType: file.type,
      key: actualFileName
    };

    try {
      setUploading(true);
      const res = await axios.post(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/get-presigned-url', 
        data
      );

      if (!res.data?.response || res.data.response.responseCode !== 1001 || !res.data.url) {
        throw new Error('Failed to get presigned URL');
      }

      const uploadUrl = res.data.url;
      await uploadFileToS3(uploadUrl, file);

      setFormData(prev => ({
        ...prev,
        pictureUrl: actualFileName
      }));

    } catch (error) {
      console.error("Image upload failed:", error);
      setErrors(prev => ({ ...prev, image: 'Image upload failed. Please try again.' }));
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedCompositions = formData.compositions.trim();
    const trimmedDescription = formData.description.trim();

    // Name validation
    if (isWhitespace(formData.name)) {
      newErrors.name = 'Name is required';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (trimmedName.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    } else if (
      !vaccine &&
      existingVaccines.some(
        v => v.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      newErrors.name = 'A vaccine with this name already exists';
    } else if (
      vaccine &&
      trimmedName.toLowerCase() !== originalName.toLowerCase() &&
      existingVaccines.some(
        v => 
          v.name.toLowerCase() === trimmedName.toLowerCase() &&
          v.name.toLowerCase() !== originalName.toLowerCase()
      )
    ) {
      newErrors.name = 'Another vaccine with this name already exists';
    }

    // Compositions validation
    if (isWhitespace(formData.compositions)) {
      newErrors.compositions = 'Compositions are required';
    } else if (trimmedCompositions.length < 5) {
      newErrors.compositions = 'Compositions must be at least 5 characters';
    } else if (trimmedCompositions.length > 500) {
      newErrors.compositions = 'Compositions must be less than 500 characters';
    }

    // Description validation
    if (isWhitespace(formData.description)) {
      newErrors.description = 'Description is required';
    } else if (trimmedDescription.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (trimmedDescription.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    // Price validation
    if (isWhitespace(formData.price)) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price)) {
      newErrors.price = 'Price can have max 2 decimal places';
    } else if (parseFloat(formData.price) > 10000) {
      newErrors.price = 'Price must be less than £10,000';
    }

    // Image validation
    if (!vaccine && !uploadedImage && !formData.pictureUrl) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price).toFixed(2),
        ...(originalName && { originalName })
      };
      
      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving vaccine:', error);
      setErrors(prev => ({
        ...prev,
        form: 'Failed to save vaccine. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogTitle = vaccine ? 'Update Vaccine' : 'Add New Vaccine';

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
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {errors.form && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errors.form}
          </Typography>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
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
              inputProps={{ maxLength: 100 }}
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
              inputProps={{ maxLength: 500 }}
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
              inputProps={{ maxLength: 2000 }}
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
                startAdornment: <InputAdornment position="start">£</InputAdornment>,
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
              <Typography variant="subtitle1">Vaccine Image</Typography>
              <Box sx={{ mt: 2, mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={uploadedImage || formData.pictureUrl}
                  variant="rounded"
                  alt="Vaccine Image"
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    border: '1px solid #e0e0e0', 
                    bgcolor: 'background.paper' 
                  }}
                >
                  {!uploadedImage && !formData.pictureUrl && <ImageIcon sx={{ fontSize: 40 }} />}
                </Avatar>
              </Box>

              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={triggerFileInput}
                fullWidth
                disabled={uploading || isSubmitting}
                sx={{ mb: 2 }}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              {errors.image && (
                <Typography color="error" variant="caption" display="block">
                  {errors.image}
                </Typography>
              )}
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
        <Button 
          onClick={onClose} 
          color="secondary" 
          variant="outlined"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          disabled={uploading || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Processing...' : vaccine ? 'Update Vaccine' : 'Add Vaccine'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

VaccineFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  vaccine: PropTypes.object,
  existingVaccines: PropTypes.arrayOf(PropTypes.object)
};

VaccineFormDialog.defaultProps = {
  existingVaccines: []
};



