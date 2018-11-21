import chaiHttp from 'chai-http';
import chai from 'chai';
import { describe } from 'mocha';
import app from '../index';

chai.use(chaiHttp);
chai.should();


describe('Extra routes', () => {
  describe('GET /api/v1', () => {
    it('should return a welcome page', (done) => {
      chai.request(app)
        .get('/api/v1')
        .end((error, response) => {
          response.status.should.eql(200);
          done();
        });
    });
  });

  describe('Uncaught routes', () => {
    it('should return a 404', (done) => {
      chai.request(app)
        .get('/sdgdfg')
        .end((error, response) => {
          response.status.should.eql(404);
          done();
        });
    });
  });
});
