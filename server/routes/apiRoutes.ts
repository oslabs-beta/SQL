import express, { Request, Response } from 'express';
import userDatabaseController from '../controllers/userDatabaseController';

const router = express.Router();

router.post(
  '/query-metrics',
  userDatabaseController.connectDB,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.queryMetrics);
  }
);

export default router;
