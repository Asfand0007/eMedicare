require("dotenv").config
const jwt= require('jsonwebtoken')

const VerifyJWT= (req,res, next)=>{
    const token= req.header('token');
    console.log("token:",token);
    if(!token)
        return res.status(403).json({msg:"Authorization denied, not an admin"});

    jwt.verify(token, process.env.JWT_ADMIN_KEY, (err, payload)=>{
        if(err)
            return res.status(403).json({msg:"Authorization denied, not an admin"});
        
        req.userID= payload.user;
        req.role= payload.role;
        console.log("payload.role:", payload.role);
        next();
    })
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      console.log("authorizeRoles:", roles);
      console.log("req.role:",req.role );
      if (!roles.includes(req.role)) {
        return res.status(403).json({ message: 'Access Denied' });
      }
      next();
    };
  };
  

module.exports= {VerifyJWT, authorizeRoles}