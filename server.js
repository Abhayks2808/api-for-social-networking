const express=require("express");
const connectDB=require("./config/db");
const app=express();

//connect database
connectDB();

//Init middlware
app.use(express.json());

app.get("/",(req,res) => {
  res.send("API running");
})
// Define routes
app.use("/api/users",require("./routes/api/users"));
app.use("/api/auth",require("./routes/api/auth"));
app.use("/api/posts",require("./routes/api/posts"));
app.use("/api/profile",require("./routes/api/profile"));




const Port=process.env.Port || 8080;
app.listen(Port,(req,res) => {
  console.log(`Server started on Port ${Port}`);

})