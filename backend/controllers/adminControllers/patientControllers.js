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

const addPatient = async (req, res) => {
    const { firstName, lastName, gender, dateOfBirth, roomNumber, doctorID, diagnosis } = req.body;
    //add time format check according to frontend
    if (isNaN(new Date(dateOfBirth))) {
        return res.status(400).json({ msg: "Invalid date format. Use 'YYYY-MM-DD'." });
    }

    try {
        let userQuery = await pool.query(
            "SELECT * FROM doctors WHERE employeeid=$1",
            [doctorID]
        );

        if (userQuery.rows.length == 0)
            return res.status(409).json({ msg: "Invalid Doctor ID" });

        userQuery = await pool.query(
            "SELECT * FROM admins WHERE employeeid=$1",
            [req.userID]
        );

        if (userQuery.rows.length == 0)
            return res.status(409).json({ msg: "Invalid admin ID" });

        userQuery = await pool.query(
            "SELECT capacity, occupied FROM rooms WHERE roomnumber=$1",
            [roomNumber]
        );

        if (userQuery.rows.length == 0)
            return res.status(409).json({ msg: "Invalid Room Number" });

        const { capacity, occupied } = userQuery.rows[0];
        if (occupied >= capacity) {
            return res.status(400).json({ msg: "Room is already at full capacity" });
        }

        //transaction
        try {
            await pool.query("BEGIN");

            const newUser = await pool.query(
                "INSERT INTO patients (firstName, lastName, gender, dateOfBirth, admissionDate, roomNumber, doctorID, adminID, diagnosis ) VALUES ($1, $2, $3, $4::date, $5::date, $6, $7, $8, $9) RETURNING *",
                [firstName, lastName, gender, dateOfBirth, (new Date().toISOString().slice(0, 10)), roomNumber, doctorID, req.userID, diagnosis]
            );

            const updatedRoom = await pool.query(
                "UPDATE rooms  SET occupied = occupied + 1 WHERE roomNumber = $1 AND occupied < capacity RETURNING *",
                [roomNumber]
            );

            if (updatedRoom.rows.length === 0) {
                throw new Error("Room is already at full capacity or does not exist");
            }

            await pool.query("COMMIT");

            return res.status(201).json(newUser.rows[0]);
        } catch (error) {
            await pool.query("ROLLBACK");
            console.error("Transaction failed:", error.message);
            res.status(500).json({ msg: error.message });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}

const deletePatient = async (req, res) => {
    const { id } = req.params

    try {
        await pool.query("BEGIN");

        const deletedUser = await pool.query(
            "DELETE FROM patients WHERE mrid=$1 RETURNING *",
            [id]
        );


        if (deletedUser.rows.length === 0) {
            throw new Error("No user found");
        }

        const updatedRoom = await pool.query(
            "UPDATE rooms  SET occupied = occupied - 1 WHERE roomNumber = $1 AND occupied >0 RETURNING *",
            [deletedUser.rows[0].roomnumber]
        );

        if (updatedRoom.rows.length === 0) {
            throw new Error("No room found");
        }

        await pool.query("COMMIT");
        return res.status(200).json(deletedUser.rows[0]);
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Transaction failed:", error.message);
        res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    getPatients,
    getPatient,
    addPatient,
    deletePatient
};