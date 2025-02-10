import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Health check endpoint - useful for monitoring
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});


router.get('/traces', async (req, res) => {
    try {
      const response = await fetch('http://localhost:16686/api/traces?service=queryhawk&limit=20');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch traces' });
    }
  });

// Example protected route that requires error handling
router.get('/protected', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate authentication check
    const isAuthenticated = false;
    if (!isAuthenticated) {
      throw new Error('Unauthorized access');
    }
    res.json({ data: 'Protected data' });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

export default router;
