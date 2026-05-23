// controllers/recordController.js
const db = require('../config/db');

// 1. CREATE: Record Car Entry (Insert operation & Update Slot Status)
exports.createRecord = (req, res) => {
    const { PlateNumber, SlotNumber } = req.body;

    if (!PlateNumber || !SlotNumber) {
        return res.status(400).json({ message: "Plate number and Slot number are required" });
    }

    // Insert new check-in record
    const insertQuery = "INSERT INTO ParkingRecord (PlateNumber, SlotNumber, EntryTime) VALUES (?, ?, NOW())";
    
    db.query(insertQuery, [PlateNumber, SlotNumber], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Real-time Update: Change slot status to Occupied
        const updateSlotQuery = "UPDATE ParkingSlot SET SlotStatus = 'Occupied' WHERE SlotNumber = ?";
        db.query(updateSlotQuery, [SlotNumber], (slotErr) => {
            if (slotErr) return res.status(500).json({ error: slotErr.message });
            
            res.status(201).json({ message: "Car checked in successfully. Slot status updated to Occupied." });
        });
    });
};

// 2. RETRIEVE: Get All Parking Records (With associated car and slot info)
exports.getAllRecords = (req, res) => {
    const query = `
        SELECT pr.*, c.DriverName, c.PhoneNumber 
        FROM ParkingRecord pr
        JOIN Car c ON pr.PlateNumber = c.PlateNumber
        ORDER BY pr.EntryTime DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

// 3. UPDATE: Record Car Exit (Calculates Duration, Fee, and updates Slot Status)
exports.exitCar = (req, res) => {
    const { RecordID } = req.body;

    if (!RecordID) {
        return res.status(400).json({ message: "Record ID is required" });
    }

    // Step A: Find the entry details
    const findQuery = "SELECT SlotNumber, EntryTime FROM ParkingRecord WHERE RecordID = ?";
    db.query(findQuery, [RecordID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Active parking session not found" });

        const { SlotNumber, EntryTime } = results[0];
        const ExitTime = new Date();
        const entryDate = new Date(EntryTime);

        // Calculate time difference in milliseconds
        const diffMs = ExitTime - entryDate;
        // Convert to total hours
        const totalHoursRaw = diffMs / (1000 * 60 * 60);
        
        // Dynamic Exam Rule: 500RWF per hour, under an hour is charged the full hourly rate
        const calculatedDuration = Math.ceil(totalHoursRaw) || 1; // Math.ceil rounds up fractions
        const amountToPay = calculatedDuration * 500;

        // Step B: Update the Parking Record with exit times and final duration
        const updateRecordQuery = "UPDATE ParkingRecord SET ExitTime = NOW(), Duration = ? WHERE RecordID = ?";
        db.query(updateRecordQuery, [calculatedDuration, RecordID], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });

            // Step C: Insert into Payment Table automatically to finalize checkout bills
            const paymentQuery = "INSERT INTO Payment (RecordID, AmountPaid, PaymentDate) VALUES (?, ?, NOW())";
            db.query(paymentQuery, [RecordID, amountToPay], (payErr) => {
                if (payErr) return res.status(500).json({ error: payErr.message });

                // Step D: Re-release the slot back to 'Available' in real time
                const freeSlotQuery = "UPDATE ParkingSlot SET SlotStatus = 'Available' WHERE SlotNumber = ?";
                db.query(freeSlotQuery, [SlotNumber], (freeErr) => {
                    if (freeErr) return res.status(500).json({ error: freeErr.message });

                    res.status(200).json({
                        message: "Car checked out successfully!",
                        bill: {
                            RecordID,
                            DurationHours: calculatedDuration,
                            AmountPaid: amountToPay
                        }
                    });
                });
            });
        });
    });
};

// 4. DELETE: Permanently drop a historical record
exports.deleteRecord = (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM ParkingRecord WHERE RecordID = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Parking record deleted permanently from historical storage." });
    });
};