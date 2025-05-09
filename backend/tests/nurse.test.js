const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Nurse Endpoints', () => {
  let authToken;

  before(async function() {
    this.timeout(5000); // Increase timeout for setup
    try {
      // Login to get auth token using test nurse credentials
      const loginRes = await request(app)
        .post('/api/login')
        .send({
          firstName: 'James',
          password: 'pass',
          role: 'nurse'
        });
      
      if (loginRes.status === 200) {
        authToken = loginRes.body.token;
        console.log('Successfully obtained auth token for nurse');
      } else {
        console.log('Login failed:', loginRes.body);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  });

  describe('GET /api/nurse/getPatients', () => {
    it('should return 401 without authentication', async function() {
      this.timeout(5000);
      const res = await request(app)
        .get('/api/nurse/getPatients');
      
      expect(res.status).to.equal(401);
    });

    it('should return patients list with valid token', async function() {
      this.timeout(5000);
      if (!authToken) {
        console.log('Skipping test: No valid auth token available');
        return;
      }

      const res = await request(app)
        .get('/api/nurse/getPatients')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /api/nurse/getPatient/:id', () => {
    it('should return 401 without authentication', async function() {
      this.timeout(5000);
      const res = await request(app)
        .get('/api/nurse/getPatient/1');
      
      expect(res.status).to.equal(401);
    });

    it('should return 404 for non-existent patient', async function() {
      this.timeout(5000);
      if (!authToken) {
        console.log('Skipping test: No valid auth token available');
        return;
      }

      const res = await request(app)
        .get('/api/nurse/getPatient/999999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(404);
    });
  });

  describe('GET /api/nurse/getMyDosages', () => {
    it('should return 401 without authentication', async function() {
      this.timeout(5000);
      const res = await request(app)
        .get('/api/nurse/getMyDosages');
      
      expect(res.status).to.equal(401);
    });

    it('should return dosages list with valid token', async function() {
      this.timeout(5000);
      if (!authToken) {
        console.log('Skipping test: No valid auth token available');
        return;
      }

      const res = await request(app)
        .get('/api/nurse/getMyDosages')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /api/nurse/administerDosage', () => {
    it('should return 401 without authentication', async function() {
      this.timeout(5000);
      const res = await request(app)
        .post('/api/nurse/administerDosage')
        .send({
          dosageId: 1,
          notes: 'Test administration'
        });
      
      expect(res.status).to.equal(401);
    });

    it('should return 400 for invalid dosage data', async function() {
      this.timeout(5000);
      if (!authToken) {
        console.log('Skipping test: No valid auth token available');
        return;
      }

      const res = await request(app)
        .post('/api/nurse/administerDosage')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required dosageId field
          notes: 'Test administration'
        });
      
      expect(res.status).to.equal(400);
    });
  });
}); 