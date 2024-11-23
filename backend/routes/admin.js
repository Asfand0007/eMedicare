const pool = require('../db');
const express = require('express');
const { getDoctors, getDoctor, addDoctor } = require('../controllers/adminControllers/doctorControllers');
const { getNurses, getNurse, addNurse, deleteNurse } = require('../controllers/adminControllers/nurseControllers');
const { addAdmin } = require('../controllers/adminControllers/adminControllers');
const { getPatients, getPatient, addPatient, deletePatient } = require('../controllers/adminControllers/patientControllers');
const { getRooms, addRoom } = require('../controllers/adminControllers/roomControllers');
const { getMedicines, getMedicine, addMedicine } = require('../controllers/adminControllers/medicineControllers');
const {getDosageRecords}= require('../controllers/adminControllers/dosageControllers');

const router = express.Router();

router.post('/register', addAdmin);

router.get('/getDoctors', getDoctors);
router.get('/getDoctor/:id', getDoctor);
router.post('/addDoctor', addDoctor);

router.get('/getNurses', getNurses);
router.get('/getNurse/:id', getNurse);
router.post('/addNurse', addNurse);
router.delete('/deleteNurse/:id', deleteNurse);

router.get('/getPatients', getPatients);
router.get('/getPatient/:id', getPatient);
router.post('/addPatient', addPatient);
router.delete('/deletePatient/:id', deletePatient);

router.get('/getRooms', getRooms);
router.post('/addRoom', addRoom);

router.get('/getMedicines', getMedicines);
router.get('/getMedicine/:medicine', getMedicine);
router.post('/addMedicine', addMedicine);

router.get('/getDosageRecords',getDosageRecords);

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