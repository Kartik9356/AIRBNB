const express = require("express")
const app = express();
const cookiep= require("cookie-parser")


app.use(cookiep())
app.get("/setcookie",(req,res)=>{
    res.cookie("name","ram")
    res.send("hello from cookie")
})
app.get("/getcookie",(req,res)=>{
    res.send(req.cookies)
})

const user= require("./routs/user.js")

app.use("/user",user);

app.listen(3000)