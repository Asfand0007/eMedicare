const pool = require('../../db');

const getMedicines= async(req, res)=>{
    const { id } = req.params;
    let condition = '';
    params = []
    if (id) {
        params.push(id);
        if (isNaN(id)) {
            condition = " WHERE medicineName LIKE ('%' || $1 || '%')";
        }
        else {
            condition = " WHERE stock=$1";
        }
    }
    const medicineQuery = await pool.query(
        "SELECT * FROM medicines" + condition +" ORDER BY stock", 
    params);
    res.status(200).json({count: medicineQuery.rows.length , medicines: medicineQuery.rows});
}

const getFormula=async(req, res)=>{
    const formulaQuery = await pool.query(
        "SELECT * FROM formula ORDER by formulaName");
    res.status(200).json(formulaQuery.rows);
}

const getMedicine= async(req,res)=>{
    const {medicine}= req.params
    const medicineQuery = await pool.query(
        "SELECT * FROM medicines WHERE medicineName=$1",
        [medicine]
    );
    
    const dosageQuery= await pool.query(
            `SELECT 
                d.dosageid,
                d.patientmrid
            FROM medicines md 
            JOIN dosage d ON d.formulaName=md.formulaName
            WHERE medicineName=$1;`
        ,[medicine]    
    )
    if(medicineQuery.rows.length===0){
        res.status(404).json({msg: "No medicine found"})
    }
    else{
        res.status(200).json({medicine:medicineQuery.rows[0], dosages:dosageQuery.rows});
    }
}


const addMedicine = async (req, res) => {
    const { medicineName, stock,formulaName} = req.body;
    try {
        const medicineQuery = await pool.query(
            "SELECT * FROM medicines WHERE medicineName=$1",
            [medicineName]
        );

        if (medicineQuery.rows.length != 0)
            return res.status(409).json({ msg: "Medicine already exsits" });

        const newMedicine = await pool.query(
            "INSERT INTO medicines (medicineName, stock, formulaName) VALUES ($1, $2, $3) RETURNING *",
            [medicineName, stock, formulaName]
        );
        return res.json(newMedicine.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}

const deleteMedicine= async (req, res)=>{
    const {id}= req.params

    try {
        const deletedMedicine = await pool.query(
            "DELETE FROM medicines WHERE medicineName=$1 RETURNING *",
            [id]
        );
        
        if (deletedMedicine.rows.length === 0) {
            res.status(404).json({msg: "No Medicine found"});
        }
        
        return res.status(200).json(deletedMedicine.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}

module.exports={
    getMedicines,
    getFormula,
    getMedicine,
    addMedicine,
    deleteMedicine
}