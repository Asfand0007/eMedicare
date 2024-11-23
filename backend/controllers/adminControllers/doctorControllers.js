const bcrypt = require('bcrypt');
const pool = require('../../db');

const getDoctors= async(req, res)=>{
    const userQuery = await pool.query(
        "SELECT * FROM doctors ORDER BY employeeid",
    );
    res.status(200).json({count: userQuery.rows.length , doctors: userQuery.rows});
}

const getDoctor= async(req,res)=>{
    const {id}= req.params
    const userQuery = await pool.query(
        "SELECT * FROM doctors WHERE employeeid=$1",
        [id]
    );
    
    if(userQuery.rows.length===0){
        res.status(404).json({msg: "No doctor found"})
    }
    else{
        res.status(200).json(userQuery.rows[0]);
    }
}


const addDoctor = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, speciality, startTime, endTime, password } = req.body;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        console.log("time error");
        return res.status(400).json({ msg: "Invalid time format. Use HH:MM." });
    }

    try {
        const userQuery = await pool.query(
            "SELECT * FROM doctors WHERE email=$1",
            [email]
        );

        if (userQuery.rows.length != 0)
            return res.status(409).json({ msg: "doctor email already exsits" });

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
}

module.exports={
    getDoctors,
    getDoctor,
    addDoctor
}