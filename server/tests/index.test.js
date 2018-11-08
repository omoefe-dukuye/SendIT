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

describe('GET /api/v1/parcels', () => {
  it('Should get all orders', (done) => {
    request(app)
      .get('/api/v1/parcels')
      .expect(200)
      .expect((res) => {
        if (db[0]) {
          return expect(res.body.orders.length).to.equal(dbLength);
        }
        return expect(res.body.message).to.equal('No orders to retrieve.');
      })
      .end(done);
  });
});


describe('GET /api/v1/parcels/:parcelId', () => {
  it('Should get specific order if ID exists', (done) => {
    const id = dbLength + 1;
    db.push({
      id,
      pickupLocation: 'Benin',
      destination: 'Andela',
      description: 'Omoefe',
    });
    request(app)
      .get(`/api/v1/parcels/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.order.id).to.equal(id);
      })
      .end((err) => {
        if (err) {
          db.pop();
          return done(err);
        }
        db.pop();
        return done();
      });
  });

  it('Should throw error if ID does not exist', (done) => {
    request(app)
      .get(`/api/v1/parcels/${db.length + 100}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.success).to.equal(false);
      })
      .end(done);
  });
});


describe('PUT /api/v1/parcels/:parcelId/cancel', () => {
  it('Should set status to "cancelled" if ID exists', (done) => {
    const id = db.length + 1;
    db.push({
      id,
      pickupLocation: 'Benin',
      destination: 'Andela',
      description: 'Omoefe',
    });
    request(app)
      .put(`/api/v1/parcels/${id}/cancel`)
      .expect(200)
      .expect((res) => {
        expect(res.body.success).to.equal(true);
      })
      .end((err) => {
        if (err) {
          db.pop();
          return done(err);
        }
        expect(db[id - 1].status).to.equal('cancelled');
        db.pop();
        return done();
      });
  });

  it('Should throw error if ID does not exist', (done) => {
    const id = db.length;
    request(app)
      .put(`/api/v1/parcels/${id}/cancel`)
      .expect(404)
      .expect((res) => {
        expect(res.body.success).to.equal(false);
      })
      .end(done);
  });
});
