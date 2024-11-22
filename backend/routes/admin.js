const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {VerifyJWT, authorizeRoles} = require('../middleware/auth')
const pool = require('../db')

const express = require('express');
const router = express.Router()

router.post('/register', async (req, res) => {
    const { userName, password } = req.body;

    const userQuery = await pool.query(
        "SELECT * FROM admins WHERE name=$1",
        [userName]
    );
    if(userQuery.rows.length!=0)
        return res.status(409).json({msg:"User already exsits"});

    const salt = await bcrypt.genSalt();
    const bcryptPassword = await bcrypt.hash(password, salt);

    console.log(userName, password)

    const newUser = await pool.query(
        "INSERT INTO admins (name, password) VALUES ($1, $2) RETURNING *",
        [userName, bcryptPassword]
    );
    return res.json(newUser.rows[0]);
});

router.post('/addDoctor',VerifyJWT, authorizeRoles('admin'), async (req, res) => {
    const { userName, password } = req.body;

    try{
        const userQuery = await pool.query(
            "SELECT * FROM doctors WHERE name=$1",
            [userName]
        );

        if(userQuery.rows.length!=0)
            return res.status(409).json({msg:"doctor already exsits"});
    
        const salt = await bcrypt.genSalt();
        const bcryptPassword = await bcrypt.hash(password, salt);
    
        console.log(userName, password);
    
        const newUser = await pool.query(
            "INSERT INTO doctors (name, password) VALUES ($1, $2) RETURNING *",
            [userName, bcryptPassword]
        );
        return res.json(newUser.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
})

router.post('/addNurse',VerifyJWT, authorizeRoles('admin'), async (req, res) => {
    const { userName, password } = req.body;

    try{
        const userQuery = await pool.query(
            "SELECT * FROM nurses WHERE name=$1",
            [userName]
        );

        if(userQuery.rows.length!=0)
            return res.status(409).json({msg:"nurse already exsits"});
    
        const salt = await bcrypt.genSalt();
        const bcryptPassword = await bcrypt.hash(password, salt);
    
        console.log(userName, password);
    
        const newUser = await pool.query(
            "INSERT INTO nurses (name, password) VALUES ($1, $2) RETURNING *",
            [userName, bcryptPassword]
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