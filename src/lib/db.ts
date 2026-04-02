import { createClient } from '@libsql/client';
import crypto from 'crypto';

// Initialize the libSQL client for Turso (Compatible with serverless/edge environments)
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

// Helper to initialize schema on startup (since remote DB runs asynchronously)
export async function initializeDatabase() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      game_mode TEXT NOT NULL,
      console_type TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      status TEXT DEFAULT 'Confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      price_calculated INTEGER DEFAULT 150,
      user_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount INTEGER NOT NULL,
      category TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default admin if none exists
  const adminQuery: any = await db.execute('SELECT COUNT(*) as count FROM admins');
  if (adminQuery.rows[0].count === 0) {
    const hash = crypto.createHash('sha256').update('admin123').digest('hex');
    await db.execute({
      sql: 'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
      args: ['admin', hash]
    });
    console.log("Turso DB Seeded: Default Admin User created.");
  }
}

export default db;
