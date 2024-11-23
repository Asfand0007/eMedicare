const bcrypt = require('bcrypt');
const {VerifyJWT, authorizeRoles} = require('../middleware/auth')
const pool = require('../db')

const express = require('express');
const router = express.Router()

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userQuery = await pool.query(
        "SELECT * FROM admins WHERE email=$1",
        [email]
    );
    if(userQuery.rows.length!=0)
        return res.status(409).json({msg:"User email already exsits"});

    const salt = await bcrypt.genSalt();
    const bcryptPassword = await bcrypt.hash(password, salt);

    console.log(firstName, lastName, email, password)

    const newUser = await pool.query(
        "INSERT INTO admins (firstname, lastname, email, authpassword) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, bcryptPassword]
    );
    return res.json(newUser.rows[0]);
});

router.post('/addDoctor',VerifyJWT, authorizeRoles('admin'), async (req, res) => {
    const { firstName, lastName, email, phoneNumber, speciality, startTime, endTime, password } = req.body;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        console.log("time error")
        return res.status(400).json({ msg: "Invalid time format. Use HH:MM:SS." });
    }

    try{
        const userQuery = await pool.query(
            "SELECT * FROM doctors WHERE email=$1",
            [email]
        );

        if(userQuery.rows.length!=0)
            return res.status(409).json({msg:"doctor email already exsits"});
    
        const salt = await bcrypt.genSalt();
        const bcryptPassword = await bcrypt.hash(password, salt);
    
        console.log(firstName, password);
    
        const newUser = await pool.query(
            "INSERT INTO doctors (firstName, lastName, email, phoneNumber, speciality, startTime, endTime, authpassword) VALUES ($1, $2, $3, $4, $5, $6::time, $7::time, $8) RETURNING *",
            [firstName, lastName, email, phoneNumber, speciality, startTime, endTime, bcryptPassword]
        );
        return res.json(newUser.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
})

router.post('/addNurse',VerifyJWT, authorizeRoles('admin'), async (req, res) => {
    const { firstName, lastName, email, phoneNumber, speciality, startTime, endTime, password } = req.body;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return res.status(400).json({ msg: "Invalid time format. Use HH:MM:SS." });
    }
    try{
        const userQuery = await pool.query(
            "SELECT * FROM nurses WHERE email=$1",
            [email]
        );

        if(userQuery.rows.length!=0)
            return res.status(409).json({msg:"nurse email already exsits"});
    
        const salt = await bcrypt.genSalt();
        const bcryptPassword = await bcrypt.hash(password, salt);
    
    
        const newUser = await pool.query(
            "INSERT INTO nurses (firstName, lastName, email, phoneNumber, startTime, endTime, authpassword) VALUES ($1, $2, $3, $4, $5::time, $6::time, $7) RETURNING *",
            [firstName, lastName, email, phoneNumber, startTime, endTime, bcryptPassword]
        );
        return res.json(newUser.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
})


router.get('/',VerifyJWT, authorizeRoles('admin'),  async (req, res)=>{
    try{
        const {userID, role} = req;
        const userQuery = await pool.query("SELECT * FROM admin WHERE id=$1", [userID]);
        const user = userQuery.rows[0];
        res.status(200).json({msg: "Welcome Admin, "+ user.name})
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
})

module.exports = router;