import chaiHttp from 'chai-http';
import chai from 'chai';
import { describe } from 'mocha';
import app from '../index';

chai.use(chaiHttp);
chai.should();
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

const admin = { username: 'chubibest', password: 'chubibest' };
const user1 = { username: 'baloney', password: 'blaaaan' };
const user2 = { username: 'aloha', password: 'batistuta' };
const parcel1 = new Parcel('49', 'ogba lagos', 'ikorodu lagos');
const parcel2 = new Parcel('49', 'ikorodu lagos');
const parcelShort = new Parcel('49', 'ogba lagos', 'lag');
const parcelWrongLoc = new Parcel('49', 'lag&^%$%^&*(%$)(*&  ^&^', 'ogba lagos');
const parcelWrongDest = new Parcel('49', 'ogba lagos', 'lag&^%$%^&*(%$)(*&  ^&^');
const parcelToMars = new Parcel('49', 'ogba lagos', 'obarisiadjdaaasgadslljhaelr');
const parcelfromMars = new Parcel('49', 'obarisiadjdaaasgadslljhaelr', 'ogba lagos');
const parcelWeight = new Parcel('hyju', 'ogba lagos', 'ikorodu lagos');
let adminToken;
let user2Token;

describe('Parcel routes', () => {
  before(async () => {
    const { body: { token: aToken } } = await chai.request(app)
      .post('/api/v1/auth/login')
      .send(admin);
    adminToken = aToken;

    const { body: { token: u2Token } } = await chai.request(app)
      .post('/api/v1/auth/login')
      .send(user2);
    user2Token = u2Token;
  });

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
        .post('/api/v1/parcels')
        .set('x-auth', user2Token)
        .send(parcel1);
      res.should.have.status(201);
    });

    it('should not create when feild is omitted', async () => {
      const { status } = await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', user2Token)
        .send(parcel2);
      status.should.eql(400);
    });

    it('should not create if destination is too concise', async () => {
      const { status } = await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', user2Token)
        .send(parcelShort);
      status.should.eql(400);
    });

    it('should not create if illegal characters are used for location', async () => {
      const { status } = await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', user2Token)
        .send(parcelWrongDest);
      status.should.eql(400);
    });

    it('should not create if illegal characters are used for destination', async () => {
      const { status } = await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', user2Token)
        .send(parcelWrongLoc);
      status.should.eql(400);
    });

    it('should not create if non integers are used for weight', async () => {
      const { status } = await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', user2Token)
        .send(parcelWeight);
      status.should.eql(400);
    });

    it('should not create if location is unknown', async () => {
      const { status } = await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', user2Token)
        .send(parcelfromMars);
      status.should.eql(400);
    });

    it('should not create if destination is unknown', async () => {
      const { status } = await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', user2Token)
        .send(parcelToMars);
      status.should.eql(400);
    });
  });


  describe('GET /api/v1/parcels', () => {
    it('should get all orders for logged in user', async () => {
      const { status } = await chai.request(app)
        .get('/api/v1/parcels')
        .set('x-auth', user2Token);
      status.should.eql(200);
    });
  });

  describe('GET /api/v1/parcels/parcelId', () => {
    it('should get particular order for logged in user', async () => {
      const res = await chai.request(app)
        .get('/api/v1/parcels/1')
        .set('x-auth', user2Token);
      res.should.have.status(200);
    });

    it('Should should throw a 404 if unassigned ID is supplied', async () => {
      const res = await chai.request(app)
        .get('/api/v1/parcels/50')
        .set('x-auth', user2Token);
      res.should.have.status(404);
    });
  });

  describe('PATCH /api/v1/parcels/:parcelId/destination', () => {
    it('Should change destination for authorized user', async () => {
      const { status } = await chai.request(app)
        .patch('/api/v1/parcels/1/destination')
        .set('x-auth', user2Token)
        .send({ destination: 'leicester city, london' });
      status.should.eql(200);
    });

    it('Should change not change destination if invalid', async () => {
      const { status } = await chai.request(app)
        .patch('/api/v1/parcels/1/destination')
        .set('x-auth', user2Token)
        .send({ destination: 'leiyu[guf]^&*(*&itydddjkhyy' });
      status.should.eql(400);
    });

    it('Should change not change destination if value not provided', async () => {
      const { status } = await chai.request(app)
        .patch('/api/v1/parcels/1/destination')
        .set('x-auth', user2Token);
      status.should.eql(400);
    });
  });

  describe('GET /api/v1/admin/parcels', () => {
    it('Should get all parcels in the app if admin', async () => {
      const res = await chai.request(app)
        .get('/api/v1/admin/parcels/')
        .set('x-auth', adminToken);
      res.should.have.status(200);
    });

    it('Should not get parcels if not admin', async () => {
      const res = await chai.request(app)
        .get('/api/v1/admin/parcels/')
        .set('x-auth', user2Token);
      res.should.have.status(401);
    });
  });

  describe('GET /api/v1/users/userId/parcels', async () => {
    it('Should get all parcels for particular user if admin', async () => {
      const res = await chai.request(app)
        .get('/api/v1/users/2/parcels/')
        .set('x-auth', adminToken);
      res.should.have.status(200);
    });

    it('Should indicate if there are no orders by the user', async () => {
      const { status, body: { message } } = await chai.request(app)
        .get('/api/v1/users/2/parcels/')
        .set('x-auth', adminToken);
      status.should.eql(200);
      message.should.eql('No Orders to retrieve');
    });

    it('Should not be accessed by non admins', async () => {
      const res = await chai.request(app)
        .get('/api/v1/users/2/parcels/')
        .set('x-auth', user2Token);
      res.should.have.status(401);
    });
  });

  describe('/api/v1/parcels/:parcelId/currentlocation', () => {
    it('Should change location if admin', async () => {
      const { status } = await chai.request(app)
        .patch('/api/v1/parcels/1/currentlocation')
        .set('x-auth', adminToken)
        .send({ location: 'manchester city, london' });
      status.should.eql(200);
    });

    it('Should change not change location if invalid', async () => {
      const { status } = await chai.request(app)
        .patch('/api/v1/parcels/1/currentlocation')
        .set('x-auth', adminToken)
        .send({ location: 'man' });
      status.should.eql(400);
    });

    it('Should change not change location if value not provided', async () => {
      const { status } = await chai.request(app)
        .patch('/api/v1/parcels/1/currentlocation')
        .set('x-auth', adminToken);
      status.should.eql(400);
    });

    it('Should not change location if not admin', async () => {
      const { status } = await chai.request(app)
        .patch('/api/v1/parcels/1/currentlocation')
        .set('x-auth', user2Token)
        .send({ location: 'manchester city, london' });
      status.should.eql(401);
    });
  });

  describe('/api/v1/parcels/:parcelId/status', () => {
    it('Should change status if admin', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/parcels/1/status')
        .set('x-auth', adminToken)
        .send({ status: 'in-transit' });
      res.should.have.status(200);
    });

    it('Should not change status if not admin', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/parcels/1/status')
        .set('x-auth', user2Token)
        .send({ status: 'in-transit' });
      res.should.have.status(401);
    });

    it('Should throw error on invalid status', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/parcels/1/status')
        .set('x-auth', adminToken)
        .send({ status: 'baloney' });
      res.should.have.status(400);
    });
  });

  describe('PATCH /api/v1/parcels/:parcelId/cancel', () => {
    before(async () => {
      await chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth', user2Token)
        .send(parcel1);

      await chai.request(app)
        .patch('/api/v1/parcels/2/status')
        .set('x-auth', adminToken)
        .send({ status: 'delivered' });
    });

    it('Should cancel order for authorized user', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/parcels/1/cancel')
        .set('x-auth', user2Token);
      res.should.have.status(200);
    });

    it('Should not cancel delivered parcels', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/parcels/2/cancel')
        .set('x-auth', user2Token);
      res.should.have.status(409);
    });

    it('Should not be able to change status of delivered order', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/parcels/2/status')
        .set('x-auth', adminToken)
        .send({ status: 'created' });
      res.should.have.status(409);
    });

    it('Should should throw a 404 if unassigned ID is supplied', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/parcels/3/cancel')
        .set('x-auth', user2Token);
      res.should.have.status(404);
    });

    it('Should not change location if admin and order cancelled', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/parcels/1/currentlocation')
        .set('x-auth', adminToken)
        .send({ location: 'manchester city, london' });
      res.should.have.status(404);
    });

    it('Should not change destination for cancelled order', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/parcels/1/destination')
        .set('x-auth', user2Token)
        .send({ destination: 'leicester city, london' });
      res.should.have.status(404);
    });
  });
});
