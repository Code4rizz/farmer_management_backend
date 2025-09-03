const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const router=express.Router();


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign({id: user._id, role: user.role, email: user.email},
            process.env.JWT_SECRET
            , { expiresIn: '1h' });
        
        res.status(200).json({ message: 'Login successful', token, 
            user: { id: user._id ,name: user.name, email: user.email, role: user.role } });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }});




router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email});
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = new User({
            name,
            email,  
            password: hashedPassword,
            role
        });

        await newuser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }});

module.exports = router;

