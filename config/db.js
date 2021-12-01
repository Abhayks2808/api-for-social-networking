const mongoose=require("mongoose");
const {DB_link}=require("./secret");

//connect database
const DB_connection=async() =>{
try{
   await mongoose.connect(DB_link);
   console.log("DB_connected");
}
catch(err){
    console.log("error",err);
    process.exit(1);
}
}


module.exports=DB_connection;




