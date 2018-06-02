const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');

const {MONGOOSE} = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const APP = EXPRESS();

APP.use(BODY_PARSER.json());

APP.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })
    .save()
    .then(doc => {
        res.send(doc);
    }, err => {
        res.status(400).send(err);
    })

});

APP.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { APP };