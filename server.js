// server.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 5000;

// Global Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Matches React app port
    credentials: true
}));

// Session Setup
app.use(session({
    secret: 'smartpark_secret_key_2025',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set false for HTTP localhost testing
        maxAge: 1000 * 60 * 60 * 2 // 2 Hours
    }
}));

// Mount Authentication Endpoints
app.use('/api/auth', authRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('SmartPark Backend API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server executing seamlessly on port ${PORT}`);
});