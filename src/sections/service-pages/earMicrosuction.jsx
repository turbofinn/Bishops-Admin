import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardMedia, CardContent, Container } from '@mui/material';

function ServiceDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { service } = location.state || {};

    if (!service) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h5">Service not found</Typography>
                <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/services')}
                >
                    Back to Services
                </Button>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Button 
                variant="outlined" 
                sx={{ mb: 3 }}
                onClick={() => navigate('/services')}
            >
                Back to Services
            </Button>
            
            <Card>
                <CardMedia
                    component="img"
                    height="400"
                    image={service.imageUrl || 'https://via.placeholder.com/800x400?text=Service+Image'}
                    alt={service.heading}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {service.heading}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {service.subheading}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {/* Add more detailed description here */}
                        Detailed information about the service would go here. 
                        This could include pricing, duration, requirements, etc.
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large"
                        sx={{ mt: 2 }}
                        onClick={() => {
                            // Add booking or other action here
                        }}
                    >
                        Book This Service
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
}

export default ServiceDetailPage;