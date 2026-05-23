// controllers/carController.js
const db = require('../config/db');

exports.addCar = (req, res) => {
    const { PlateNumber, DriverName, PhoneNumber } = req.body;
    
    if (!PlateNumber || !DriverName || !PhoneNumber) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = "INSERT INTO Car (PlateNumber, DriverName, PhoneNumber) VALUES (?, ?, ?)";
    db.query(query, [PlateNumber, DriverName, PhoneNumber], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Car registered digitally successfully!" });
    });
};