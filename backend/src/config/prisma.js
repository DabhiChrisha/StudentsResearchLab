require('dotenv').config();
const { PrismaClient } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,                   // limit concurrent connections to Neon's pool
  idleTimeoutMillis: 30000, // release idle connections after 30s
  connectionTimeoutMillis: 10000, // fail fast (10s) instead of hanging
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
