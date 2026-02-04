/*import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FALLBACK_IMAGES = [
  '/src/assets/services/service1.webp',
  '/src/assets/services/service2.webp',
  '/src/assets/services/service3.webp'
];

export default function ServiceFormDialog({ open, onClose, onSave, service }) {
  const [formData, setFormData] = useState({
    id: '',
    heading: '',
    subheading: '',
    imageUrl: FALLBACK_IMAGES[0]
  });
  const [errors, setErrors] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (service) {
        setFormData({
          id: service.id || '',
          heading: service.heading || '',
          subheading: service.subheading || '',
          imageUrl: service.imageUrl || FALLBACK_IMAGES[0]
        });
      } else {
        setFormData({
          id: '',
          heading: '',
          subheading: '',
          imageUrl: FALLBACK_IMAGES[0]
        });
      }
      setErrors({});
    }
  }, [open, service]);

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

    const actualFileName = `${uuidv4()}_${file.name}`;

    setFormData(prev => ({
      ...prev,
      imageUrl: actualFileName
    }));

    const data = {
      type: "SERVICE_IMAGE",
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

      await uploadFileToS3(res.data.url, file);

    } catch (error) {
      console.error("Image upload failed:", error);
      setErrors(prev => ({ ...prev, image: 'Image upload failed' }));
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.heading.trim()) newErrors.heading = 'Heading is required';
    if (!formData.subheading.trim()) newErrors.subheading = 'Subheading is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const dialogTitle = formData.id ? 'Edit Service' : 'Add New Service';

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
            <TextField
              name="heading"
              label="Service Heading"
              fullWidth
              margin="normal"
              value={formData.heading}
              onChange={handleChange}
              error={!!errors.heading}
              helperText={errors.heading}
              required
            />

            <TextField
              name="subheading"
              label="Service Subheading"
              fullWidth
              margin="normal"
              value={formData.subheading}
              onChange={handleChange}
              error={!!errors.subheading}
              helperText={errors.subheading}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">Service Image:</Typography>
              <Box sx={{ mt: 2, mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={uploadedImage || formData.imageUrl}
                  variant="rounded"
                  alt="Service Image"
                  sx={{ width: 150, height: 150, border: '1px solid #e0e0e0', bgcolor: 'background.paper' }}
                >
                  <ImageIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Box>

              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={triggerFileInput}
                fullWidth
                disabled={uploading}
                sx={{ mb: 2 }}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              {errors.image && (
                <Typography color="error" variant="caption">
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
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          disabled={uploading || !formData.heading || !formData.subheading}
        >
          {formData.id ? 'Update Service' : 'Add Service'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ServiceFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  service: PropTypes.object
};*/


/*import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ServiceFormDialog({ open, onClose, onSave, service }) {
  const [formData, setFormData] = useState({
    id: '',
    heading: '',
    subheading: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (service) {
        setFormData({
          id: service.id || '',
          heading: service.heading || '',
          subheading: service.subheading || '',
          imageUrl: service.imageUrl || ''
        });
        setUploadedImage(service.imageUrl || null);
      } else {
        setFormData({
          id: '',
          heading: '',
          subheading: '',
          imageUrl: ''
        });
        setUploadedImage(null);
      }
      setErrors({});
    }
  }, [open, service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const uploadFileToS3 = async (url, file) => {
    try {
      const config = {
        headers: { 'Content-Type': file.type },
        ignoreDefaultAuth: true
      };
      await axios.put(url, file, config);
      return true;
    } catch (error) {
      console.error("S3 upload failed:", error);
      return false;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Generate unique filename
      const actualFileName = `${uuidv4()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Get presigned URL
      const res = await axios.post(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/get-presigned-url', 
        {
          type: "SERVICE_IMAGE",
          mimeType: file.type,
          key: actualFileName
        }
      );

      if (!res.data?.url) {
        throw new Error('Failed to get presigned URL');
      }

      // Upload to S3
      const uploadSuccess = await uploadFileToS3(res.data.url, file);
      
      if (!uploadSuccess) {
        throw new Error('S3 upload failed');
      }

      // Update form data with new image URL
      setFormData(prev => ({
        ...prev,
        imageUrl: actualFileName // This should be the final S3 URL or key
      }));

    } catch (error) {
      console.error("Image upload failed:", error);
      setErrors(prev => ({ ...prev, image: 'Image upload failed. Please try again.' }));
      setUploadedImage(null);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.heading.trim()) newErrors.heading = 'Heading is required';
    if (!formData.subheading.trim()) newErrors.subheading = 'Subheading is required';
    if (!uploadedImage && !formData.imageUrl) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        imageUrl: uploadedImage || formData.imageUrl
      });
    }
  };

  const dialogTitle = formData.id ? 'Edit Service' : 'Add New Service';

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
            <TextField
              name="heading"
              label="Service Heading"
              fullWidth
              margin="normal"
              value={formData.heading}
              onChange={handleChange}
              error={!!errors.heading}
              helperText={errors.heading}
              required
            />

            <TextField
              name="subheading"
              label="Service Subheading"
              fullWidth
              margin="normal"
              value={formData.subheading}
              onChange={handleChange}
              error={!!errors.subheading}
              helperText={errors.subheading}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">Service Image:</Typography>
              <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={uploadedImage || formData.imageUrl}
                  variant="rounded"
                  alt="Service Image"
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    border: '1px solid #e0e0e0', 
                    bgcolor: 'background.paper' 
                  }}
                >
                  {!uploadedImage && !formData.imageUrl && (
                    <ImageIcon sx={{ fontSize: 40 }} />
                  )}
                </Avatar>
              </Box>

              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={triggerFileInput}
                size="small"
                disabled={uploading}
                sx={{ 
                  mb: 1,
                  width: 'auto',
                  padding: '6px 12px',
                  fontSize: '0.875rem'
                }}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              
              {errors.image && (
                <Typography color="error" variant="caption">
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
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          disabled={uploading || !formData.heading || !formData.subheading || (!uploadedImage && !formData.imageUrl)}
        >
          {formData.id ? 'Update Service' : 'Add Service'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ServiceFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  service: PropTypes.object
};*/


