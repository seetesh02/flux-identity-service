const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Global database connection
let database = null;

/**
 * Initialize database connection and create tables
 */
function initializeDatabase() {
  const dbPath = process.env.NODE_ENV === 'production' 
    ? ':memory:' 
    : path.join(__dirname, '../data/contacts.db');
    
  database = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
      process.exit(1);
    }
    
    console.log('📊 Database connected successfully');
    createContactTable();
  });
}

/**
 * Create contact table with proper schema
 */
function createContactTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS Contact (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phoneNumber TEXT,
      email TEXT,
      linkedId INTEGER,
      linkPrecedence TEXT CHECK(linkPrecedence IN ('primary', 'secondary')) NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      deletedAt DATETIME DEFAULT NULL
    )
  `;
  
  database.run(createTableSQL, (err) => {
    if (err) {
      console.error('❌ Table creation failed:', err.message);
    } else {
      console.log('✅ Contact table ready');
    }
  });
}

/**
 * Execute SQL query with parameters
 */
function executeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    database.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Execute SQL insert/update and return info
 */
function executeUpdate(sql, params = []) {
  return new Promise((resolve, reject) => {
    database.run(sql, params, function(err) {
      if (err) {
        console.error('Database update error:', err.message);
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          changes: this.changes
        });
      }
    });
  });
}

/**
 * Get database instance
 */
function getDatabase() {
  if (!database) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return database;
}

/**
 * Close database connection
 */
function closeDatabase() {
  if (database) {
    database.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('📊 Database connection closed');
      }
    });
  }
}

module.exports = {
  initializeDatabase,
  executeQuery,
  executeUpdate,
  getDatabase,
  closeDatabase
};