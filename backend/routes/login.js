const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require('../db')
const express = require('express');
const router = express.Router()


router.post('/', async (req, res) => {
    try {
        const { firstName, password, role } = req.body;
        const userQuery = await pool.query(`SELECT * FROM ${role}s WHERE firstname=$1`, [firstName]);
        const user = userQuery.rows[0];
        if (!user) {
            return res.status(401).json({ msg: "Incorrect user" });
        }
        const validPassword = await bcrypt.compare(password, user.authpassword);
        if (!validPassword) {
            return res.status(401).json({ msg: "Incorrect password" });
        }
        // const accessToken = jwt.sign({ user: user.employeeid, role: role }, process.env.JWT_ADMIN_KEY, { expiresIn: "1 hr" });
        const accessToken = jwt.sign({ user: user.employeeid, role: role }, process.env.JWT_ADMIN_KEY);
        res.json({'token':accessToken})

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;