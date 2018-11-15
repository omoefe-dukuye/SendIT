import { expect } from 'chai';
import request from 'supertest';

import data from '../data/data';
import app from '../index';

data.push({ // add test entry to data structure
  id: 1,
  user: 'Omoefe',
  pickupLocation: 'UBTH, Benin',
  currentLocation: 'UBTH, Benin',
  destination: '235 Ikorodu road, Lagos',
  recipientEmail: 'omoefe.dukuye@gmail.com',
  description: 'Human, 6"5"',
  status: 'created',
});

const dataLength = data.length;


describe('POST /api/v1/parcels', () => {
  it('Should create a new order if all fields are filled', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        location: 'UBTH, Benin',
        destination: 'Andela Epic Tower,  Ikorodu road, Lagos',
        email: 'omoefe.dukuye@gmail.com',
        description: 'lorem ipsum',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).to.equal(true);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength + 1); // check if entry is added to data structure
        data.pop();
        return done();
      });
  });

  it('Should convert address to standard', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        location: 'yaba lagos',
        destination: 'Andela Epic Tower,  Ikorodu road, Lagos',
        email: 'omoefe.dukuye@gmail.com',
        description: 'lorem ipsum',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.order.pickupLocation).to.equal('Yaba, Oworonshoki, Nigeria');
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength + 1); // confirm entry is added to data structure
        data.pop();
        return done();
      });
  });

  it('Should not create if field(s) are missing', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({ description: 'MacBook, 10' })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(undefined);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength); // confirm nothing is added to data structure
        return done();
      });
  });

  it('Should give error message if illegal characters are present', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        location: 'UBTH, Benin ***',
        destination: 'Andela Epic Tower,  Ikorodu road, Lagos',
        email: 'omoefe.dukuye@gmail.com',
        description: 'lorem ipsum',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(undefined);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength); // confirm nothing is added to data structure
        return done();
      });
  });

  it('Should give error message if location does not exist', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        location: 'fhdjdkkfkffh',
        destination: 'Andela Epic Tower,  Ikorodu road, Lagos',
        email: 'omoefe.dukuye@gmail.com',
        description: 'lorem ipsum',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(undefined);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength); // confirm nothing is added to data structure
        return done();
      });
  });

  it('Should give error message if destination does not exist', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        location: 'UBTH Benin',
        destination: 'hfjjdjshhhhh',
        email: 'omoefe.dukuye@gmail.com',
        description: 'lorem ipsum',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(undefined);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength); // confirm nothing is added to data structure
        return done();
      });
  });

  it('Should not create if field(s) are missing', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({ description: 'MacBook, 10' })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(undefined);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength); // confirm nothing is added to data structure
        return done();
      });
  });

  it('Should not create if location is not descriptive enough', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        location: 'UBTH',
        destination: 'Andela Epic Tower,  Ikorodu road, Lagos',
        email: 'omoefe.dukuye@gmail.com',
        description: 'lorem ipsum',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(undefined);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength); // confirm nothing is added to data structure
        return done();
      });
  });

  it('Should not create if destination is not descriptive enough', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        location: 'UBTH Benin',
        destination: 'Andela',
        email: 'omoefe.dukuye@gmail.com',
        description: 'lorem ipsum',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(undefined);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength); // confirm nothing is added to data structure
        return done();
      });
  });

  it('Should not create if descriptiion is too concise', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        location: 'UBTH Benin',
        destination: 'Andela Epic Tower,  Ikorodu road, Lagos',
        email: 'omoefe.dukuye@gmail.com',
        description: 'lorem',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(undefined);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength); // confirm nothing is added to data structure
        return done();
      });
  });

  it('Should not create if email is invalid', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send({
        location: 'UBTH Benin',
        destination: 'Andela Epic Tower,  Ikorodu road, Lagos',
        email: 'omoefe.dukuyegmail.com',
        description: 'lorem ipsum',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).to.equal(undefined);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        expect(data.length).to.equal(dataLength); // confirm nothing is added to data structure
        return done();
      });
  });
});

describe('GET /api/v1/parcels', () => {
  it('Should get orders if orders exist', (done) => {
    request(app)
      .get('/api/v1/parcels')
      .expect(200)
      .expect((res) => {
        expect(res.body.orders.length).to.equal(dataLength);
      })
      .end(done);
  });
  it('Should indicate, if there are no orders to display', (done) => {
    const dataCopy = data.splice(0, data.length); // empty data structure
    request(app)
      .get('/api/v1/parcels')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).to.equal('No orders to retrieve.');
        data.splice(0, 0, ...dataCopy); // restore data structure
      })
      .end(done);
  });
});


describe('GET /api/v1/parcels/:parcelId', () => {
  it('Should get specific order if ID exists', (done) => {
    request(app)
      .get('/api/v1/parcels/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.order.id).to.equal(1);
      })
      .end(done);
  });

  it('Should throw error if ID does not exist', (done) => {
    request(app)
      .get('/api/v1/parcels/10') // make request with bogus id
      .expect(404)
      .expect((res) => {
        expect(res.body.success).to.equal(false);
      })
      .end(done);
  });
});


describe('PUT /api/v1/parcels/:parcelId/cancel', () => {
  it('Should set status to "cancelled" if ID exists', (done) => {
    request(app)
      .put('/api/v1/parcels/1/cancel')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).to.equal(true);
      })
      .end(done);
  });

  it('Should throw error if ID does not exist', (done) => {
    request(app)
      .put('/api/v1/parcels/10/cancel') // make request with bogus id
      .expect(404)
      .expect((res) => {
        expect(res.body.success).to.equal(false);
      })
      .end(done);
  });
});


describe('GET /api/v1/users/:userId/parcels', () => {
  it('Should get all orders by user provided', (done) => {
    request(app)
      .get('/api/v1/users/Omoefe/parcels')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).to.equal(true);
      })
      .end(done);
  });

  it('Should throw error if user does not exist', (done) => {
    request(app)
      .get('/api/v1/users/1/parcels') // make request with bogus userID
      .expect(404)
      .expect((res) => {
        expect(res.body.success).to.equal(false);
      })
      .end(done);
  });
});

describe('GET /api/v1/', () => {
  it('Should display welcome page', (done) => {
    request(app)
      .get('/api/v1/')
      .expect(200)
      .expect((res) => {
        expect(res.text).to.be.a('string');
      })
      .end(done);
  });
});

describe('GET invalid route', () => {
  it('Should display error message', (done) => {
    request(app)
      .get('/api/v1/uhgkkj')
      .expect(404)
      .expect((res) => {
        expect(res.text).to.be.a('string');
      })
      .end(done);
  });
});
