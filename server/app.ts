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

app.use('/api', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});
// we call collectDefaultMetrics to get default metrics
// const collectDefaultMetrics = client.collectDefaultMetrics;

// //A registry is like a container that holds all our metrics
// //the registry stores different metric types like counters and histograms
// //it also formats them for prometheus to read
// //and the registry also exposes them at the /metrics endpoint
// //it's like a central collection point. all metrics must be registered to be exposed to prometheus
// // Create a Registry to collect metrics
// //this is basically our "metrics exporter" for node.js
// const register = new client.Registry();

// // Optional: collect default Node.js metrics
// //these are memory/cpu usage, event loop timing, active requests
// //they are for monitoring node.js server health

// collectDefaultMetrics({ register });

// //Custom Metrics
// // Define your custom metric, e.g., a counter for user visits
// //Counters
// const userVisitCounter = new client.Counter({
//   name: 'user_visits_total',
//   help: 'Total number of user visits',
//   registers: [register],
// });

// const queryCounter = new Counter({
//   name: 'sql_queries_total',
//   help: 'Total SQL queries executed',
//   registers: [register],
// });

// // Total HTTP requests by endpoint and method
// const httpRequestCounter = new client.Counter({
//   name: 'http_requests_total',
//   help: 'Total number of HTTP requests',
//   labelNames: ['method', 'endpoint', 'status'],
//   registers: [register],
// });

// // Request duration histogram
// const httpRequestDuration = new client.Histogram({
//   name: 'http_request_duration_seconds',
//   help: 'Duration of HTTP requests in seconds',
//   labelNames: ['method', 'endpoint'],
//   registers: [register],
// });

// //middleware for request-level metrics:
// app.use((req, res, next) => {
//   const start = Date.now();

//   // Modify the response end method
//   res.on('finish', () => {
//     const duration = Date.now() - start;
//     console.log(`${req.method} ${req.path} - ${duration}ms`);
//   });

//   next();
// });

// const queryDuration = new Histogram({
//   name: 'sql_query_duration_seconds',
//   help: 'Query execution time in seconds',
// });
// // Register the metric with Prometheus registry

// //Error tracking
// const errorCounter = new Counter({
//   name: 'errors_total',
//   help: 'Total number of errors',
//   registers: [register],
// });

// register.registerMetric(userVisitCounter);
// // register.registerMetric(queryCounter);
// // register.registerMetric(queryDuration);

// //Endpoints!
// // collectDefaultMetrics();
// // Expose the metrics endpoint
// app.get('/metrics', async (req, res) => {
//   res.set('Content-Type', register.contentType);
//   res.end(await client.register.metrics());
// });

// // Example endpoint to increment the counter (you can add more metrics as required)
// app.get('/user-visit', (req, res) => {
//   userVisitCounter.inc();
//   res.send('User visit recorded');
// });

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
