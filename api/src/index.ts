import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { initializeDatabase } from './database';
import categories from './routes/categories';
import items from './routes/items';

const app = new Hono();

// CORS middleware
app.use('*', cors());

// Error handling middleware
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({
    success: false,
    error: 'Internal server error'
  }, 500);
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.route('/api/categories', categories);
app.route('/api/items', items);

// Initialize database and start server
try {
  initializeDatabase();
  console.log('Database initialized successfully');
  
  const port = 3001;
  console.log(`Server is running on port ${port}`);
  
  serve({
    fetch: app.fetch,
    port
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
