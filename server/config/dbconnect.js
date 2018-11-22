import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { TEST_DATABASE_URL: testDb, DATABASE_URL: db } = process.env;

const string = process.env.NODE_ENV === 'test' ? testDb : db;

const pool = new Pool({
  connectionString: string,
});

export default (text, params) => pool.query(text, params);
