require('dotenv').config()
const express = require('express')
const cors= require('cors')

const { VerifyJWT, authorizeRoles } = require('./middleware/Auth');
const adminRoutes= require('./routes/admin')
const loginRoutes= require('./routes/login')
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api/login', loginRoutes);

app.use('/api/admin', VerifyJWT, authorizeRoles('admin'), adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});