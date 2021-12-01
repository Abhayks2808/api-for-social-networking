const express=require("express");
const gravatar=require("gravatar");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const {secret_key}=require('../../config/secret');
const {check,validationResult}=require("express-validator");
const User=require("../../models/User");
const router=express.Router();

// @route POST api/user
// @desc Register user
// @access Public

router.post("/",
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail().normalizeEmail(),
    check('password','Please enter a  password with atleast one special character and min length should be 8 and atleastt one small character and atleast one Capital character').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
,
async (req,res) => {
const errors = validationResult(req);
if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
 
const {name,email,password}=req.body;
  
  try{
    let user=await User.findOne({email});
    if(user) return res.status(400).json({errors:[{msg:'User already exists'}]});
    const avatar=gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'mm'
    })
    user=new User({
        name,
        email,
        password,
        avatar
    });
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(password,salt);
    await user.save();
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
