require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
const cors = require('cors');

// Fix for duplex error in Node.js
globalThis.fetch = (url, options) => {
    return import('node-fetch').then(({ default: fetch }) => fetch(url, { ...options, duplex: 'half' }));
};

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',  
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Your Google Sheet ID
const SHEET_ID = process.env.SHEET_ID;

// Upload endpoint
app.post('/upload', upload.single('cv'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        console.log('Received file:', req.file);

        const { name, email, phone } = req.body; // Get user details from form
        const filePath = req.file.path;
        const fileName = `${Date.now()}-${req.file.originalname}`;

        // Upload CV to Supabase Storage
        console.log(`Uploading ${fileName} to Supabase`);
        const { data, error } = await supabase
            .storage
            .from('job-application-cvs')  
            .upload(`cvs/${fileName}`, fs.createReadStream(filePath), {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Error during Supabase upload:', error);
            return res.status(500).send('Error uploading to Supabase.');
        }

        // Generate public URL
        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/job-application-cvs/cvs/${fileName}`;
        console.log(`File uploaded successfully: ${publicUrl}`);

        // Save data to Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'CV_Data!A:D', 
            valueInputOption: 'RAW',
            requestBody: {
                values: [[name, email, phone, publicUrl]],
            },
        });

        console.log('Data saved to Google Sheet successfully!');

        // Respond with success
        res.json({ 
            message: 'CV uploaded and data saved to Google Sheet!', 
            publicUrl 
        });

        // Clean up the temporary file
        fs.unlinkSync(filePath);

    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
