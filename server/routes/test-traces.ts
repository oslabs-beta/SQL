import { Router } from 'express';
import { trace } from '@opentelemetry/api';

/* The Jaeger UI helps understand:
- How long each operation takes
- Which operations happen inside other operations
- Where problems might be occurring
- The flow of the application
There can be multiple levels of spans(grandparent → parent → child) to track complex operations in the application. */

// Create the router instance
const testTracesRouter = Router();

// Helper function to simulate some work
const simulateWork = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

testTracesRouter.get('/test-trace', async (req, res) => {
    // Get tracer instance
    const tracer = trace.getTracer('test-tracer');
    
    // This creates the main task (parent span) for the request
    const parentSpan = tracer.startSpan('parent-operation');
    
    try {
        // Add some attributes to our span
        parentSpan.setAttribute('test.attribute', 'test-value');
        
        // This creates a subtask (child span) within the main task
        await tracer.startActiveSpan('child-operation', async (childSpan) => {
            // Simulate some work
            await simulateWork(100);
            
            // Mark an important moment in our subtask
            childSpan.addEvent('work-completed');
            
            // End the subtask
            childSpan.end();
        });
        // Send response
        res.json({ message: '✅ Trace generated successfully!' });
    } catch (error) {
        // Record error in span
        parentSpan.recordException(error as Error);
        res.status(500).json({ error: 'Something went wrong' });
    } finally {
        // End the parent span
        parentSpan.end();
    }
});


export default testTracesRouter;