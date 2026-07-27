import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the database file directory exists
const dbPath = path.resolve(__dirname, '..', process.env.DATABASE_URL || './database/fuel_finder.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Check if database needs initialization (if file doesn't exist or is empty)
const dbExists = fs.existsSync(dbPath) && fs.statSync(dbPath).size > 0;

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the SQLite database:', err.message);
  } else {
    console.log(`Connected to the SQLite database at: ${dbPath}`);
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON', (pragmaErr) => {
      if (pragmaErr) {
        console.error('Failed to enable foreign keys:', pragmaErr.message);
      } else {
        console.log('Foreign key support enabled.');
      }
    });

    // Auto-initialize if database is new
    if (!dbExists) {
      initializeDatabase();
    }
  }
});

function initializeDatabase() {
  console.log('New database detected. Running initialization schema and seed...');
  try {
    const schemaPath = path.resolve(__dirname, '..', 'database', 'schema.sql');
    const seedPath = path.resolve(__dirname, '..', 'database', 'seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    db.serialize(() => {
      // Execute schema
      db.exec(schemaSql, (err) => {
        if (err) {
          console.error('Error executing schema.sql:', err.message);
          return;
        }
        console.log('Database tables and indexes created successfully.');

        // Execute seed data
        db.exec(seedSql, (seedErr) => {
          if (seedErr) {
            console.error('Error executing seed.sql:', seedErr.message);
            return;
          }
          console.log('Database seeded successfully.');
        });
      });
    });
  } catch (err) {
    console.error('Failed to read schema or seed SQL files:', err.message);
  }
}

export default db;
