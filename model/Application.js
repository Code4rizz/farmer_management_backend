const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    
    field_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    Description: { type: String, required: true },
    standard: { type: String, enum: ['Gold', 'Silver', 'Bronze'], required: true },
    status: { type: String, enum: ['Pending','Inspected', 'Approved', 'Rejected'], default: 'Pending' },

    Inspection : {
        idate: Date,
        iname: String,
        status: {type: String, enum: ["Approved", "Rejected"]},
        reason: String
    },

    Certification: {
        cname: String,
        fromyr: Number,
        toyr: Number,
        
    }}
, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);