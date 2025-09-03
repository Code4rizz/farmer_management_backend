const express = require('express');
const Application = require('../model/Application');
const authMiddleware = require('../middleware/authmiddleware');
const router=express.Router();


router.get("/application/search",authMiddleware(['Inspector']), async (req, res) => {
    try{
        const  fieldId  = req.query.field_id;
       
        const trimedFieldId =fieldId.trim();
        const application = await Application.findOne({ field_id: trimedFieldId });
        
        if(!application){
            return res.status(404).json({message: "Application not found"});
            
        }
        res.status(200).json({application});}
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }});

router.get("/application/:id",authMiddleware(['Inspector']), async (req, res) => {
    try{
        const id = req.params.id;
        const application = await Application.findById(id);
        if(!application){
            return res.status(404).json({message: "Application not found"});
        }
        res.status(200).json({application});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }});

router.put("/inspect_application/:id",authMiddleware(['Inspector']),async (req,res)=>
{
    try{
        const id = req.params.id;
        const {status,idate,reason,name}= req.body
        const updatedata={
            Inspection:{
                idate: idate,
                iname: name,
                status:status,
                reason: reason || ''
            }
        };
        if(status==="Approved"){
            updatedata.status="Inspected";
        }
        else{
            updatedata.status="Rejected";
        }
        const application = await Application.findById(id);

        const updatedapplication = await Application.findByIdAndUpdate(id,updatedata,{new:true,runValidators:true});
        res.status(200).json({message:"Application inspected successfully"});


    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
})

module.exports=router;