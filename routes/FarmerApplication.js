const express = require('express');
const Application = require('../model/Application');
const authMiddleware = require('../middleware/authmiddleware');
const router=express.Router();
const User = require('../model/User');

router.post("/create_application",authMiddleware(['Farmer']), async (req, res) => {
    try{
        const newapplicaiton = new Application(req.body);
        await newapplicaiton.save();
        res.status(201).json({message: "Application submitted successfully"});
    }

    catch(err){

        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.get("/all_applications",authMiddleware(['Inspector','Certifier']), async (req, res) => {
    try{
        const role = req.user.role;
        if(role==="Inspector"){
        const pendingapplications = await Application.find({status:"Pending"}).sort({createdAt: -1});
        if(!pendingapplications){
            return res.status(404).json({message: "No applications found"});
        }
        res.status(200).json({pendingapplications});
    }
    else if(role==="Certifier"){
        const inspectedapplications = await Application.find({status:"Inspected"}).sort({createdAt: -1});
        if(!inspectedapplications){
            return res.status(404).json({message: "No applications found"});
        }
        res.status(200).json({inspectedapplications});
    }}
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }});

router.get("/application/:id", async (req, res) => {
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


router.get("/my_applications/:email", async (req, res) => {
    try{
        const{ email } = req.params;
        const applications = await Application.find({email}).sort({createdAt: -1});
        res.status(200).json({applications});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.delete("/delete_application/:id",authMiddleware(['Farmer']), async (req, res) => {
    try{
        const id = req.params.id;
        const email = req.user.email;
        const result = await Application.deleteOne({_id: id,email: email});
        
        if(result.deletedCount === 0){
            return res.status(404).json({message: "Application not found or you are not authorized to delete this application"});
        }
        res.status(200).json({message: "Application deleted successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }});

router.put("/update_application/:id",authMiddleware(['Farmer']), async (req, res) => {
    try{
        const id = req.params.id;
        const email = req.user.email;
        
        const application = await Application.findOne({_id: id, email: email});
        if(!application){
            return res.status(404).json({message: "Application not found or you are not authorized to update this application"});
        }
        application.phone = req.body.phone || application.phone;
        application.location = req.body.location || application.location;
        application.Description = req.body.Description || application.Description;
        application.standard = req.body.standard || application.standard;

        await application.save();
        res.status(200).json({message: "Application updated successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }});


    router.get("/all_farmers", async (req, res) => {
        try{
            const farmers = await User.find({role: 'Farmer'}).select('-password');
            if(!farmers){
                return res.status(404).json({message: "No farmers found"});
            }
            res.status(200).json({farmers});
        }
        catch(err){
            console.error(err);
            res.status(500).json({message: "Server error"});
        }});
                

        router.get("/my_applications_forall/:email", async (req, res) => {
    try{
        const{ email } = req.params;
        const applications = await Application.find({email,status:"Approved"}).sort({createdAt: -1});
        console.log(applications);
        res.status(200).json({applications});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

module.exports=router;
