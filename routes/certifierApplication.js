const express = require('express');
const Application = require('../model/Application');
const authMiddleware = require('../middleware/authmiddleware');
const router=express.Router();

router.put("/certify_application/:id",authMiddleware(['Certifier']),async (req,res)=>
{
    try{
        const id = req.params.id;
        const {cname,fromyr,toyr,status}= req.body
        const updatedata={
            status: status,
            Certification:{
                cname: cname,
                fromyr: fromyr,
                toyr: toyr,
            }
        };
        const updatedapplication = await Application.findByIdAndUpdate(id,updatedata,{new:true,runValidators:true});
        res.status(200).json({message:"Application certified successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }});


module.exports = router;