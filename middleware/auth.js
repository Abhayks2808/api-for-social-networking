const {secret_key}=require('../config/secret');
const jwt=require("jsonwebtoken");

module.exports=function(req,res,next){
// Get Token from header
 const token=req.header('x-auth-token');
 
 if(!token) {
     res.status(401).json({mag:'No token,authorization denied'});
 }

 try{
   const decoded=jwt.verify(token,secret_key);
    req.user=decoded.user;
   next();
 }catch(err){
   res.status(401).json({msg:'TOken is npt valid'});
 }

}