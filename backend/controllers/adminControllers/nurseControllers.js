const bcrypt = require('bcrypt');
const pool = require('../../db');

const getNurses= async(req, res)=>{
    const { id } = req.params;
    let condition = '';
    params = []
    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = " WHERE firstname LIKE ('%' || $1 || '%') OR lastname LIKE ('%' || $1 || '%')";
        }
        else {
            condition = " WHERE employeeID=$1";
        }
    }
    const nurseQuery = await pool.query(
        `SELECT 
            employeeid,
            firstname || ' ' || lastname AS fullName,
            email,
            phonenumber,
            starttime,
            endtime
        FROM nurses `
         + condition +
         " ORDER BY employeeid",
    params);
    res.status(200).json({count: nurseQuery.rows.length , nurses: nurseQuery.rows});
}

const getNurse= async(req,res)=>{
    const {id}= req.params
    const userQuery = await pool.query(
        `SELECT 
            employeeid,
            firstname || ' ' || lastname AS fullName,
            email,
            phonenumber,
            starttime,
            endtime
        FROM nurses
        WHERE employeeid=$1`,
        [id]
    );
    
    if(userQuery.rows.length===0){
        res.status(404).json({msg: "No nurse found"})
    }
    else{
        res.status(200).json(userQuery.rows[0]);
    }
}

const addNurse= async (req, res) => {
    const { firstName, lastName, email, phoneNumber, startTime, endTime, password } = req.body;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        console.log("time error");
        return res.status(400).json({ msg: "Invalid time format. Use HH:MM." });
    }
    try {
        const userQuery = await pool.query(
            "SELECT * FROM nurses WHERE email=$1",
            [email]
        );

        if (userQuery.rows.length != 0)
            return res.status(409).json({ msg: "nurse email already exsits" });

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
}

const deleteNurse= async (req, res)=>{
    const {id}= req.params

    try {
        const deletedNurse = await pool.query(
            "DELETE FROM nurses WHERE employeeid=$1 RETURNING *",
            [id]
        );
        
        if (deletedNurse.rows.length === 0) {
            res.status(404).json({msg: "No nurse found"});
        }
        
        return res.status(200).json(deletedNurse.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}


module.exports={
    getNurses,
    getNurse,
    addNurse,
    deleteNurse
};