import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ServiceFormDialog({ open, onClose, onSave, service }) {
  const [formData, setFormData] = useState({
    id: '',
    heading: '',
    subheading: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const dialogTitle = formData.id ? 'Edit Service' : 'Add New Service';

  useEffect(() => {
    if (open) {
      if (service) {
        setFormData({
          id: service.id || '',
          heading: service.heading || '',
          subheading: service.subheading || '',
          imageUrl: service.imageUrl || ''
        });
        setUploadedImage(service.imageUrl || null);
      } else {
        setFormData({
          id: '',
          heading: '',
          subheading: '',
          imageUrl: ''
        });
        setUploadedImage(null);
      }
      setErrors({});
    }
  }, [open, service]);

  // Define all handler functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const uploadFileToS3 = async (url, file) => {
    try {
      const config = {
        headers: { 'Content-Type': file.type },
        ignoreDefaultAuth: true
      };
      await axios.put(url, file, config);
      return true;
    } catch (error) {
      console.error("S3 upload failed:", error);
      return false;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Generate unique filename
      const actualFileName = `${uuidv4()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Get presigned URL
      const res = await axios.post(
        'https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/get-presigned-url', 
        {
          type: "SERVICE_IMAGE",
          mimeType: file.type,
          key: actualFileName
        }
      );

      if (!res.data?.url) {
        throw new Error('Failed to get presigned URL');
      }

      // Upload to S3
      const uploadSuccess = await uploadFileToS3(res.data.url, file);
      
      if (!uploadSuccess) {
        throw new Error('S3 upload failed');
      }

      // Update form data with new image URL
      setFormData(prev => ({
        ...prev,
        imageUrl: actualFileName
      }));

    } catch (error) {
      console.error("Image upload failed:", error);
      setErrors(prev => ({ ...prev, image: 'Image upload failed. Please try again.' }));
      setUploadedImage(null);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.heading.trim()) newErrors.heading = 'Heading is required';
    if (!formData.subheading.trim()) newErrors.subheading = 'Subheading is required';
    if (!uploadedImage && !formData.imageUrl) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        imageUrl: uploadedImage || formData.imageUrl
      });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minWidth: '800px',
          minHeight: '600px',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          m: 0, 
          p: 3,
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '1.5rem'
        }}
      >
        {dialogTitle}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TextField
              name="heading"
              label="Service Heading"
              fullWidth
              margin="normal"
              value={formData.heading}
              onChange={handleChange}
              error={!!errors.heading}
              helperText={errors.heading}
              required
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '1.1rem'
                }
              }}
            />

            <TextField
              name="subheading"
              label="Service Subheading"
              fullWidth
              margin="normal"
              value={formData.subheading}
              onChange={handleChange}
              error={!!errors.subheading}
              helperText={errors.subheading}
              multiline
              rows={6}
              required
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '1.1rem'
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="h6">Service Image:</Typography>
              <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={uploadedImage || formData.imageUrl}
                  variant="rounded"
                  alt="Service Image"
                  sx={{ 
                    width: 250,
                    height: 250, 
                    border: '2px solid #e0e0e0', 
                    bgcolor: 'background.paper',
                    '& .MuiSvgIcon-root': {
                      fontSize: '4rem'
                    }
                  }}
                >
                  {!uploadedImage && !formData.imageUrl && (
                    <ImageIcon />
                  )}
                </Avatar>
              </Box>

              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={triggerFileInput}
                size="medium"
                disabled={uploading}
                sx={{ 
                  mb: 2,
                  width: '80%',
                  padding: '8px 16px',
                  fontSize: '1rem',
                  alignSelf: 'center'
                }}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              
              {errors.image && (
                <Typography color="error" variant="body2">
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

      <DialogActions sx={{ px: 4, pb: 4, pt: 2 }}>
        <Button 
          onClick={onClose} 
          color="secondary" 
          variant="outlined"
          size="large"
          sx={{ minWidth: '120px' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          size="large"
          disabled={uploading || !formData.heading || !formData.subheading || (!uploadedImage && !formData.imageUrl)}
          sx={{ minWidth: '160px' }}
        >
          {formData.id ? 'Update Service' : 'Add Service'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ServiceFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  service: PropTypes.object
};