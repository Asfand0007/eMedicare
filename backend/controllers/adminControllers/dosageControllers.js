const pool = require('../../db');

const getDosageRecords = async (req, res) => {
    const { id } = req.params;
    let condition = '';
    const params = [];

    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = `WHERE pt.firstname ILIKE '%' || $1 || '%' OR pt.lastname ILIKE '%' || $1 || '%'`;
        } else {
            condition = `WHERE pt.mrID = $1 OR d.dosageID = $1`;
        }
    }

    try {
        const queryText = `
            SELECT 
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
            ${condition}
            ORDER BY 
                pt.mrid;
        `;

        const dosageQuery = await pool.query(queryText, params);

        return res.status(200).json({
            count: dosageQuery.rows.length,
            dosages: dosageQuery.rows,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(501).json({ msg: error.message });
    }
};


module.exports={
    getDosageRecords
};