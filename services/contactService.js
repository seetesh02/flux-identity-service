const { executeQuery, executeUpdate } = require('../database/connection');

/**
 * Find existing contacts by email or phone
 */
async function findExistingContacts(email, phoneNumber) {
  const conditions = [];
  const params = [];
  
  if (email) {
    conditions.push('email = ?');
    params.push(email);
  }
  
  if (phoneNumber) {
    conditions.push('phoneNumber = ?');
    params.push(phoneNumber);
  }
  
  if (conditions.length === 0) {
    return [];
  }
  
  const sql = `
    SELECT * FROM Contact 
    WHERE (${conditions.join(' OR ')}) 
    AND deletedAt IS NULL 
    ORDER BY createdAt ASC
  `;
  
  return await executeQuery(sql, params);
}

/**
 * Create a new contact record
 */
async function createContact(email, phoneNumber, linkedId = null, precedence = 'primary') {
  const sql = `
    INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;
  
  const result = await executeUpdate(sql, [email, phoneNumber, linkedId, precedence]);
  return result.id;
}

/**
 * Update contact to secondary with linked ID
 */
async function updateContactToSecondary(contactId, linkedId) {
  const sql = `
    UPDATE Contact 
    SET linkedId = ?, linkPrecedence = 'secondary', updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  await executeUpdate(sql, [linkedId, contactId]);
}

/**
 * Get all contacts linked to a primary contact
 */
async function getLinkedContacts(primaryId) {
  const sql = `
    SELECT * FROM Contact 
    WHERE (id = ? OR linkedId = ?) 
    AND deletedAt IS NULL 
    ORDER BY 
      CASE WHEN linkPrecedence = 'primary' THEN 0 ELSE 1 END,
      createdAt ASC
  `;
  
  return await executeQuery(sql, [primaryId, primaryId]);
}

/**
 * Get primary contact ID from any contact ID
 */
async function getPrimaryContactId(contactId) {
  const sql = `
    SELECT 
      CASE 
        WHEN linkPrecedence = 'primary' THEN id
        ELSE linkedId
      END as primaryId
    FROM Contact 
    WHERE id = ? AND deletedAt IS NULL
  `;
  
  const result = await executeQuery(sql, [contactId]);
  return result.length > 0 ? result[0].primaryId : null;
}

/**
 * Consolidate contact information into response format
 */
function consolidateContactData(contacts) {
  if (!contacts || contacts.length === 0) {
    return null;
  }
  
  // Find primary contact
  const primaryContact = contacts.find(c => c.linkPrecedence === 'primary');
  if (!primaryContact) {
    return null;
  }
  
  // Collect all emails and phone numbers
  const emailSet = new Set();
  const phoneSet = new Set();
  const secondaryIds = [];
  
  contacts.forEach(contact => {
    if (contact.email) {
      emailSet.add(contact.email);
    }
    if (contact.phoneNumber) {
      phoneSet.add(contact.phoneNumber);
    }
    if (contact.linkPrecedence === 'secondary') {
      secondaryIds.push(contact.id);
    }
  });
  
  // Ensure primary contact's data is first
  const emails = [];
  const phoneNumbers = [];
  
  if (primaryContact.email) {
    emails.push(primaryContact.email);
    emailSet.delete(primaryContact.email);
  }
  if (primaryContact.phoneNumber) {
    phoneNumbers.push(primaryContact.phoneNumber);
    phoneSet.delete(primaryContact.phoneNumber);
  }
  
  // Add remaining emails and phones
  emails.push(...Array.from(emailSet));
  phoneNumbers.push(...Array.from(phoneSet));
  
  return {
    primaryContatctId: primaryContact.id,
    emails: emails,
    phoneNumbers: phoneNumbers,
    secondaryContactIds: secondaryIds.sort((a, b) => a - b)
  };
}

/**
 * Handle contact merging when two primary contacts are found
 */
async function mergePrimaryContacts(contact1, contact2) {
  // Determine which contact should remain primary (older one)
  const olderContact = new Date(contact1.createdAt) <= new Date(contact2.createdAt) ? contact1 : contact2;
  const newerContact = olderContact === contact1 ? contact2 : contact1;
  
  // Update newer contact to secondary
  await updateContactToSecondary(newerContact.id, olderContact.id);
  
  // Update all contacts linked to newer contact
  const sql = `
    UPDATE Contact 
    SET linkedId = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE linkedId = ? AND deletedAt IS NULL
  `;
  
  await executeUpdate(sql, [olderContact.id, newerContact.id]);
  
  return olderContact.id;
}

module.exports = {
  findExistingContacts,
  createContact,
  updateContactToSecondary,
  getLinkedContacts,
  getPrimaryContactId,
  consolidateContactData,
  mergePrimaryContacts
};