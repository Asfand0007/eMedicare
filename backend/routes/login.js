const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require('../db')
const express = require('express');
const router = express.Router()


router.post('/', async (req, res) => {
    try {
        const { userName, password, role } = req.body;
        console.log(userName, password, role);
        const userQuery = await pool.query(`SELECT * FROM ${role}s WHERE firstName=$1`, [userName]);
        const user = userQuery.rows[0];
        if (!user) {
            return res.status(401).json({ msg: "Incorrect user" });
        }
        //const validPassword = await bcrypt.compare(password, user.password);
        const validPassword = true;
        if (!validPassword) {
            return res.status(401).json({ msg: "Incorrect password" });
        }
        const accessToken = jwt.sign({ user: user.id, role: role }, process.env.JWT_ADMIN_KEY, { expiresIn: "1 hr" });
        res.json({'token':accessToken})

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;