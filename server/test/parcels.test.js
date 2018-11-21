import chaiHttp from 'chai-http';
import chai from 'chai';
import { describe } from 'mocha';
import app from '../index';
import createAdmin from './seed/seed';

chai.use(chaiHttp);
chai.should();
createAdmin();

/** Class for creating parcels */
class Parcel {
  /**
   *
   * @param {String} weight parcel weight
   * @param {String} location parcel location
   * @param {String} destination parcel destination
   */
  constructor(weight, location, destination) {
    this.location = location;
    this.weight = weight;
    this.destination = destination;
  }
}

const admin = { email: 'chubi.best@gmail.com', password: 'chubibest' };
const user1 = { email: 'baloney@gmail.com', password: 'blaaaan' };
const user2 = { email: 'gokuirayol@gmail.com', password: 'batistuta' };
const parcel1 = new Parcel('49', 'ogba lagos', 'ikorodu lagos');
const parcel2 = new Parcel('49', 'ikorodu lagos');
const parcelShort = new Parcel('49', 'ogba lagos', 'lag');
const parcelWrongLoc = new Parcel('49', 'lag&^%$%^&*(%$)(*&  ^&^', 'ogba lagos');
const parcelWrongDest = new Parcel('49', 'ogba lagos', 'lag&^%$%^&*(%$)(*&  ^&^');
const parcelToMars = new Parcel('49', 'ogba lagos', 'obarisiadjdaaasgadslljhaelr');
const parcelfromMars = new Parcel('49', 'obarisiadjdaaasgadslljhaelr', 'ogba lagos');
const parcelWeight = new Parcel('hyju', 'ogba lagos', 'ikorodu lagos');

