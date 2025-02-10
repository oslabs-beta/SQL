import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { ServerError } from '../types/types.ts';
import client, { Counter, Histogram } from 'prom-client';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type'],
    // credentials: true, // Allow cookies and credentials
  })
);
app.use(express.json());

// we call collectDefaultMetrics to get default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;

// collectDefaultMetrics();
//A registry is like a container that holds all our metrics
//the registry stores different metric types like counters and histograms
//it also formats them for prometheus to read
//and the registry also exposes them at the /metrics endpoint
//it's like a central collection point. all metrics must be registered to be exposed to prometheus
// Create a Registry to collect metrics
const register = new client.Registry();

// Optional: collect default Node.js metrics
//these are memory/cpu usage, event loop timing, active requests
//they are for monitoring node.js server health

collectDefaultMetrics({ register });

// Define your custom metric, e.g., a counter for user visits
//Counters
const userVisitCounter = new client.Counter({
  name: 'user_visits_total',
  help: 'Total number of user visits',
  registers: [register],
});

const queryCounter = new Counter({
  name: 'sql_queries_total',
  help: 'Total SQL queries executed',
  registers: [register],
});
// const errorCounter = new Counter({
//   name: 'errors_total',
//   help: 'Total number of errors',
//   registers: [register],
// });
// //Histograms
const queryDuration = new Histogram({
  name: 'sql_query_duration_seconds',
  help: 'Query execution time in seconds',
});
// Register the metric with Prometheus registry

register.registerMetric(userVisitCounter);
register.registerMetric(queryCounter);
register.registerMetric(queryDuration);

// Expose the metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await client.register.metrics());
});

// Example endpoint to increment the counter (you can add more metrics as required)
app.get('/user-visit', (req, res) => {
  userVisitCounter.inc();
  res.send('User visit recorded');
});

// collectDefaultMetrics();
const errorHandler: ErrorRequestHandler = (
  err: ServerError,
  _req,
  res,
  _next
) => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj: ServerError = { ...defaultErr, ...err };
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
};

app.use(errorHandler);

export default app;
