import React, { useState, useEffect } from "react";
import { Paper, Avatar, Grid, Typography, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody, TextField, Snackbar, Alert, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo } from '@mui/material/colors';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import api from '../utils/api'; // Import your pre-configured api instance
import { DashboardHeader } from "./DashboardHeader"; // adjust path as needed

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: blueGrey,
  }
});

export const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const paperStyle = { padding: 26, width: '80%', margin: '20px auto' };
  const avatarStyle = { backgroundColor: '#7a15bb9e' };

  const API_URL = '/api/inventory'; // Path relative to base URL
  const TIMEOUT_MS = 30000; // Increase timeout to 30 seconds

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async (retry = false) => {
    if (retry) {
      setRetryCount(prevCount => prevCount + 1);
    } else {
      setRetryCount(0);
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token'); // Get token from storage
    console.log('Fetching inventory from:', `${api.defaults.baseURL}${API_URL}/summary`);
    console.log('Retry count:', retry ? retryCount + 1 : 0);

    try {
      const response = await api.get(`${API_URL}/summary`, {
        timeout: TIMEOUT_MS,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log('Inventory API response:', response);

      setInventory(response.data || []);
      if (response.data && response.data.length > 0) {
        showAlert('Inventory loaded successfully', 'success');
      } else {
        showAlert('No inventory items found', 'info');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setError("Server is taking too long to respond. Please try again later.");
        showAlert("Request timed out. The server might be busy.", 'error');
      } else {
        setError(`Failed to load inventory: ${error.message}`);
        showAlert(`Failed to load inventory: ${error.response?.data?.message || error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleCheckout = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token being used:', token);
      console.log('Checking out item with id:', itemId);

      const response = await api.post(`${API_URL}/checkout`, { id: itemId }, {
        timeout: TIMEOUT_MS,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log('Checkout response:', response.data);
      fetchInventory();
      showAlert('Item checked out successfully', 'success');
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        showAlert("Request timed out. Please try again.", 'error');
      } else if (error.response?.data?.message === 'User not found') {
        showAlert('Authentication issue: Please try logging out and back in', 'error');
      } else {
        showAlert(`Failed to check out item: ${error.response?.data?.message || error.message}`, 'error');
      }
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const filteredInventory = inventory.filter(item =>
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRetry = () => {
    fetchInventory(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardHeader />
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}><Inventory2Icon /></Avatar>
            <h2>Inventory Management</h2>
            <Typography variant="body2" color="textSecondary" paragraph>
              {inventory.length > 0
                ? `Showing ${filteredInventory.length} of ${inventory.length} inventory items`
                : 'No inventory items found'}
            </Typography>
          </Grid>

          <TextField
            label="Search inventory..."
            variant="outlined"
            fullWidth
            style={{ marginBottom: 20 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <Grid container justifyContent="center" padding={4}>
              <CircularProgress />
            </Grid>
          ) : error ? (
            <Grid container direction="column" spacing={2} alignItems="center" padding={2}>
              <Grid item>
                <Alert severity="error" style={{ marginBottom: 20 }}>{error}</Alert>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary" onClick={handleRetry}>
                  Retry Loading Inventory
                </Button>
              </Grid>
            </Grid>
          ) : inventory.length === 0 ? (
            <Alert severity="info">No inventory items found. Try adding some parts or PCs.</Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Available / Total</TableCell>
                  <TableCell>Project Tags</TableCell>
                  {inventory.some(item => item.specs) && <TableCell>Specs</TableCell>}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item, index) => (
                    <TableRow key={`${item.name}-${item.location}-${index}`}>
                      <TableCell>{item.name || 'N/A'}</TableCell>
                      <TableCell>{item.type || 'N/A'}</TableCell>
                      <TableCell>{item.location || 'N/A'}</TableCell>
                      <TableCell>{item.availableQuantity} / {item.totalQuantity}</TableCell>
                      <TableCell>
                        {item.projectTags && item.projectTags.length > 0
                          ? item.projectTags.filter(tag => tag).join(', ')
                          : 'None'}
                      </TableCell>
                      {inventory.some(i => i.specs) &&
                        <TableCell style={{ whiteSpace: 'pre-line' }}>{item.specs || 'N/A'}</TableCell>}
                      <TableCell>
                        {item.itemIds && item.itemIds.length > 0 ? (
                          // Single checkout button that uses the first ID
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleCheckout(item.itemIds[0])}
                            disabled={item.availableQuantity <= 0}
                          >
                            CHECK OUT
                          </Button>
                        ) : (
                          <Typography variant="caption">No IDs available</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No matching inventory items found. {searchTerm && 'Try a different search term.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            onClick={() => fetchInventory()}
            disabled={loading}
          >
            Refresh Inventory
          </Button>
        </Paper>
      </Grid>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};