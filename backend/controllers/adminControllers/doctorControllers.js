const bcrypt = require('bcrypt');
const pool = require('../../db');

const getDoctors = async (req, res) => {
    const { id } = req.params;
    let condition = '';
    params = []
    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = " WHERE d.firstname LIKE ('%' || $1 || '%') OR d.lastname LIKE ('%' || $1 || '%')";
        }
        else {
            condition = " WHERE d.employeeid = $1";
        }
    }
    try {
        const doctorQuery = await pool.query(`
            SELECT
                d.employeeid,
                d.firstname || ' ' || d.lastname AS fullName,
                d.email,
                d.phonenumber,
                d.speciality,
                d.starttime,
                d.endtime,
                count(pt.mrID) AS patientCount
            FROM
                doctors d 
            LEFT JOIN
                patients pt ON pt.doctorID=d.employeeID`
            + condition +
            ` GROUP BY (d.employeeid);`, params
        );
        res.status(200).json({count: doctorQuery.rows.length, doctors: doctorQuerys.rows});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}

const getDoctor = async (req, res) => {
    const { id } = req.params;
    const doctorQuery = await pool.query(
        `SELECT
            employeeid,
            firstname || ' ' || lastname AS fullName,
            email,
            phonenumber,
            speciality,
            starttime,
            endtime
        FROM
            doctors WHERE employeeid= $1;`,
        [id]);

    const patientQuery = await pool.query(
        `SELECT
            pt.mrid,
            pt.firstname || ' ' || pt.lastname AS fullName,
            pt.gender,
            pt.diagnosis,
            pt.admissionDate,
            pt.roomNumber
        FROM
            Patients pt
        JOIN doctors d ON pt.doctorID= d.employeeID
        WHERE d.employeeID=$1;`,
    [id])

    res.status(200).json({doctor:doctorQuery.rows[0], patients:patientQuery.rows});
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

module.exports = {
    getDoctors,
    getDoctor,
    addDoctor
}