// controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }

    const query = "SELECT * FROM Users WHERE Username = ?";
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = results[0];

        // Compare incoming plain password with encrypted database password
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Create the session
        req.session.user = { id: user.UserID, username: user.Username };
        res.status(200).json({ message: "Login successful", user: req.session.user });
    });
};

exports.checkStatus = (req, res) => {
    if (req.session.user) {
        res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
        res.status(200).json({ loggedIn: false });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Logged out safely" });
    });
};