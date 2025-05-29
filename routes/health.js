const express = require('express');
const { getDatabase } = require('../database/connection');

const router = express.Router();

/**
 * GET /api/v1/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  try {
    const database = getDatabase();
    const healthStatus = {
      status: 'healthy',
      service: 'FluxKart Identity Service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: database ? 'connected' : 'disconnected',
      version: '1.0.0'
    };
    
    res.status(200).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'FluxKart Identity Service',
      timestamp: new Date().toISOString(),
      error: 'Database connection issue'
    });
  }
});

/**
 * GET /api/v1/status
 * Detailed status endpoint
 */
router.get('/status', (req, res) => {
  const statusInfo = {
    service: 'FluxKart Identity Service',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    },
    uptime: {
      seconds: Math.floor(process.uptime()),
      human: Math.floor(process.uptime() / 60) + ' minutes'
    },
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(statusInfo);
});

module.exports = router;