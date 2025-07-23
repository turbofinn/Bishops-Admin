/*import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import MainCard from 'components/MainCard';
import VaccinesTable from 'sections/dashboard/default/VaccinesTable';
import VaccineFormDialog from 'sections/dashboard/default/VaccineFormDialog';

// ==============================|| VACCINES PAGE ||============================== //

export default function VaccinePage() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true); // For initial page load
  const [saving, setSaving] = useState(false); // For save operations
  const [statusChanging, setStatusChanging] = useState(false); // For status change operations
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
      const isEditMode = !!currentVaccine;
      
      const apiPayload = {
        action: isEditMode ? "UPDATE" : "ADD",
        vaccine: {
          name: isEditMode ? currentVaccine.name : vaccineData.name,
          compositions: vaccineData.compositions,
          description: vaccineData.description,
          price: vaccineData.price.toString(),
          pictureUrl: vaccineData.pictureUrl || '',
          status: vaccineData.status,
          pharmacyNo: PHARMACY_NO
        }
      };
      
      if (isEditMode) {
        if (currentVaccine.vaccineID) {
          apiPayload.vaccine.vaccineID = currentVaccine.vaccineID;
        }
        
        if (vaccineData.name !== currentVaccine.name) {
          apiPayload.vaccine.newName = vaccineData.name;
        }
      }
      
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/manage-vaccine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      const data = await response.json();
      
      if (data.responseStatus && data.responseStatus.code === 1001) {
        setSnackbar({
          open: true,
          message: isEditMode ? 'Vaccine updated successfully!' : 'Vaccine added successfully!',
          severity: 'success'
        });
        fetchVaccines();
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
    setStatusChanging(true);
    try {
      const apiPayload = {
        action: "UPDATE",
        vaccine: {
          name: vaccine.name,
          status: newStatus,
          pharmacyNo: PHARMACY_NO
        }
      };
      
      if (vaccine.vaccineID) {
        apiPayload.vaccine.vaccineID = vaccine.vaccineID;
      }
      
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/manage-vaccine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      const data = await response.json();
      
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
      setStatusChanging(false);
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
              disabled={saving || statusChanging}
            >
              {saving ? <CircularProgress size={24} /> : 'Add Vaccine'}
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          {loading ? (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <VaccinesTable 
              vaccines={vaccines} 
              onEdit={handleEditVaccine}
              onStatusChange={handleStatusChange}
              statusChanging={statusChanging}
            />
          )}
        </MainCard>
      </Grid>

      <VaccineFormDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveVaccine}
        vaccine={currentVaccine}
        saving={saving}
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
}*/

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import MainCard from 'components/MainCard';
import VaccinesTable from 'sections/dashboard/default/VaccinesTable';
import VaccineFormDialog from 'sections/dashboard/default/VaccineFormDialog';
import Search from 'layout/Dashboard/Header/HeaderContent/Search';

export default function VaccinePage() {
  const [vaccines, setVaccines] = useState([]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVaccine, setCurrentVaccine] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const PHARMACY_NO = "PN1853278176";
  
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
        setFilteredVaccines(data.vaccineList);
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

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredVaccines(vaccines);
      return;
    }
    
    // Case-sensitive search - exact match as typed
    const filtered = vaccines.filter(vaccine => 
      vaccine.name.includes(searchTerm)
    );
    setFilteredVaccines(filtered);
  };

   const handleAddVaccine = () => {
    setCurrentVaccine(null);
    setOpenDialog(true);
  };

  const handleEditVaccine = (vaccine) => {
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
      const isEditMode = !!currentVaccine;
      
      const apiPayload = {
        action: isEditMode ? "UPDATE" : "ADD",
        vaccine: {
          name: isEditMode ? currentVaccine.name : vaccineData.name,
          compositions: vaccineData.compositions,
          description: vaccineData.description,
          price: vaccineData.price.toString(),
          pictureUrl: vaccineData.pictureUrl || '',
          status: vaccineData.status,
          pharmacyNo: PHARMACY_NO
        }
      };
      
      if (isEditMode) {
        if (currentVaccine.vaccineID) {
          apiPayload.vaccine.vaccineID = currentVaccine.vaccineID;
        }
        
        if (vaccineData.name !== currentVaccine.name) {
          apiPayload.vaccine.newName = vaccineData.name;
        }
      }
      
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/manage-vaccine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      const data = await response.json();
      
      if (data.responseStatus && data.responseStatus.code === 1001) {
        setSnackbar({
          open: true,
          message: isEditMode ? 'Vaccine updated successfully!' : 'Vaccine added successfully!',
          severity: 'success'
        });
        fetchVaccines();
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
    setStatusChanging(true);
    try {
      const apiPayload = {
        action: "UPDATE",
        vaccine: {
          name: vaccine.name,
          status: newStatus,
          pharmacyNo: PHARMACY_NO
        }
      };
      
      if (vaccine.vaccineID) {
        apiPayload.vaccine.vaccineID = vaccine.vaccineID;
      }
      
      const response = await fetch('https://7n0wver1gl.execute-api.eu-west-2.amazonaws.com/dev/manage-vaccine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      const data = await response.json();
      
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
      setStatusChanging(false);
    }
  };

  

  // ... rest of your handlers remain the same ...

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
              disabled={saving || statusChanging}
            >
              {saving ? <CircularProgress size={24} /> : 'Add Vaccine'}
            </Button>
          </Grid>
        </Grid>
        
        {/* Search component */}
        <Box sx={{ mt: 2 }}>
          <Search onSearch={handleSearch} />
        </Box>
        
        <MainCard sx={{ mt: 2 }} content={false}>
          {loading ? (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <VaccinesTable 
              vaccines={filteredVaccines}
              onEdit={handleEditVaccine}
              onStatusChange={handleStatusChange}
              statusChanging={statusChanging}
            />
          )}
        </MainCard>
      </Grid>

      {/* Dialog and Snackbar components remain the same */}
      <VaccineFormDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveVaccine}
        vaccine={currentVaccine}
        saving={saving}
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

