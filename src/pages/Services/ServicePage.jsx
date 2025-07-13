import { useState, useEffect } from 'react';
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
    Snackbar,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ServiceFormDialog from 'sections/dashboard/default/ServiceFormDialog';
 // Update the import path as needed

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

function ServicePage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-bishops-services');
                const data = await response.json();
                const parsedBody = JSON.parse(data.body);
                setServices(parsedBody);
            } catch (error) {
                console.error('Error fetching services:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to load services',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    /*const handleLearnMore = (service) => {
        // Add your "Learn More" functionality here
        console.log("Learn more about:", service.heading);
        // You could:
        // 1. Navigate to a detail page
        // 2. Open a modal with more info
        // 3. Show an alert with details
        alert(`Learn more about ${service.heading}\n\n${service.subheading}`);
    };*/

    const handleServiceClick = (service) => {
        // Navigate to a new page with the service ID or other identifier
        navigate(`../sections/service-pages/earMicrosuction`, { state: { service } });
        
        // Alternatively, you could use:
        // navigate(`/services/${service.id}`, { state: { service } });
    };

    const handleLearnMore = (service) => {
    // Add your "Learn More" functionality here
    console.log("Learn more about:", service.heading);
    // You could:
    // 1. Navigate to a detail page
    // 2. Open a modal with more info
    // 3. Show an alert with details
    alert(`Learn more about ${service.heading}\n\n${service.subheading}`);
};


    const handleAddServiceClick = () => {
        setCurrentService(null);
        setOpenDialog(true);
    };

    const handleEditService = (service) => {
        setCurrentService(service);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSaveService = async (serviceData) => {
        try {
            // For demo purposes, we're updating local state
            // In a real app, you would make an API call here
            if (currentService) {
                // Update existing service
                setServices(services.map(s => 
                    s.id === currentService.id ? { ...serviceData, id: currentService.id } : s
                ));
                setSnackbar({
                    open: true,
                    message: 'Service updated successfully!',
                    severity: 'success'
                });
            } else {
                // Add new service
                const newService = {
                    ...serviceData,
                    id: Date.now().toString() // Temporary ID
                };
                setServices([...services, newService]);
                setSnackbar({
                    open: true,
                    message: 'Service added successfully!',
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error saving service:', error);
            setSnackbar({
                open: true,
                message: `Failed to save service: ${error.message}`,
                severity: 'error'
            });
        } finally {
            setOpenDialog(false);
        }
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
          {/*  <Container sx={{ py: 6 }}>
                {loading ? (
                    <Box textAlign="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {services.map((service, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: 6,
                                            transform: 'translateY(-4px)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                    onClick={() => handleLearnMore()}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={service.imageUrl || 'https://via.placeholder.com/400x200?text=Service+Image'}
                                        alt={service.heading}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                                            {service.heading}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
            </Container>*/}

             <Container sx={{ py: 6 }}>
                {loading ? (
                    <Box textAlign="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {services.map((service, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: 6,
                                            transform: 'translateY(-4px)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                    onClick={() => handleServiceClick(service)} // Changed to handleServiceClick
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={service.imageUrl || 'https://via.placeholder.com/400x200?text=Service+Image'}
                                        alt={service.heading}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                                            {service.heading}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {service.subheading}
                                        </Typography>
                                        <LearnMoreButton 
                                            variant="contained" 
                                            color="primary" 
                                            fullWidth
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click when button is clicked
                                                handleLearnMore(service);
                                            }}
                                        >
                                            Learn More
                                        </LearnMoreButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>


            {/* Service Form Dialog */}
            <ServiceFormDialog 
                open={openDialog}
                onClose={handleCloseDialog}
                onSave={handleSaveService}
                service={currentService}
            />

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Footer */}
            <Box sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                py: 3, 
                mt: 8, 
                textAlign: 'center',
                position: 'relative',
                bottom: 0,
                width: '100%'
            }}>
                <Typography variant="body2">
                    © {new Date().getFullYear()} TravelSync. All rights reserved.
                </Typography>
            </Box>
        </>
    );
}

export default ServicePage;