const MONGOOSE = require('mongoose');
const VALIDATOR = require('validator');
const JWT = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new MONGOOSE.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: VALIDATOR.isEmail,
            message: '{VALUE} is not a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    
    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = JWT.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => token);
};

let User = MONGOOSE.model('User', UserSchema);

module.exports = {
    User
};