const { Query } = require('pg');
const pool = require('../../db');

const addDosage = async (req, res) => {
    const { id } = req.params;
    const { dosageAmount, formulaName, dosageCount } = req.body;

    if (!id) {
        return res.status(404).json({ msg: "No patient found" });
    }

    if (!dosageAmount || !formulaName || !dosageCount) {
        return res.status(400).json({ msg: "Dosage amount, formula name, and dosageCount are required" });
    }

    try {
        await pool.query("BEGIN");

        const dosageQuery = await pool.query(
            `INSERT INTO dosage (dosage_amount, patientmrID, formulaName) 
             VALUES ($1, $2, $3) RETURNING *`,
            [dosageAmount, id, formulaName]
        );

        if (dosageQuery.rows.length === 0) {
            throw new Error("Unable to insert dosage");
        }

        const dosageID = dosageQuery.rows[0].dosageid;

        const interval = Math.floor(24 * 60 / dosageCount);
        const startingHour = 9;
        const startingMinute = 0;

        const times = [];
        for (let i = 0; i < dosageCount; i++) {
            const totalMinutes = startingHour * 60 + startingMinute + i * interval;
            const hours = Math.floor(totalMinutes / 60) % 24;
            const minutes = totalMinutes % 60;
            const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
            times.push(timeString);
        }


        for (const time of times) {
            await pool.query(
                `INSERT INTO dosageTimes (dosageID, time) 
                 VALUES ($1, $2) RETURNING *`,
                [dosageID, time]
            );
        }

        await pool.query("COMMIT");

        res.status(201).json({ dosageID, times });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
};

const getFormula=async(req, res)=>{
    const formulaQuery = await pool.query(
        "SELECT * FROM formula ORDER by formulaName");
    res.status(200).json(formulaQuery.rows);
}

const getDosageRecords = async (req, res) => {
    const { id } = req.params;
    const params = [req.userID];
    let condition = '';

    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = " AND (pt.firstname ILIKE ('%' || $2 || '%') OR pt.lastname ILIKE ('%' || $2 || '%'))";
        }
        else {
            condition = " AND (pt.mrID = $2 OR d.dosageID=$2)";
        }
    }

    try {
        const queryText = `
            SELECT 
                pt.mrID,
                pt.firstName || ' ' || pt.lastName AS patientName,
                d.dosageID,
                dt.Time,
                dt.administered,
                dt.nurseID,
                n.firstName || ' ' || n.lastName AS nurseName
            FROM 
                Patients pt
            JOIN 
                dosage d ON pt.mrID = d.patientmrID
            JOIN 
                dosageTimes dt ON dt.dosageID = d.dosageID
            LEFT JOIN 
                nurses n ON n.employeeID = dt.nurseID
            WHERE 
                pt.doctorID = $1
                ${condition} 
            ORDER BY 
                pt.mrID;
        `;

        const dosageQuery = await pool.query(queryText, params);
        res.status(200).json({
            count: dosageQuery.rows.length,
            dosages: dosageQuery.rows,
        });
    } catch (error) {
        console.error('Database Error:', error.message);
        res.status(501).json({ msg: error.message });
    }
};


const deleteDosageRecord = async (req,res) => {
    const { id } = req.params;
    try {
        await pool.query("BEGIN");
        const deletedDosage = await pool.query(
            `
             DELETE FROM dosage
             WHERE dosageid=$1
             RETURNING *
            `,
            [id]
        );
        if(deletedDosage.rowCount===0){
            throw new Error("No associated Dosage found");
        }
        await pool.query("COMMIT");
        return res.status(200).json({ msg: "Dosage Record Successfully Deleted" });
    } catch (error){
        await pool.query("ROLLBACK");
        console.error("Transaction Failed: ", error.message);
        return res.status(500).json({ msg: error.message });
    }
}


module.exports = {
    deleteDosageRecord,
    addDosage,
    getFormula,
    getDosageRecords
};
