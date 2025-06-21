import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CircularProgress,
    AppBar,
    Toolbar,
    Modal,
    TextField,
    Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

// Styled buttons
const LearnMoreButton = styled(Button)({
    marginTop: '1rem',
    textTransform: 'none',
    borderRadius: '20px',
});

const AddServiceButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '20px',
    padding: '8px 16px',
    fontWeight: 600,
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

function ServicePage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const [newHeading, setNewHeading] = useState('');
    const [newSubheading, setNewSubheading] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-bishops-services');
                const data = await response.json();
                const parsedBody = JSON.parse(data.body);
                setServices(parsedBody);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleAddServiceClick = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setNewHeading('');
        setNewSubheading('');
        setImageFile(null);
        setPreviewUrl(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (!newHeading || !newSubheading || !imageFile) {
            alert('Please fill all fields and upload an image.');
            return;
        }

        const newService = {
            heading: newHeading,
            subheading: newSubheading,
            imageUrl: previewUrl, // in real-world apps you'd upload this and use the cloud URL
        };

        setServices([...services, newService]);
        handleModalClose();
    };

    return (
        <>
            {/* Top App Bar */}
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        TravelSync Services
                    </Typography>
                    <AddServiceButton
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={handleAddServiceClick}
                    >
                        Add Service
                    </AddServiceButton>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box sx={{ backgroundColor: '#f5f5f5', py: 8, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Typography variant="h3" gutterBottom fontWeight="bold">
                        Your Trusted Travel Health Companion
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Discover professional travel care services with precision, safety, and convenience.
                    </Typography>
                </Container>
            </Box>

            {/* Services */}
            <Container sx={{ py: 6 }}>
                {loading ? (
                    <Box textAlign="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {services.map((service, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={service.imageUrl || 'https://via.placeholder.com/400x200?text=Service+Image'}
                                        alt={service.heading}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                                            {service.heading}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {service.subheading}
                                        </Typography>
                                        <LearnMoreButton variant="contained" color="primary" fullWidth>
                                            Learn More
                                        </LearnMoreButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Modal for Adding Service */}
            <Modal open={openModal} onClose={handleModalClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Add New Service
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Heading"
                            variant="outlined"
                            fullWidth
                            value={newHeading}
                            onChange={(e) => setNewHeading(e.target.value)}
                        />
                        <TextField
                            label="Subheading"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={newSubheading}
                            onChange={(e) => setNewSubheading(e.target.value)}
                        />
                        <Button variant="outlined" component="label">
                            Upload Image
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                        {previewUrl && (
                            <Box
                                component="img"
                                src={previewUrl}
                                alt="Preview"
                                sx={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: 2 }}
                            />
                        )}
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            {/* Footer */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mt: 8, textAlign: 'center' }}>
                <Typography variant="body2">
                    © {new Date().getFullYear()} TravelSync. All rights reserved.
                </Typography>
            </Box>
        </>
    );
}

export default ServicePage;
