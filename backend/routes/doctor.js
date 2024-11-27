const pool = require('../db');
const express = require('express');
const router = express.Router();

const { getMyPatients, getPatient, addDiagnosis } = require('../controllers/doctorControllers/patientControllers')
const { addDosage, getFormula, getDosageRecords } = require('../controllers/doctorControllers/dosageControllers');

router.get('/getMyPatients', getMyPatients);
router.get('/getMyPatients/:id', getMyPatients);
router.get('/getPatient/:id', getPatient);
router.post('/addDiagnosis/:id', addDiagnosis);

router.post('/addDosage/:id', addDosage);
router.get('/getFormula', getFormula);
router.get('/getDosageRecords', getDosageRecords);
router.get('/getDosageRecords/:id', getDosageRecords);

module.exports = router;