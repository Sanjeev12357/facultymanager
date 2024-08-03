const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const cors=require('cors');

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Sanjeev:Sanjeev123@cluster0.ybrdh6e.mongodb.net/facultymanager', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema
const dataSchema = new mongoose.Schema({
    block: String,
    contact: String,
    coordinator: String,
    eCode: String,
    email: String,
    name: String,
    parentDepartment: String,
    responsibility: String,
    seatingVenue: String,
    year: String
});

// Define a model
const Data = mongoose.model('Data', dataSchema);

// Endpoint to get the JSON data
app.get('/api/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        app.get('/api/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        console.error('Error retrieving data from database',
            err);
        }});
        res.status(500).send('Error retrieving data from database');
    }
});



// Endpoint to load data from JSON file and insert into database
app.get('/api/load-json', async (req, res) => {
    const jsonFilePath = path.join(__dirname, 'data.json');
    fs.readFile(jsonFilePath, 'utf-8', async (err, data) => {
        if (err) {
            console.error('Error reading JSON file', err);
            res.status(500).send('Error reading JSON file');
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (err) {
            console.error('Error inserting data into database', err);
            res.status(500).send('Error inserting data into database');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
