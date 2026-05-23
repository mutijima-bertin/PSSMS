// config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'whzmark',
    password: 'Mutijima1.', // Leave empty if your local sudo mariadb has no password, or fill it in
    database: 'PSSMS'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to PSSMS MariaDB Database.');
});

module.exports = db;