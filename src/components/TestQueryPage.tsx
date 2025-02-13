// src/TestQueryPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

interface QueryMetrics {
  executionTime: number;
  planningTime: number;
  rowsReturned: number;
  actualLoops: number;
  sharedHitBlocks: number;
  sharedReadBlocks: number;
  workMem: number;
  cacheHitRatio: number;
  startupCost: number;
  totalCost: number;
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
        body: JSON.stringify({ uri_string, query }),
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
          <Typography variant='h6' gutterBottom>
            Query Metrics
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align='right'>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Planning Time</TableCell>
                  <TableCell align='right'>
                    {queryMetrics.planningTime.toFixed(2)} ms
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Execution Time</TableCell>
                  <TableCell align='right'>
                    {Math.floor(queryMetrics.executionTime).toLocaleString()} ms
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Rows Returned</TableCell>
                  <TableCell align='right'>
                    {queryMetrics.rowsReturned.toLocaleString()}
                  </TableCell>
                </TableRow>

                {/* <TableRow>
                  <TableCell>Work Memory</TableCell>
                  <TableCell align='right'>{queryMetrics.workMem} KB</TableCell>
                </TableRow> */}

                <TableRow>
                  <TableCell>Number of Loops</TableCell>
                  <TableCell align='right'>
                    {queryMetrics.actualLoops}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Shared Hit Blocks</TableCell>
                  <TableCell align='right'>
                    {queryMetrics.sharedHitBlocks.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Shared Read Blocks</TableCell>
                  <TableCell align='right'>
                    {queryMetrics.sharedReadBlocks.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Cache Hit Ratio</TableCell>
                  <TableCell align='right'>
                    {queryMetrics.cacheHitRatio}%
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Startup Cost</TableCell>
                  <TableCell align='right'>
                    {Math.floor(queryMetrics.startupCost).toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Total Cost</TableCell>
                  <TableCell align='right'>
                    {Math.floor(queryMetrics.totalCost).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default TestQueryPage;
