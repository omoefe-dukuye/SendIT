import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: 'postgres://czdovici:XcuWDGo0NA_moPDLotKnA6GD3ZkKD_FR@elmer.db.elephantsql.com:5432/czdovici',
});

export default (text, params) => pool.query(text, params);
