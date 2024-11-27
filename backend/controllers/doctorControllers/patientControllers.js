const pool = require('../../db');

const getMyPatients = async (req, res) => {
    const { id } = req.params;
    let condition = '';
    params = [req.userID]
    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = "AND firstname ILIKE ('%' || $2 || '%') OR lastname ILIKE ('%' || $2 || '%')";
        }
        else {
            condition = "AND mrID=$2";
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
            FROM patients
            WHERE doctorID=$1
            ` + condition + 
            " ORDER BY mrID",
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

const addDiagnosis= async(req, res)=>{
    const { id } = req.params;
    const {diagnosis}= req.body;
    if (!id) {
        return res.status(404).json({ msg: "No patient found" })
    }
    try {
        const pateintQuery = await pool.query('UPDATE patients SET diagnosis=$1 WHERE mrID=$2 RETURNING *'
            ,[diagnosis, id]
        );

        if (pateintQuery.rows.length === 0) {
            res.status(404).json({ msg: "No patient found" })
        }
        else {
            res.status(200).json(pateintQuery.rows[0]);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}

module.exports = {
    getMyPatients,
    getPatient,
    addDiagnosis
};