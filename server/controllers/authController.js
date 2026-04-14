const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP LOGIC
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save User
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ msg: "Account created! Please login." });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// LOGIN LOGIC
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        // 2. Compare Password (Jo user ne dala vs Jo DB mein hashed hai)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // 3. Create & Return JWT Token
        const payload = { user: { id: user.id } };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }, // Token 24 ghante tak valid rahega
            (err, token) => {
                if (err) throw err;
                res.json({ token, username: user.username });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};