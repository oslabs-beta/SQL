// src/TestQueryPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';

interface QueryMetrics {
  executionTime: number;
  planningTime: number;
  rowsReturned: number;
  memoryUsage: number;
  cacheHitRatio: number;
}
const TestQueryPage: React.FC = () => {
  const [uri_string, setUri_string] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryMetrics, setQueryMetrics] = useState<QueryMetrics | null>(null);

  // Function to handle the button click and fetch metrics
  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    setQueryMetrics(null);

    try {
      // when we fetch have to fetch our back end in the container. (4002)
      const response = await fetch('http://localhost:4002/api/query-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uri_string, query }), //
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data: QueryMetrics = await response.json(); // Type the response as MetricsResponse
      setQueryMetrics(data);
    } catch (err) {
      setError('Error fetching metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant='h5'>Connect to Database</Typography>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          label='Database URI'
          variant='outlined'
          fullWidth
          value={uri_string}
          onChange={(e) => setUri_string(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          label='Query'
          variant='outlined'
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button
        variant='contained'
        color='primary'
        onClick={fetchMetrics}
        disabled={loading || !uri_string || !query}
      >
        {loading ? (
          <CircularProgress size={24} color='inherit' />
        ) : (
          'Fetch Metrics'
        )}
      </Button>

      {error && (
        <Typography color='error' style={{ marginTop: '10px' }}>
          {error}
        </Typography>
      )}

      {queryMetrics && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant='h6'>Fetched Metrics:</Typography>
          <pre>{JSON.stringify(queryMetrics, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestQueryPage;
