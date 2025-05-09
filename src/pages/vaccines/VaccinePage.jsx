import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// project imports
import MainCard from 'components/MainCard';
import VaccinesTable from 'sections/dashboard/default/VaccinesTable';
import VaccineFormDialog from 'sections/dashboard/default/VaccineFormDialog';

// ==============================|| VACCINES PAGE ||============================== //

export default function VaccinePage() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVaccine, setCurrentVaccine] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const PHARMACY_NO = "PN1853278176";
  
  // Fetch vaccines from API
  const fetchVaccines = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/fetch-all-vaccines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pharmacyNo: PHARMACY_NO
        })
      });
      const data = await response.json();
      if (data.responseStatus.code === 1001) {
        setVaccines(data.vaccineList);
      } else {
        setSnackbar({
          open: true,
          message: `Error fetching vaccines: ${data.responseStatus.message || 'Unknown error'}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      setSnackbar({
        open: true,
        message: `Error fetching vaccines: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleAddVaccine = () => {
    setCurrentVaccine(null);
    setOpenDialog(true);
  };

  const handleEditVaccine = (vaccine) => {
    console.log('Editing vaccine:', vaccine);
    setCurrentVaccine(vaccine);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSaveVaccine = async (vaccineData) => {
    setSaving(true);
    try {
      // Check if we're in edit mode by checking currentVaccine state
      const isEditMode = !!currentVaccine;
      
      console.log('Is Edit Mode:', isEditMode);
      console.log('Current Vaccine:', currentVaccine); // Log the original vaccine for debugging
      console.log('Vaccine Data to save:', vaccineData);
      
      // For an update operation, we need to ensure we're using the original name
      // as it appears to be the key identifier for the API
      const apiPayload = {
        action: isEditMode ? "UPDATE" : "ADD",
        vaccine: {
          // For updates, keep the original name as the identifier
          name: isEditMode ? currentVaccine.name : vaccineData.name,
          compositions: vaccineData.compositions,
          description: vaccineData.description,
          price: vaccineData.price.toString(), // Ensure price is a string
          pictureUrl: vaccineData.pictureUrl || '',
          status: vaccineData.status,
          pharmacyNo: PHARMACY_NO
        }
      };
      
      // Include additional identifiers if they exist
      if (isEditMode) {
        // Include vaccineID if it exists
        if (currentVaccine.vaccineID) {
          apiPayload.vaccine.vaccineID = currentVaccine.vaccineID;
        }
        
        // If the name was changed in the form, include the new name as a separate property
        if (vaccineData.name !== currentVaccine.name) {
          apiPayload.vaccine.newName = vaccineData.name;
        }
      }
      
      console.log('API Payload:', apiPayload);
      
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/manage-vaccine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.responseStatus && data.responseStatus.code === 1001) {
        setSnackbar({
          open: true,
          message: isEditMode ? 'Vaccine updated successfully!' : 'Vaccine added successfully!',
          severity: 'success'
        });
        fetchVaccines(); // Refresh the vaccines list
      } else {
        throw new Error(data.responseStatus?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error saving vaccine:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${currentVaccine ? 'update' : 'add'} vaccine: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setSaving(false);
      setOpenDialog(false);
    }
  };

  const handleStatusChange = async (vaccine, newStatus) => {
    setSaving(true);
    try {
      const apiPayload = {
        action: "UPDATE",
        vaccine: {
          // Always include the original name as identifier
          name: vaccine.name,
          status: newStatus,
          pharmacyNo: PHARMACY_NO
        }
      };
      
      // Include vaccineID if it exists
      if (vaccine.vaccineID) {
        apiPayload.vaccine.vaccineID = vaccine.vaccineID;
      }
      
      console.log('Status change payload:', apiPayload);
      
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/manage-vaccine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      const data = await response.json();
      console.log('Status change response:', data);
      
      if (data.responseStatus && data.responseStatus.code === 1001) {
        setSnackbar({
          open: true,
          message: 'Vaccine status updated successfully!',
          severity: 'success'
        });
        fetchVaccines();
      } else {
        throw new Error(data.responseStatus?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating vaccine status:', error);
      setSnackbar({
        open: true,
        message: `Failed to update vaccine status: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Available Vaccines</Typography>
          </Grid>
          <Grid>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddVaccine}
              disabled={saving}
            >
              Add Vaccine
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography>Loading vaccines...</Typography>
            </Box>
          ) : (
            <VaccinesTable 
              vaccines={vaccines} 
              onEdit={handleEditVaccine}
              onStatusChange={handleStatusChange}
            />
          )}
        </MainCard>
      </Grid>

      <VaccineFormDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveVaccine}
        vaccine={currentVaccine}
      />
      
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
    </Grid>
  );
}