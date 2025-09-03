const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const authRoutes = require('./routes/Auth');
const farmerapplicationRoutes = require('./routes/FarmerApplication');
const inspectorapplicationRoutes = require('./routes/InspectorApplication');
const certifierapplicationRoutes = require('./routes/certifierApplication');
const app = express();


app.use(express.json());
app.use(cors({
  origin: "https://farmer-management-frontend-fawn.vercel.app", // your frontend URL
  credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerapplicationRoutes);
app.use('/api/inspector', inspectorapplicationRoutes);
app.use('/api/certifier', certifierapplicationRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');});

    
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


const PORT= process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});