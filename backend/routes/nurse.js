const pool = require('../db');
const express = require('express');
const router = express.Router();

const { administerDosage, getMyDosages, getUnadministeredDosages } =require('../controllers/nurseControllers/dosageControllers');
const { getPatients, getPatient} = require('../controllers/nurseControllers/patientControllers')


router.get('/getPatients', getPatients);
router.get('/getPatients/:id', getPatients);
router.get('/getPatient/:id', getPatient);


router.get('/getMyDosages',getMyDosages);
router.get('/getMyDosages/:id',getMyDosages);
router.get('/getUnadministeredDosages',getUnadministeredDosages);
router.get('/getUnadministeredDosages/:id',getUnadministeredDosages);
router.post('/administerDosage',administerDosage);


module.exports = router;