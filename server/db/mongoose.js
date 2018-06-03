const MONGOOSE = require('mongoose');

MONGOOSE.Promise = global.Promise;
MONGOOSE.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    MONGOOSE
}