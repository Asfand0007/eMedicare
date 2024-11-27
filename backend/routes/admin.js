const pool = require('../db');
const express = require('express');
const { getDoctors, getDoctor, addDoctor, deleteDoctor } = require('../controllers/adminControllers/doctorControllers');
const { getNurses, getNurse, addNurse, deleteNurse } = require('../controllers/adminControllers/nurseControllers');
const { addAdmin } = require('../controllers/adminControllers/adminControllers');
const { getPatients, getPatient, addPatient, deletePatient } = require('../controllers/adminControllers/patientControllers');
const { getRooms, getAvailableRooms, addRoom } = require('../controllers/adminControllers/roomControllers');
const { getMedicines, getFormula, getMedicine, addMedicine, deleteMedicine } = require('../controllers/adminControllers/medicineControllers');
const {getDosageRecords}= require('../controllers/adminControllers/dosageControllers');

const router = express.Router();

router.post('/register', addAdmin);

router.get('/getDoctors', getDoctors);
router.get('/getDoctors/:id', getDoctors);
router.get('/getDoctor/:id', getDoctor);
router.post('/addDoctor', addDoctor);
router.delete('/deleteDoctor/:id', deleteDoctor);

router.get('/getNurses', getNurses);
router.get('/getNurses/:id', getNurses);
router.get('/getNurse/:id', getNurse);
router.post('/addNurse', addNurse);
router.delete('/deleteNurse/:id', deleteNurse);

router.get('/getPatients', getPatients);
router.get('/getPatients/:id', getPatients);
router.get('/getPatient/:id', getPatient);
router.post('/addPatient', addPatient);
router.delete('/deletePatient/:id', deletePatient);

router.get('/getRooms', getRooms);
router.get('/getRooms/:id', getRooms);
router.get('/getAvailableRooms', getAvailableRooms);
router.post('/addRoom', addRoom);

router.get('/getMedicines', getMedicines);
router.get('/getMedicines/:id', getMedicines);
router.get('/getMedicine/:medicine', getMedicine);
router.get('/getFormula', getFormula);
router.post('/addMedicine', addMedicine);
router.delete('/deleteMedicine/:id', deleteMedicine);

router.get('/getDosageRecords',getDosageRecords);
router.get('/getDosageRecords/:id',getDosageRecords);

router.get('/', async (req, res) => {
    try {
        const { userID, role } = req;
        const userQuery = await pool.query("SELECT * FROM admin WHERE id=$1", [userID]);
        const user = userQuery.rows[0];
        res.status(200).json({ msg: "Welcome Admin, " + user.name })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
})

module.exports = router;