import { expect } from 'chai';
import request from 'supertest';

import db from '../db/db';
import app from '../index';

const dbLength = db.length;

describe('POST /api/v1/parcels', () => {
  it('Should create a new order if all fields are filled', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        pickupLocation: 'UBTH, Benin',
        destination: 'Andela Epic Tower, 235 Ikorodu road, Lagos',
        description: 'MacBook, 10',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).to.equal(true);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(db.length).to.equal(dbLength + 1);
        db.pop();
        return done();
      });
  });

  it('Should not create if field(s) are missing', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({ description: 'MacBook, 10' })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(false);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(db.length).to.equal(dbLength);
        return done();
      });
  });
});