describe('Parcel routes', () => {
  describe('POST /api/v1/parcels', () => {
    it('should report 401 on users not logged in', async () => {
      const res = await chai.request(app)
        .post('/api/v1/parcels')
        .send(user1);
      res.should.have.status(401);
    });

    it('should throw a 400 for invalid token', async () => {
      const res = await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', 'baloney')
        .send(parcel1);
      res.should.have.status(400);
    });

    it('should create order for logged in user', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2);
      res.body.data[0].should.have.property('token');
      const res2 = await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', res.body.data[0].token)
        .send(parcel1);
      res2.should.have.status(201);
    });

    it('should not create when feild is omitted', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .post('/api/v1/parcels')
            .set('x-auth', res.body.data[0].token)
            .send(parcel2)
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });

    it('should not create if destination is too concise', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .post('/api/v1/parcels')
            .set('x-auth', res.body.data[0].token)
            .send(parcelShort)
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });

    it('should not create if illegal characters are used for location', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .post('/api/v1/parcels')
            .set('x-auth', res.body.data[0].token)
            .send(parcelWrongDest)
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });

    it('should not create if illegal characters are used for destination', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .post('/api/v1/parcels')
            .set('x-auth', res.body.data[0].token)
            .send(parcelWrongLoc)
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });

    it('should not create if non integers are used for weight', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .post('/api/v1/parcels')
            .set('x-auth', res.body.data[0].token)
            .send(parcelWeight)
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });

    it('should not create if location is unknown', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .post('/api/v1/parcels')
            .set('x-auth', res.body.data[0].token)
            .send(parcelfromMars)
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });

    it('should not create if destination is unknown', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .post('/api/v1/parcels')
            .set('x-auth', res.body.data[0].token)
            .send(parcelToMars)
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });
  });


  describe('GET /api/v1/parcels', () => {
    it('should get all orders for logged in user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .get('/api/v1/parcels')
            .set('x-auth', res.body.data[0].token)
            .end((err, response) => {
              response.should.have.status(200);
              done();
            });
        });
    });
  });

  describe('GET /api/v1/parcels/parcelId', () => {
    it('should get particular order for logged in user', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2);

      const res2 = await chai.request(app)
        .get('/api/v1/parcels/1')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(200);
    });

    it('Should should throw a 404 if unassigned ID is supplied', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2);

      const res2 = await chai.request(app)
        .get('/api/v1/parcels/50')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(404);
    });
  });

  describe('PATCH /api/v1/parcels/:parcelId/destination', () => {
    it('Should change destination for authorized user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .patch('/api/v1/parcels/1/destination')
            .set('x-auth', res.body.data[0].token)
            .send({ destination: 'leicester city, london' })
            .end((err, response) => {
              response.should.have.status(200);
              done();
            });
        });
    });

    it('Should change not change destination if invalid', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .patch('/api/v1/parcels/1/destination')
            .set('x-auth', res.body.data[0].token)
            .send({ destination: 'leiyu[guf]^&*(*&itydddjkhyy' })
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });

    it('Should change not change destination if value not provided', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .patch('/api/v1/parcels/1/destination')
            .set('x-auth', res.body.data[0].token)
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });
  });

  describe('GET /api/v1/admin/parcels', () => {
    it('Should get all parcels in the app if admin', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin);
      res.body.data[0].should.have.property('token');
      const res2 = await chai.request(app)
        .get('/api/v1/admin/parcels/')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(200);
    });

    it('Should not get parcels if not admin', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2);
      res.body.data[0].should.have.property('token');
      const res2 = await chai.request(app)
        .get('/api/v1/admin/parcels/')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(401);
    });
  });

  describe('GET /api/v1/users/userId/parcels', async () => {
    it('Should get all parcels for particular user if admin', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin);

      const res2 = await chai.request(app)
        .get('/api/v1/users/2/parcels/')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(200);
    });

    it('Should indicate if there are no orders by the user', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin);
      res.body.data[0].should.have.property('token');

      await chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'Brozovic',
          lastName: 'Paul',
          username: 'papaya',
          email: 'barkley@gmail.com',
          password: 'batistuta',
        });

      const res2 = await chai.request(app)
        .get('/api/v1/users/3/parcels/')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(200);
      res2.body.data[0].should.eql('No Orders to retrieve');
    });

    it('Should not be accessed by non admins', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2);
      res.body.data[0].should.have.property('token');

      const res2 = await chai.request(app)
        .get('/api/v1/users/2/parcels/')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(401);
    });
  });

  describe('/api/v1/parcels/:parcelId/currentlocation', () => {
    it('Should change location if admin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .patch('/api/v1/parcels/1/currentlocation')
            .set('x-auth', res.body.data[0].token)
            .send({ location: 'manchester city, london' })
            .end((err, response) => {
              response.should.have.status(200);
              done();
            });
        });
    });

    it('Should change not change location if invalid', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .patch('/api/v1/parcels/1/currentlocation')
            .set('x-auth', res.body.data[0].token)
            .send({ location: 'man' })
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });

    it('Should change not change location if value not provided', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .patch('/api/v1/parcels/1/currentlocation')
            .set('x-auth', res.body.data[0].token)
            .end((err, response) => {
              response.should.have.status(400);
              done();
            });
        });
    });

    it('Should not change location if not admin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2)
        .then((res) => {
          res.body.data[0].should.have.property('token');
          chai.request(app)
            .patch('/api/v1/parcels/1/currentlocation')
            .set('x-auth', res.body.data[0].token)
            .send({ location: 'manchester city, london' })
            .end((err, response) => {
              response.should.have.status(401);
              done();
            });
        });
    });
  });

  describe('/api/v1/parcels/:parcelId/status', () => {
    it('Should change status if admin', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin);

      const res2 = await chai.request(app)
        .patch('/api/v1/parcels/1/status')
        .set('x-auth', res.body.data[0].token)
        .send({ status: 'in-transit' });
      res2.should.have.status(200);
    });

    it('Should not change status if not admin', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2);

      const res2 = await chai.request(app)
        .patch('/api/v1/parcels/1/status')
        .set('x-auth', res.body.data[0].token)
        .send({ status: 'in-transit' });
      res2.should.have.status(401);
    });

    it('Should throw error on invalid status', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin);

      const res2 = await chai.request(app)
        .patch('/api/v1/parcels/1/status')
        .set('x-auth', res.body.data[0].token)
        .send({ status: 'baloney' });
      res2.should.have.status(400);
    });
  });

  describe('PATCH /api/v1/parcels/:parcelId/cancel', () => {
    it('Should cancel order for authorized user', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2);
      res.body.data[0].should.have.property('token');

      const res2 = await chai.request(app)
        .patch('/api/v1/parcels/1/cancel')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(200);
    });

    it('Should not cancel delivered parcels', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin);

      await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', res.body.data[0].token)
        .send(parcel1);

      await chai.request(app)
        .patch('/api/v1/parcels/2/status')
        .set('x-auth', res.body.data[0].token)
        .send({ status: 'delivered' });

      const res2 = await chai.request(app)
        .patch('/api/v1/parcels/2/cancel')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(409);
    });

    it('Should not be able to change status of delivered order', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin);

      const res2 = await chai.request(app)
        .patch('/api/v1/parcels/2/status')
        .set('x-auth', res.body.data[0].token)
        .send({ status: 'created' });
      res2.should.have.status(409);
    });

    it('Should should throw a 404 if unassigned ID is supplied', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2);

      const res2 = await chai.request(app)
        .patch('/api/v1/parcels/3/cancel')
        .set('x-auth', res.body.data[0].token);
      res2.should.have.status(404);
    });

    it('Should not change location if admin and order cancelled', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(admin);
      res.body.data[0].should.have.property('token');

      const res2 = await chai.request(app)
        .patch('/api/v1/parcels/1/currentlocation')
        .set('x-auth', res.body.data[0].token)
        .send({ location: 'manchester city, london' });
      res2.should.have.status(404);
    });

    it('Should not change destination for cancelled order', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(user2);
      res.body.data[0].should.have.property('token');

      const res2 = await chai.request(app)
        .patch('/api/v1/parcels/1/destination')
        .set('x-auth', res.body.data[0].token)
        .send({ destination: 'leicester city, london' });
      res2.should.have.status(404);
    });
  });
});
