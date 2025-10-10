const express=require("express")
const app=express();
const authentication=require("./middlewheres/authntication.js")
const auth=require("./auth service/index")
const path = require("path");
const reccamendation=require("./section B,C/section b/index.js")
const commen=require("./section B,C/commen relationship/index.js")
const { initVectorDB } = require("./vectordb");
const newspaper = require("./newspaper/index.js");
const errorHandler = require("./middlewheres/errhandaling.js");
require("dotenv").config();




app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))


app.use(initVectorDB);


app.get("/verifytoken",authentication,(req,res)=>{
    res.status(200).json({message:"token valied"})

})
app.use("/auth",auth)
app.use("/recc",reccamendation)
app.use("/commen",commen)
app.use("/newspaper", authentication, newspaper); 


app.use(errorHandler);


app.listen(3000,()=>{
    console.log("server is up and running in port 3000")
})