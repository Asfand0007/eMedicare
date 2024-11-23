const pool = require('../../db');

const getRooms= async(req, res)=>{
    const roomQuery = await pool.query(
        "SELECT * FROM rooms ORDER BY roomnumber",
    );
    res.status(200).json({count: roomQuery.rows.length , rooms: roomQuery.rows});
}

const addRoom= async (req,res)=>{
    const { capacity } = req.body;
    try {
        const newUser = await pool.query(
            "INSERT INTO rooms (capacity) VALUES ($1) RETURNING *",
            [capacity]
        );
        return res.json(newUser.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}

module.exports={
    getRooms,
    addRoom
};