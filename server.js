const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import route modules
const identityRoutes = require('./routes/identity');
const healthRoutes = require('./routes/health');
const docsRoutes = require('./routes/docs');

// Import database initialization
const { initializeDatabase } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 4000;

// Security and logging middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
initializeDatabase();

// API Routes
app.use('/api/v1', identityRoutes);
app.use('/api/v1', healthRoutes);
app.use('/', docsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'FluxKart Identity Service',
    version: '1.0.0',
    description: 'Advanced contact reconciliation system for FluxKart e-commerce platform',
    author: 'FluxKart Engineering Team',
    endpoints: {
      identify: 'POST /api/v1/identify',
      health: 'GET /api/v1/health',
      status: 'GET /api/v1/status',
      docs: 'GET /docs'
    },
    repository: 'https://github.com/seetesh02/flux-identity-service',
    deployment: 'Vercel Serverless',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error occurred',
      code: err.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND',
      availableEndpoints: [
        'POST /api/v1/identify',
        'GET /api/v1/health',
        'GET /api/v1/status',
        'GET /docs'
      ]
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 FluxKart Identity Service Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💡 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🔍 Identity API: http://localhost:${PORT}/api/v1/identify`);
  console.log(`📖 Documentation: http://localhost:${PORT}/docs`);
  console.log('✅ Ready to process contact reconciliation requests');
});

module.exports = app;