import React, { useState, useCallback, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress, 
  Alert, 
  Box,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
const authToken = import.meta.env.VITE_GRAFANA_TOKEN;
interface GrafanaDashboardProps {
    dashboardUrl: string;
    orgId?: string;
    panelId?: string;
    theme?: 'dark' | 'light';
    height?: string;
    refreshInterval?: number;
    authToken: string;  // Add this line - notice it's required, not optional
}

const GrafanaDashboard: React.FC<GrafanaDashboardProps> = ({ 
    dashboardUrl,
    orgId = "1",
    panelId = "1",
    theme = "dark",
    height = "400px",
    refreshInterval = 0,  // 0 means no auto-refresh
    authToken
  }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [key, setKey] = useState<number>(0); // Used to force iframe refresh
  
    // Secure URL construction with validation
    const constructUrl = useCallback(() => {
        try {
            const baseUrl = new URL(dashboardUrl);
            const timeRange = {
                from: 'now-6h',
                to: 'now'
            };

            baseUrl.searchParams.set('orgId', orgId);
        baseUrl.searchParams.set('from', 'now-6h');
        baseUrl.searchParams.set('to', 'now');
        baseUrl.searchParams.set('timezone', 'browser');
        baseUrl.searchParams.set('var-interval', '$__auto');
        baseUrl.searchParams.set('var-DS_PROMETHEUS', 'aecry96qo5m9sf');
        baseUrl.searchParams.set('var-namespace', '');
        baseUrl.searchParams.set('var-release', '');
        baseUrl.searchParams.set('var-instance', 'postgres_exporter:9187');
        baseUrl.searchParams.set('var-datname', '$__all');
        baseUrl.searchParams.set('var-mode', '$__all');
        baseUrl.searchParams.set('refresh', '10s');
        baseUrl.searchParams.set('panelId', panelId);
        baseUrl.searchParams.set('__feature.dashboardSceneSolo', 'true');
        baseUrl.searchParams.set('auth_token', authToken);

        // For embedding, we should use the embed view
        baseUrl.pathname = baseUrl.pathname.replace('/d/', '/d-solo/');

            return baseUrl.toString();
        } catch (err) {
            setError('Invalid dashboard URL provided');
            return '';
        }
    }, [dashboardUrl, orgId, panelId, theme, authToken]);

    // Auto-refresh logic
    useEffect(() => {
        if (!refreshInterval) return;
        
        const intervalId = setInterval(() => {
            setKey(prev => prev + 1);
        }, refreshInterval * 1000);

        return () => clearInterval(intervalId);
    }, [refreshInterval]);
  
    const handleIframeLoad = () => {
      setIsLoading(false);
    };
  
    const handleIframeError = () => {
      setError('Failed to load Grafana dashboard');
      setIsLoading(false);
    };
  
    const handleRefresh = () => {
      setIsLoading(true);
      setError(null);
      setKey(prev => prev + 1); // Force iframe reload
    };
  
    return (
      <Paper elevation={2} sx={{ position: 'relative' }}>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          {/* <Typography variant="h6">Metrics Dashboard</Typography> */}
          <Box>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton size="small">
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
  
        <CardContent>
          {isLoading && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
  
          <Box sx={{ 
            position: 'relative',
            height: height,
            bgcolor: theme === 'dark' ? 'grey.900' : 'grey.100'
          }}>
            <iframe
              key={key}
              src={constructUrl()}
              width="100%"
              height="100%"
              frameBorder="0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </Box>
        </CardContent>
      </Paper>
    );
  };
  
  export default GrafanaDashboard;