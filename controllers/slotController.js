// controllers/slotController.js
const db = require('../config/db');

exports.addSlot = (req, res) => {
    const { SlotNumber, SlotStatus } = req.body;

    if (!SlotNumber) {
        return res.status(400).json({ message: "Slot Number is required" });
    }

    const query = "INSERT INTO ParkingSlot (SlotNumber, SlotStatus) VALUES (?, ?)";
    db.query(query, [SlotNumber, SlotStatus || 'Available'], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Parking slot initialized successfully!" });
    });
};