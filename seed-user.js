// backend-project/seed-user.js
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'whzmark',
    password: 'Mutijima1.', // <-- Update this with your actual local MySQL root password!
    database: 'PSSMS' // <-- Update if your database name is different
});

const createExamUser = async () => {
    const username = 'mutijima';
    const rawPassword = 'Mutijima1.';
    
    // Encrypt the password exactly how the authentication module expects it
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const query = "INSERT INTO Users (Username, Password) VALUES (?, ?) ON DUPLICATE KEY UPDATE Password = ?";

db.query(query, [username, hashedPassword, hashedPassword], (err, result) => {
        if (err) {
            console.error("Database seed failed:", err.message);
        } else {
            console.log("SUCCESS: User 'mutijima' with password 'Mutijima1.' created successfully!");
        }
        db.end();
        process.exit();
    });
};

createExamUser();