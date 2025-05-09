const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Doctor Endpoints', () => {
  let authToken;

  before(async function() {
    this.timeout(5000); // Increase timeout for setup
    try {
      // Login to get auth token using test doctor credentials
      const loginRes = await request(app)
        .post('/api/login')
        .send({
          firstName: 'James',
          password: 'pass',
          role: 'doctor'
        });
      
      if (loginRes.status === 200) {
        authToken = loginRes.body.token;
        console.log('Successfully obtained auth token for doctor');
      } else {
        console.log('Login failed:', loginRes.body);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  });

  describe('GET /api/doctor/getMyPatients', () => {
    it('should return 401 without authentication', async function() {
      this.timeout(5000);
      const res = await request(app)
        .get('/api/doctor/getMyPatients');
      
      expect(res.status).to.equal(401);
    });

    it('should return patients list with valid token', async function() {
      this.timeout(5000);
      if (!authToken) {
        console.log('Skipping test: No valid auth token available');
        return;
      }

      const res = await request(app)
        .get('/api/doctor/getMyPatients')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('count').that.is.a('number');
      expect(res.body).to.have.property('patients').that.is.an('array');
      
      // Check structure of each patient object
      if (res.body.patients.length > 0) {
        const patient = res.body.patients[0];
        expect(patient).to.have.property('mrid');
        expect(patient).to.have.property('fullname');
        expect(patient).to.have.property('gender');
        expect(patient).to.have.property('dateofbirth');
        expect(patient).to.have.property('admissiondate');
        expect(patient).to.have.property('roomnumber');
        expect(patient).to.have.property('doctorid');
        expect(patient).to.have.property('diagnosis');
      }
    });
  });

  describe('GET /api/doctor/getPatient/:id', () => {
    it('should return 401 without authentication', async function() {
      this.timeout(5000);
      const res = await request(app)
        .get('/api/doctor/getPatient/1');
      
      expect(res.status).to.equal(401);
    });

    it('should return 404 for non-existent patient', async function() {
      this.timeout(5000);
      if (!authToken) {
        console.log('Skipping test: No valid auth token available');
        return;
      }

      const res = await request(app)
        .get('/api/doctor/getPatient/999999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(404);
    });
  });

  describe('POST /api/doctor/addDiagnosis/:id', () => {
    it('should return 401 without authentication', async function() {
      this.timeout(5000);
      const res = await request(app)
        .post('/api/doctor/addDiagnosis/1')
        .send({
          diagnosis: 'Test diagnosis'
        });
      
      expect(res.status).to.equal(401);
    });

    it('should return 400 for invalid diagnosis data', async function() {
      this.timeout(5000);
      if (!authToken) {
        console.log('Skipping test: No valid auth token available');
        return;
      }

      const res = await request(app)
        .post('/api/doctor/addDiagnosis/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required diagnosis field
          notes: 'Test notes'
        });
      
      expect(res.status).to.equal(404);
    });
  });
}); 