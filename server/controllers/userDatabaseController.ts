import { NextFunction, Request, RequestHandler, Response } from 'express';
// import { ServerError } from '../../types/types.ts';
import pg from 'pg';

type userDatabaseController = {
  connectDB: RequestHandler;
};

const userDatabaseController: userDatabaseController = {
  connectDB: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { uri_string, query } = req.body;

    if (!uri_string || !query) {
      console.log('Missing uri string or query.');
      res.status(400).json({ message: 'uri string and query is required.' });
      return;
    }
    const { Pool } = pg;
    try {
      console.log('Connecting to users database...');
      const pool = new Pool({
        connectionString: uri_string,
      });

      // const result = await pool.query(`EXPLAIN ANALYZE ${query}`);

      const result = await pool.query(
        `EXPLAIN (ANALYZE true, COSTS true, SETTINGS true) ${query}`
      );

      // not formatted
      // const result = await pool.query(
      //   'EXPLAIN (ANALYZE true, COSTS true, SETTINGS true, BUFFERS true, WAL true, SUMMARY true)' +
      //     `${query}`
      // );

      // formatted
      // const result = await pool.query(
      //   'EXPLAIN (ANALYZE true, COSTS true, SETTINGS true, BUFFERS true, WAL true, SUMMARY true, FORMAT JSON)' +
      //     `${query}`
      // );

      // const explainResults = result.rows[0].explain;
      // const explainResults = result.rows.map((row) => row['QUERY PLAN']);
      const explainResults = result.rows;
      res.locals.queryMetrics = explainResults;

      // logging explainResults testing
      console.log('Query Metrics:', explainResults);

      return next();
    } catch (err) {
      console.error('Error running query', err);
      return next({
        log: 'Error in connectDB middleware',
        status: 500,
        message: { err: 'Failed to get query metrics from db' },
      });
    }
  },
};

export default userDatabaseController;
