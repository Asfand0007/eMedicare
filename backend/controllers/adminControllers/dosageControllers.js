const pool = require('../../db');

const getDosageRecords = async (req, res) => {
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
            nurses n ON n.employeeID = dt.nurseID
        ORDER BY 
            pt.mrid`,
    );
    res.status(200).json(dosageQuery.rows);
}

module.exports={getDosageRecords};