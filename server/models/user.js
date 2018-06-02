const MONGOOSE = require('mongoose');

let User = MONGOOSE.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true 
    }
});

module.exports = {
    User
};