/* eslint-disable no-console */
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const createParcelTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
    parcels(
      id UUID PRIMARY KEY,
        pickup_location TEXT NOT NULL,
        current_location TEXT NOT NULL,
        destination TEXT NOT NULL,
        description TEXT NOT NULL,
        distance VARCHAR(128) NOT NULL,
        status VARCHAR(128) NOT NULL,
        sender_id UUID NOT NULL,
        recipient_email VARCHAR(128) NOT NULL,
        created_date VARCHAR(128),
        modified_date VARCHAR(128),
        FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
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
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        role VARCHAR(128),
        created_date VARCHAR(128)
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
    SET role=$1
    WHERE id=$2`;
  pool.query(update, ['admin', id])
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
