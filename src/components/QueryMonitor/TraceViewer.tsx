import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Alert,
  LinearProgress,
  Grid,
  IconButton
} from '@mui/material';
import { 
  Timeline as TimelineIcon, 
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon 
} from '@mui/icons-material';

interface Span {
  spanID: string;
  operationName: string;
  duration: number;
  depth: number;
  tags: Array<{ key: string; value: string }>;
}

interface Trace {
  traceID: string;
  duration: number;
  spans: Span[];
}

const TraceViewer: React.FC = () => {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const calculateTraceDuration = (spans: any[]): number => {
    if (!spans || spans.length === 0) return 0;
    const startTimes = spans.map(span => span.startTime);
    const endTimes = spans.map(span => span.startTime + span.duration);
    const traceStart = Math.min(...startTimes);
    const traceEnd = Math.max(...endTimes);
    return traceEnd - traceStart;
  };

  const calculateSpanDepth = (span: any, allSpans: any[]): number => {
    let depth = 0;
    let currentSpan = span;
    
    while (currentSpan.references && currentSpan.references.length > 0) {
      const parentSpanID = currentSpan.references[0].spanID;
      currentSpan = allSpans.find(s => s.spanID === parentSpanID);
      if (currentSpan) {
        depth++;
      } else {
        break;
      }
    }
    
    return depth;
  };

  const fetchTraces = async () => {
    try {
      setLoading(true);
      const now = Date.now() * 1000; // Convert to microseconds
      const lookback = 3600 * 1000 * 1000; // 1 hour in microseconds
      
      const params = new URLSearchParams({
        start: (now - lookback).toString(),
        end: now.toString(),
        service: 'queryhawk',
        limit: '20'
      });
  
      // Use a proxy URL that your dev server will forward
      const response = await fetch(`/jaeger/api/traces?${params}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Trace response error:', errorText);
        throw new Error(`Failed to fetch traces: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Raw response data:', data);

      // Handle the "API is working" response
      if (data.message === 'API is working!') {
        setError('Connected to API but no trace data available');
        setTraces([]);
        return;
      }

      // Validate the response format
      if (!data || !data.data) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid trace data format');
      }
      // Check for data array specifically
      if (!Array.isArray(data.data)) {
        console.error('Response missing data array:', data);
        throw new Error('Response missing trace data array');
      }
      
      const transformedTraces = data.data.map((trace: any) => ({
        traceID: trace.traceID,
        duration: calculateTraceDuration(trace.spans),
        spans: trace.spans.map((span: any) => ({
          spanID: span.spanID,
          operationName: span.operationName,
          duration: span.duration,
          depth: calculateSpanDepth(span, trace.spans),
          tags: span.tags || []
        }))
      }));
      
      setTraces(transformedTraces);
      setError(null);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error('Error in fetchTraces:', err);
      setError(err.message);
      setTraces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraces();
    const interval = setInterval(fetchTraces, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (duration: number): string => {
    return duration > 1000 ? `${(duration/1000).toFixed(2)}s` : `${duration}ms`;
  };

  return (
    <Grid container spacing={3}>
      {/* Debug Info Panel */}
      {(error || traces.length === 0) && (
        <Grid item xs={12}>
          <Card sx={{ mb: 2, bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Debug Information</Typography>
              <Box component="pre" sx={{ 
                p: 2, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                fontSize: '0.875rem'
              }}>
                Last Refresh: {lastRefresh || 'Never'}
                {'\n'}Trace Count: {traces.length}
                {'\n'}Loading State: {loading ? 'Yes' : 'No'}
                {'\n'}Error State: {error || 'None'}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Main Traces Card */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader 
            title={<Typography variant="h6">Query Traces</Typography>}
            avatar={<TimelineIcon color="primary" />}
            action={
              <IconButton 
                onClick={fetchTraces} 
                disabled={loading}
                size="small"
              >
                <RefreshIcon />
              </IconButton>
            }
          />
          <CardContent>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {traces.map((trace) => (
                <Box 
                  key={trace.traceID} 
                  sx={{ 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1, 
                    p: 2, 
                    mb: 2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1,
                    pb: 1,
                    borderBottom: 1,
                    borderColor: 'divider'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon fontSize="small" color="primary" />
                      <Typography variant="subtitle2">
                        {trace.spans[0]?.operationName || 'Unknown Operation'}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'primary.main',
                        bgcolor: 'primary.light',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      }}
                    >
                      {formatDuration(trace.duration)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    {trace.spans.map((span) => (
                      <Box 
                        key={span.spanID}
                        sx={{ 
                          pl: 2,
                          ml: span.depth * 2,
                          borderLeft: 2,
                          borderColor: 'primary.light',
                          mb: 1,
                          py: 0.5
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: span.depth === 0 ? 500 : 400 }}>
                            {span.operationName}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary',
                              bgcolor: 'action.hover',
                              px: 1,
                              py: 0.25,
                              borderRadius: 1
                            }}
                          >
                            {formatDuration(span.duration)}
                          </Typography>
                        </Box>
                        {span.tags?.length > 0 && (
                          <Box sx={{ mt: 0.5 }}>
                            {span.tags.map((tag) => (
                              <Typography 
                                key={tag.key}
                                component="span" 
                                variant="caption" 
                                sx={{ 
                                  color: 'text.secondary',
                                  mr: 1,
                                  display: 'inline-block',
                                  bgcolor: 'background.paper',
                                  px: 0.5,
                                  py: 0.25,
                                  borderRadius: 0.5,
                                  border: 1,
                                  borderColor: 'divider'
                                }}
                              >
                                {tag.key}: {tag.value}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Metrics Summary Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader 
            title={<Typography variant="h6">Trace Metrics</Typography>}
            avatar={<TimelineIcon color="primary" />}
          />
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Recent Traces
              </Typography>
              <Typography variant="h4">
                {traces.length}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Average Duration
              </Typography>
              <Typography variant="h4">
                {traces.length > 0 
                  ? formatDuration(traces.reduce((acc, t) => acc + t.duration, 0) / traces.length)
                  : '0ms'
                }
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Alert severity={loading ? "info" : error ? "error" : "success"} sx={{ mt: 1 }}>
                {loading ? "Fetching traces..." : error ? error : "System healthy"}
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TraceViewer;