import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe } from 'mocha';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const user1 = { username: 'aloha', password: 'batistuta' };
// const user2 = { email: 'loremipsum@gmail.com', password: 'ronaldo' };

describe('User signup', () => {
  it('should create user on valid input', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Brozovic',
        lastName: 'Paul',
        username: 'aloha',
        email: 'gokuirayol@gmail.com',
        password: 'batistuta',
      })
      .end((error, response) => {
        expect(response).to.have.status(201);
        done();
      });
  });

  it('should not create user with an already existing email', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Brozovic',
        lastName: 'Paul',
        username: 'alohag',
        email: 'gokuirayol@gmail.com',
        password: 'batistuta',
      })
      .end((error, response) => {
        expect(response).to.have.status(409);
        done();
      });
  });

  it('should not create user with an already existing username', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Brozovic',
        lastName: 'Paul',
        username: 'aloha',
        email: 'gokuirayol@gmail.com',
        password: 'batistuta',
      })
      .end((error, response) => {
        expect(response).to.have.status(409);
        done();
      });
  });

  it('should not create user with an empty firstName field', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        lastName: 'Paul',
        username: 'aloha',
        email: 'gokuirayol@gmail.com',
        password: 'batistuta',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        done();
      });
  });
  it('Should not create user with short password', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Brozovic',
        lastName: 'Paul',
        username: 'aloha',
        email: 'gokuirayol@gmail.com',
        password: 'bat',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        done();
      });
  });

  it('should not create user with invalid email format', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Brozovic',
        lastName: 'Paul',
        username: 'aloha',
        email: 'gokuirayolgmail.com',
        password: 'batistuta',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        done();
      });
  });

  it('should not create user with username shorter than 4 characters', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Brozovic',
        lastName: 'Paul',
        username: 'alo',
        email: 'gokuirayo@gmail.com',
        password: 'batistuta',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        done();
      });
  });

  it('should not create user with invalid username format', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Brozovic',
        lastName: 'Paul',
        username: 'aloh%"^&£&a',
        email: 'gokuirayol@gmail.com',
        password: 'batistuta',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        done();
      });
  });
});

describe('User login', () => {
  it('Should login with the correct details', async () => {
    const res = await chai.request(app)
      .post('/api/v1/auth/login')
      .send(user1);
    expect(res).to.have.status(200);
  });

  it('Should not login user with invalid input', async () => {
    const res = await chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: '',
        password: '',
      });
    expect(res).to.have.status(404);
  });

  it('Should not login user with wrong password', async () => {
    const res = await chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'aloha',
        password: 'ae9a9g',
      });
    expect(res).to.have.status(404);
  });

  it('Should not login user with wrong username', async () => {
    const res = await chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'alohaa',
        password: 'batistuta',
      });
    expect(res).to.have.status(404);
  });
});
