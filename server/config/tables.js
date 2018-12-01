/* eslint-disable no-console */
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL: connectionString } = process.env;

const pool = new Pool({ connectionString });

pool.on('connect', () => {
  console.log('connected to the db');
});

const createParcelTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
    parcels(
      id SERIAL PRIMARY KEY,
      placed_by INTEGER NOT NULL,
      weight NUMERIC NOT NULL,
      weight_metric TEXT DEFAULT 'kg',
      sent_on VARCHAR(128),
      delivered_on VARCHAR(128) DEFAULT 'not delivered yet',
      status VARCHAR(128) DEFAULT 'created',
      pickup_location TEXT NOT NULL,
      current_location TEXT NOT NULL,
      destination TEXT NOT NULL,
      distance VARCHAR(128) NOT NULL,
      distance_metric TEXT DEFAULT 'km',
      price VARCHAR(128) NOT NULL,
      FOREIGN KEY (placed_by) REFERENCES users (id) ON DELETE CASCADE
    )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
    users(
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(128) NOT NULL,
      last_name VARCHAR(128) NOT NULL,
      other_names VARCHAR(128),
      email VARCHAR(128) UNIQUE NOT NULL,
      username VARCHAR(128) UNIQUE NOT NULL,
      password VARCHAR(128) NOT NULL,
      registered VARCHAR(128),
      is_admin BOOLEAN DEFAULT 'no'
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};


const upgradeToAdmin = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  if (!rows[0]) {
    console.log('Invalid ID');
  }
  const update = `UPDATE users
    SET is_admin=$1
    WHERE id=$2`;
  pool.query(update, ['yes', id])
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropParcelTable = () => {
  const queryText = 'DROP TABLE IF EXISTS parcels';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createParcelTable,
  createUserTable,
  dropParcelTable,
  dropUserTable,
  upgradeToAdmin,
};

require('make-runnable');
