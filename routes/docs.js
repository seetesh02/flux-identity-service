const express = require('express');
const path = require('path');

const router = express.Router();

/**
 * GET /docs
 * API Documentation page
 */
router.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/documentation.html'));
});

/**
 * GET /api-spec
 * JSON API specification
 */
router.get('/api-spec', (req, res) => {
  const apiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'FluxKart Identity Service API',
      version: '1.0.0',
      description: 'Contact reconciliation service for FluxKart e-commerce platform',
      contact: {
        name: 'FluxKart Engineering',
        url: 'https://github.com/seetesh02/flux-identity-service'
      }
    },
    servers: [
      {
        url: req.protocol + '://' + req.get('host'),
        description: 'Current server'
      }
    ],
    paths: {
      '/api/v1/identify': {
        post: {
          summary: 'Identify and consolidate contacts',
          description: 'Main endpoint for contact reconciliation and identity linking',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'customer@fluxkart.com'
                    },
                    phoneNumber: {
                      type: 'string',
                      example: '1234567890'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Contact successfully identified and consolidated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      contact: {
                        type: 'object',
                        properties: {
                          primaryContatctId: { type: 'integer' },
                          emails: {
                            type: 'array',
                            items: { type: 'string' }
                          },
                          phoneNumbers: {
                            type: 'array',
                            items: { type: 'string' }
                          },
                          secondaryContactIds: {
                            type: 'array',
                            items: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/health': {
        get: {
          summary: 'Health check',
          description: 'Check service health and database connectivity',
          responses: {
            200: {
              description: 'Service is healthy'
            }
          }
        }
      }
    }
  };
  
  res.json(apiSpec);
});

module.exports = router;