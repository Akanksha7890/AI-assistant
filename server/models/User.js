const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // Ek email se ek hi account
    },
    password: { 
        type: String, 
        required: true 
    },
    profileImage: { 
        type: String, 
        default: "" // Future mein profile pic ke liye
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', UserSchema);