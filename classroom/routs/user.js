const express = require("express")
const router = express.Router({mergeParams:true});

router.get("/",(req,res)=>{
    res.send("hello from uder")
})


router.get("/:id",(req,res)=>{
    res.send(`hello from uder ${req.params.id}`)
})

module.exports= router