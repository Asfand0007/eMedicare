const pool = require('../../db');

const administerDosage = async (req, res) => {
    const { dosageid, time } = req.body;
    try {
        const dosageQuery = await pool.query(
            `SELECT d.dosageID, dt.time 
             FROM dosagetimes dt 
             INNER JOIN dosage d ON d.dosageID = dt.dosageID
             WHERE dt.dosageID = $1 AND dt.time = $2`,
            [dosageid, time]
        );

        if (dosageQuery.rows.length === 0) {
            return res.status(400).json({ msg: "Invalid dosage ID or time" });
        }

        const medicineQuery = await pool.query(
            `SELECT m.medicineName 
             FROM medicines m 
             WHERE m.stock > 0 
             AND m.formulaName = (
                 SELECT d.formulaName 
                 FROM dosage d 
                 WHERE d.dosageID = $1
             )`,
            [dosageid]
        );
        
        const dosageTimeString = dosageQuery.rows[0].time; // "09:20:00" "HH:MM:SS"
        const [hours, minutes, seconds] = dosageTimeString.split(":").map(Number);
        
        const today = new Date();
        const dosageTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds);

        const currentTime = new Date(); 

        // Calculate the time difference in minutes
        const timeDifference = Math.abs((currentTime - dosageTime) / 1000 / 60);

        if (timeDifference > 15) {
            return res.status(400).json({ msg: "Current time is not within 15 minutes of the dosage time" });
        }

        if (medicineQuery.rows.length === 0) {
            return res.status(409).json({ msg: "Formula out of stock" });
        }
        const medicineName = medicineQuery.rows[0].medicinename;

        // Transaction
        try {
            await pool.query("BEGIN");
            const updateMedicine = await pool.query(
                "UPDATE medicines SET stock = stock - 1 WHERE medicineName = $1 AND stock > 0 RETURNING *",
                [medicineName]
            );
            if (updateMedicine.rows.length === 0) {
                throw new Error("Stock update failed");
            }
            const updateDosage = await pool.query(
                "UPDATE dosagetimes SET administered = true, nurseID = $1 WHERE dosageID = $2 AND time = $3 RETURNING *",
                [req.userID, dosageid, time]
            );
            if (updateDosage.rows.length === 0) {
                throw new Error("Dosage update failed");
            }
            await pool.query("COMMIT");
            return res.status(201).json(updateMedicine.rows[0]);
        } catch (transactionError) {
            await pool.query("ROLLBACK");
            console.error("Transaction failed:", transactionError.message);
            return res.status(500).json({ msg: transactionError.message });
        }
    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({ msg: "Server error" });
    }
};


const getMyDosages = async (req, res) => {
    const { id } = req.params;
    let condition = '';
    const params = [req.userID];

    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = ` AND (pt.firstname ILIKE '%' || $2 || '%' OR pt.lastname ILIKE '%' || $2 || '%')`;
        } else {
            condition = ` AND (pt.mrID = $2 OR d.dosageID = $2)`;
        }
    }

    try {
        const dosageQuery = await pool.query(
            `SELECT 
                pt.mrID,
                pt.firstName || ' ' || pt.lastName AS patientName,
                pt.roomNumber,
                d.dosageID,
                d.dosage_amount,
                d.formulaName,
                dt.time
             FROM 
                Patients pt
             JOIN 
                dosage d ON pt.mrID = d.patientmrID
             JOIN 
                dosageTimes dt ON dt.dosageID = d.dosageID
             INNER JOIN 
                nurses n ON n.employeeID = dt.nurseID
            WHERE n.employeeID = $1`
            + condition +
            ` ORDER BY 
                dt.time DESC;`,
            params
        );

        res.status(200).json({ count: dosageQuery.rows.length, dosages: dosageQuery.rows });
    } catch (error) {
        console.error("Error fetching dosages:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
};



const getUnadministeredDosages = async (req, res) => {
    const { id } = req.params;
    let condition = '';
    const params = [];

    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = ` AND (pt.firstname ILIKE ('%' || $1 || '%') OR pt.lastname ILIKE ('%' || $1 || '%'))`;
        } else {
            condition = ` AND (pt.mrID = $1 OR d.dosageID = $1)`;
        }
    }

    try {
        const dosageQuery = await pool.query(
            `SELECT 
                pt.mrID,
                pt.firstName || ' ' || pt.lastName AS patientName,
                pt.roomNumber,
                d.dosageID,
                d.dosage_amount,
                d.formulaName,
                dt.Time
             FROM 
                Patients pt
             JOIN 
                dosage d ON pt.mrID = d.patientmrID
             JOIN 
                dosageTimes dt ON dt.dosageID = d.dosageID
            WHERE administered = false`
            + condition +
            ` ORDER BY 
                dt.Time ASC;`,
            params
        );

        res.status(200).json({ count: dosageQuery.rows.length, dosages: dosageQuery.rows });
    } catch (error) {
        console.error("Error fetching unadministered dosages:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
};



module.exports = {
    administerDosage,
    getMyDosages,
    getUnadministeredDosages
};