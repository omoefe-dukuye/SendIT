import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL: connectionString } = process.env;

const pool = new Pool({ connectionString });

export default (text, params) => pool.query(text, params);
