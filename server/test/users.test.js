import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe } from 'mocha';
import app from '../index';

chai.use(chaiHttp);
chai.should();

/** Class for creating users */
class User {
  /**
   *
   * @param {String} firstName the user's first name
   * @param {String} lastName the user's last name
   * @param {String} username the unique username
   * @param {String} email the user's email
   * @param {String} password the chosen password
   */
  constructor(firstName, lastName, username, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

const user1 = { username: 'aloha', password: 'batistuta' };
const admin = new User('Chubi', 'Best', 'chubibest', 'chubi.best@gmail.com', 'chubibest');
const user = new User('Brozovic', 'Paul', 'aloha', 'gokuirayol@gmail.com', 'batistuta');
const existingEmail = new User('Brozovic', 'Paul', 'aloha', 'gokuirayol@gmail.com', 'batistuta');
const noFirstname = new User(undefined, 'Paul', 'aloha', 'gokuirayol@gmail.com', 'batistuta');
const shortFirstname = new User('B', 'Paul', 'aloha', 'gokuirayol@gmail.com', 'batistuta');
const illegalFirstname = new User('B#%%##$#%', 'Paul', 'aloha', 'gokuirayol@gmail.com', 'batistuta');
const shortLastname = new User('Brozovic', 'P', 'aloha', 'gokuirayol@gmail.com', 'batistuta');
const illegalLastname = new User('Brozovic', 'PE%###^', 'aloha', 'gokuirayol@gmail.com', 'batistuta');
const shortPassword = new User('Brozovic', 'Paul', 'aloha', 'gokuirayol@gmail.com', 'bat');
const spaceInPassword = new User('Brozovic', 'Paul', 'aloha', 'gokuirayol@gmail.com', 'bat istuta');
const invalidEmail = new User('Brozovic', 'Paul', 'aloha', 'gokuirayolgmail.com', 'batistuta');
const shortUsername = new User('Brozovic', 'Paul', 'alo', 'gokuirayol@gmail.com', 'batistuta');
const invalidUsername = new User('Brozovic', 'Paul', 'aloh%"^&£&a', 'gokuirayol@gmail.com', 'batistuta');

describe('User signup', () => {
  it('should create user on valid input', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user);
    expect(status).to.eql(201);
  });

  it('should not create user with an already existing email', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(existingEmail);
    expect(status).to.eql(409);
  });

  it('should not create user with an already existing username', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user);
    expect(status).to.eql(409);
  });

  it('should not create user with an empty firstName field', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(noFirstname);
    expect(status).to.eql(400);
  });

  it('should not create user with less than 2 character firstName', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(shortFirstname);
    expect(status).to.eql(400);
  });

  it('should not create user with illegal characters in firstName', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(illegalFirstname);
    expect(status).to.eql(400);
  });

  it('should not create user with less than 2 character lastName', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(shortLastname);
    expect(status).to.eql(400);
  });

  it('should not create user with illegal characters in lastName', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(illegalLastname);
    expect(status).to.eql(400);
  });

  it('Should not create user with short password', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(shortPassword);
    expect(status).to.eql(400);
  });

  it('Should not accept spaces in password', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(spaceInPassword);
    expect(status).to.eql(400);
  });

  it('should not create user with invalid email format', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(invalidEmail);
    expect(status).to.eql(400);
  });

  it('should not create user with username shorter than 4 characters', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(shortUsername);
    expect(status).to.eql(400);
  });

  it('should not create user with invalid username format', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(invalidUsername);
    expect(status).to.eql(400);
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

describe('Upgrade to Admin', () => {
  before(async () => {
    await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(admin);
  });

  it('Should upgrade to admin', async () => {
    const res = await chai.request(app)
      .patch('/api/v1/2/admin')
      .send({ password: 'stayEPIC' });
    expect(res).to.have.status(200);
  });
});
