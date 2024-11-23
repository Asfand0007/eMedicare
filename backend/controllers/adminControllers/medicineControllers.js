const pool = require('../../db');

const getMedicines= async(req, res)=>{
    const medicineQuery = await pool.query(
        "SELECT * FROM medicines ORDER BY stock",
    );
    res.status(200).json({count: medicineQuery.rows.length , medicines: medicineQuery.rows});
}

const getMedicine= async(req,res)=>{
    const {medicine}= req.params
    const medicineQuery = await pool.query(
        "SELECT * FROM medicines WHERE medicineName=$1",
        [medicine]
    );
    
    if(medicineQuery.rows.length===0){
        res.status(404).json({msg: "No medicine found"})
    }
    else{
        res.status(200).json(medicineQuery.rows[0]);
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

module.exports={
    getMedicines,
    getMedicine,
    addMedicine
}