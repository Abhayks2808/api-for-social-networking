const express=require("express");
const auth=require('../../middleware/auth');
const bcrypt=require("bcryptjs");
const {check,validationResult}=require("express-validator");
const {secret_key}=require('../../config/secret');
const jwt=require("jsonwebtoken");
const User=require('../../models/User')
const router=express.Router();


router.get("/",auth,async (req,res) => {
try{
 const user=await User.findById(req.user.id).select('-password');
 res.json(user);
}catch(err){
  console.log(err.message);
  res.status(500).send('server-error');
}
});

// @route POST api/user
// @desc Register user
// @access Public

router.post("/",
    check('email','Please include a valid email').isEmail().normalizeEmail(),
    check('password','Password is required').exists()
,
async (req,res) => {
const errors = validationResult(req);
if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
 
const {email,password}=req.body;
  
  try{
    let user=await User.findOne({email});
    if(!user) return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
    
   const isMatch=await bcrypt.compare(password,user.password);

   if(!isMatch){
       return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
   }
    const payload={
        user:{
            id:user.id
        }
    }

    jwt.sign(payload,secret_key,(err,token) =>{
        if(err) throw err;
        res.json({token});
    })
  
  }
  catch(err){
    console.log(err);
    res.status(500).send('Server Error');
  }
  
});

module.exports=router;