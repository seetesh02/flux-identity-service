const express = require('express');
const Joi = require('joi');
const contactService = require('../services/contactService');

const router = express.Router();

// Validation schema
const identifySchema = Joi.object({
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().optional()
}).or('email', 'phoneNumber');

/**
 * POST /api/v1/identify
 * Main identity reconciliation endpoint
 */
router.post('/identify', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = identifySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed: ' + error.details[0].message,
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    const { email, phoneNumber } = value;
    
    // Find existing contacts
    const existingContacts = await contactService.findExistingContacts(email, phoneNumber);
    
    let primaryContactId;
    
    if (existingContacts.length === 0) {
      // No existing contacts - create new primary contact
      primaryContactId = await contactService.createContact(email, phoneNumber);
      
    } else if (existingContacts.length === 1) {
      // One existing contact found
      const existingContact = existingContacts[0];
      
      // Check if new information needs to be added
      const needsNewContact = (email && email !== existingContact.email) || 
                             (phoneNumber && phoneNumber !== existingContact.phoneNumber);
      
      if (needsNewContact) {
        // Create secondary contact linked to existing primary
        const existingPrimaryId = await contactService.getPrimaryContactId(existingContact.id);
        await contactService.createContact(email, phoneNumber, existingPrimaryId, 'secondary');
        primaryContactId = existingPrimaryId;
      } else {
        // Return existing contact information
        primaryContactId = await contactService.getPrimaryContactId(existingContact.id);
      }
      
    } else {
      // Multiple contacts found - check for different primary contacts
      const primaryContacts = existingContacts.filter(c => c.linkPrecedence === 'primary');
      
      if (primaryContacts.length >= 2) {
        // Need to merge primary contacts
        primaryContactId = await contactService.mergePrimaryContacts(
          primaryContacts[0], 
          primaryContacts[1]
        );
      } else {
        // Get the primary contact ID
        primaryContactId = primaryContacts.length > 0 
          ? primaryContacts[0].id 
          : await contactService.getPrimaryContactId(existingContacts[0].id);
      }
    }
    
    // Get all linked contacts and consolidate response
    const allLinkedContacts = await contactService.getLinkedContacts(primaryContactId);
    const consolidatedData = contactService.consolidateContactData(allLinkedContacts);
    
    // Send response
    res.status(200).json({
      contact: consolidatedData
    });
    
  } catch (err) {
    console.error('Identity processing error:', err);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process identity request',
        code: 'PROCESSING_ERROR'
      }
    });
  }
});

module.exports = router;