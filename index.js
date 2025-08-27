require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.MONGODB_URL;

const doctorSchema = new mongoose.Schema({
    doctorId: {type: Number, required: true, unique: true}, 
    name: {type: String, required: true},
    specialization: {type: String, required: true},
    fee: {type: Number, required: true}, 
    status: {type: Boolean},
    image: {type: String},
    details: {type: String}, 
    timingSlots: [{type: Number}],
    languages: [{type: String}],
    appointments: [{
        patientName: { type: String, required: true },
        phone_no: {type: String, required: true},
        timeSlot: { type: Number, required: true }
        }],
    });
const doctors = mongoose.model('doctors', doctorSchema);

const initializeDBandServer = async () => {
    try {
        await mongoose.connect(mongoDBURL);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.log(`MongoDB connection Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBandServer();

app.get('/doctors/', async (req, res) => {
    try {
        const {specialization = ""} = req.query;
        const specRegex = new RegExp(specialization);

        const result = await doctors.find({specialization: specRegex});
        res.json(result);
    } catch (error) {
        res.status(5000).send({error: 'Error fetching doctor details'});
    }
});

module.exports = app;
