const pool = require('../../db');

const getPatients = async (req, res) => {
    const { id } = req.params;
    let condition = '';
    params = []
    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = " WHERE firstname ILIKE ('%' || $1 || '%') OR lastname ILIKE ('%' || $1 || '%')";
        }
        else {
            condition = " WHERE mrID=$1";
        }
    }
    try {
        const userQuery = await pool.query(
            `SELECT 
                mrID,
                firstname || ' ' || lastname AS fullName,
                gender,
                dateOfBirth,
                admissionDate,
                roomNumber,
                doctorID,
                diagnosis
            FROM patients` + condition + " ORDER BY mrID",
            params);
        res.status(200).json({ count: userQuery.rows.length, patients: userQuery.rows });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}

const getPatient = async (req, res) => {
    const { id } = req.params
    const userQuery = await pool.query(
        `SELECT 
            mrID,
            firstname || ' ' || lastname AS fullName,
            gender,
            dateOfBirth,
            admissionDate,
            roomNumber,
            doctorID,
            diagnosis
        FROM patients 
        WHERE mrid=$1`,
        [id]
    );
    try {
        const dosageQuery = await pool.query(
            `SELECT 
                d.dosageID,
                d.dosage_amount,
                d.formulaName,
                COUNT(dt.time)
            FROM  dosage d
            LEFT JOIN Patients pt ON d.patientMrID = pt.mrID
            LEFT JOIN dosageTimes dt ON dt.dosageID = d.dosageID
            WHERE pt.mrID=$1
            GROUP BY (d.dosageID);`,
        [id])

        if (userQuery.rows.length === 0) {
            res.status(404).json({ msg: "No patient found" })
        }
        else {
            res.status(200).json({patient: userQuery.rows[0], dosages: dosageQuery.rows});
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}

module.exports = {
    getPatients,
    getPatient
};