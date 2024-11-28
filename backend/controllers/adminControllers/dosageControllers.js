const pool = require('../../db');

const getDosageRecords = async (req, res) => {
    const { id } = req.params;
    let condition = '';
    params = []
    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = " WHERE pt.firstname LIKE ('%' || $1 || '%') OR pt.lastname LIKE ('%' || $1 || '%')";
        }
        else {
            condition = " WHERE pt.mrID = $1 OR d.dosageID=$1";
        }
    }
    
    const dosageQuery = await pool.query(
        `SELECT 
            pt.mrID,
            pt.firstName || ' ' || pt.lastName as patientName,
            d.dosageID,
            dt.Time,
            dt.administered,
            dt.nurseID,
            n.firstName || ' ' || n.lastName as nurseName
        FROM 
            Patients pt
        JOIN 
            dosage d ON pt.mrID = d.patientmrID
        JOIN 
            dosageTimes dt ON dt.dosageID = d.dosageID
        LEFT JOIN 
            nurses n ON n.employeeID = dt.nurseID`
        +condition+
        ` ORDER BY 
            pt.mrid`,
    params);
    res.status(200).json({count: dosageQuery.rows.length, dosages:dosageQuery.rows});
}


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

module.exports={
    getDosageRecords,
    deleteDosageRecord
};