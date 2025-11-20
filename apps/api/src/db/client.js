import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { config } from '../config.js';
import fs from 'fs';
import path from 'path';

const dbPath = config.databaseUrl;
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export async function getDb() {
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT,
    github_id TEXT UNIQUE,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);

  await db.exec(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    repo_url TEXT,
    publish_url TEXT,
    custom_domain TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES users(id)
  );`);
  return db;
}
