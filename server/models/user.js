const MONGOOSE = require('mongoose');
const VALIDATOR = require('validator');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const BCRYPT = require('bcryptjs');

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
    let token = JWT.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token
    });
};
UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;
    return User.findOne({ email }).then(user => {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            BCRYPT.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user)
                } else {
                    reject();
                }
               
            })
        })
    })
}
UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = JWT.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });   
};

UserSchema.methods.removeToken = function (token) {
    let user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
};

UserSchema.pre('save', function(next) {
    let user = this;

    if(user.isModified('password')) {
        BCRYPT.genSalt(10, (err, salt) => {
            BCRYPT.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });            
        });
    } else {
        next();
    }
});

let User = MONGOOSE.model('User', UserSchema);

module.exports = {
    User
};