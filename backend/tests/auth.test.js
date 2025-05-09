const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Authentication Endpoints', () => {
  describe('POST /api/login', () => {
    it('should return 401 for invalid credentials', async function() {
      this.timeout(5000); // Increase timeout for this test
      const res = await request(app)
        .post('/api/login')
        .send({
          firstName: 'invaliduser',
          password: 'wrongpassword',
          role: 'doctor'
        });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('msg');
    });

    it('should return 401 for missing credentials', async function() {
      this.timeout(5000);
      const res = await request(app)
        .post('/api/login')
        .send({});
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('msg');
    });

    it('should return 401 for missing firstName', async function() {
      this.timeout(5000);
      const res = await request(app)
        .post('/api/login')
        .send({
          password: 'password123',
          role: 'doctor'
        });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('msg');
    });

    it('should return 401 for missing password', async function() {
      this.timeout(5000);
      const res = await request(app)
        .post('/api/login')
        .send({
          firstName: 'testuser',
          role: 'doctor'
        });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('msg');
    });

    it('should return 401 for missing role', async function() {
      this.timeout(5000);
      const res = await request(app)
        .post('/api/login')
        .send({
          firstName: 'testuser',
          password: 'password123'
        });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('msg');
    });
  });
}); 