if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const jwt= require('jsonwebtoken')

// const VerifyJWT= (req,res, next)=>{
//     const token= req.header('token');
//     if(!token)
//         return res.status(401).json({msg:"not Authorization"});

//     jwt.verify(token, process.env.JWT_ADMIN_KEY, (err, payload)=>{
//         if(err)
//             return res.status(401).json({msg:"not Authorization"});
        
//         req.userID= payload.user;
//         req.role= payload.role;
//         next();
//     })
// }

const VerifyJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: "Unauthorized: Token missing or invalid" });
  }

  const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'

  jwt.verify(token, process.env.JWT_ADMIN_KEY, (err, payload) => {
      if (err) return res.status(401).json({ msg: "Unauthorized: Token verification failed" });

      req.userID = payload.user;
      req.role = payload.role;
      next();
  });
};


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.role)) {
        return res.status(403).json({ message: `Authorization denied, not amongst ${roles}` });
      }
      next();
    };
  };
  

module.exports= {VerifyJWT, authorizeRoles}