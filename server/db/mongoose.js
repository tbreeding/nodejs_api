const MONGOOSE = require('mongoose');

MONGOOSE.Promise = global.Promise;
MONGOOSE.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    MONGOOSE
}