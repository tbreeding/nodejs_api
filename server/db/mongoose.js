const MONGOOSE = require('mongoose');

MONGOOSE.Promise = global.Promise;
MONGOOSE.connect(process.env.MONGODB_URI);

module.exports = {
    MONGOOSE
}