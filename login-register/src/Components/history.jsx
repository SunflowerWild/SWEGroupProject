import React, { useState, useEffect } from "react";
import { Paper, Avatar, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey, indigo } from '@mui/material/colors';
import HistoryIcon from '@mui/icons-material/History';
import api from '../utils/api'; // Use the same API utility as in Inventory
import { DashboardHeader } from "./DashboardHeader"; // adjust path as needed

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: blueGrey,
  }
});

export const History = () => {
  const paperStyle = { padding: 26, width: '80%', margin: '20px auto' };
  const avatarStyle = { backgroundColor: '#7a15bb9e' };
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const API_URL = '/api/inventory'; // Path relative to base URL
  const TIMEOUT_MS = 30000; // 30 seconds timeout, same as Inventory

  // Fetch history data when component mounts
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Fetching history from:', `${api.defaults.baseURL}${API_URL}/history`);

      const response = await api.get(`${API_URL}/history`, {
        timeout: TIMEOUT_MS,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('History API response:', response);
      setHistory(response.data || []);

      if (response.data && response.data.length > 0) {
        showAlert('History loaded successfully', 'success');
      } else {
        showAlert('No history records found', 'info');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching history:', err);

      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError("Server is taking too long to respond. Please try again later.");
        showAlert("Request timed out. The server might be busy.", 'error');
      } else if (err.response?.status === 404) {
        setError('History endpoint not found. Please check server configuration.');
        showAlert('Could not find the history endpoint on the server.', 'error');
      } else if (err.response?.status === 401) {
        setError('Authentication error: Please log in again.');
        showAlert('Your session may have expired. Please log in again.', 'error');
      } else if (err.response?.status === 403) {
        setError('Authorization error: You do not have permission to view history.');
        showAlert('You need admin privileges to view history.', 'error');
      } else {
        setError(`Failed to load history: ${err.response?.data?.message || err.message}`);
        showAlert(`Error: ${err.response?.data?.message || err.message}`, 'error');
      }

      setLoading(false);
    }
  };

  const handleReturn = async (itemId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        showAlert('No authentication token found. Please log in again.', 'error');
        return;
      }

      console.log('Attempting to return item with id:', itemId);

      const response = await api.post(`${API_URL}/returnItem`,
        { id: itemId },
        {
          timeout: TIMEOUT_MS,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Return response:', response.data);
      showAlert('Item returned successfully', 'success');

      // Refresh the history data
      fetchHistory();
    } catch (err) {
      console.error('Error returning item:', err);

      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        showAlert("Request timed out. Please try again.", 'error');
      } else {
        showAlert(`Failed to return item: ${err.response?.data?.message || err.message}`, 'error');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRetry = () => {
    fetchHistory();
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardHeader />
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}><HistoryIcon /></Avatar>
            <h2>Transaction History</h2>
          </Grid>

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
                  Retry Loading History
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Part Name</TableCell>
                  <TableCell>Part ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Return</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.length > 0 ? (
                  history.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{formatDate(item.timestamp)}</TableCell>
                      <TableCell>{item.partName}</TableCell>
                      <TableCell>{item.partNumber}</TableCell>
                      <TableCell>{item.user}</TableCell>
                      <TableCell>{item.action}</TableCell>
                      <TableCell>
                        {item.action === 'Check out' && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleReturn(item.partNumber)}
                          >
                            Return
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No history records found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            onClick={fetchHistory}
            disabled={loading}
          >
            Refresh History
          </Button>
        </Paper>
      </Grid>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};