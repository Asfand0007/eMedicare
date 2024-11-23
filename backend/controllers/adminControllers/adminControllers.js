const addAdmin=async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userQuery = await pool.query(
        "SELECT * FROM admins WHERE email=$1",
        [email]
    );
    if (userQuery.rows.length != 0)
        return res.status(409).json({ msg: "User email already exsits" });

    const salt = await bcrypt.genSalt();
    const bcryptPassword = await bcrypt.hash(password, salt);

    console.log(firstName, lastName, email, password)

    const newUser = await pool.query(
        "INSERT INTO admins (firstname, lastname, email, authpassword) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, bcryptPassword]
    );
    return res.json(newUser.rows[0]);
}

module.exports={
    addAdmin
};