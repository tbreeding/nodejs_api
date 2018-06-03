const {ObjectID} = require('mongodb');
const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');

const {MONGOOSE} = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const APP = EXPRESS();

const PORT = process.env.PORT || 3000;

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

APP.get('/todos', (req, res) => {
    Todo.find()
    .then(todos => {
        res.send({todos})
    }, err => {
        res.status(400).send(err);
    })
})

APP.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(ObjectID.isValid(id)) {
        Todo.findById(req.params.id).then(todo => {
            if(todo) {
                res.send({todo});
            } else {
                res.status(404).send(); //not found
            }
        }).catch(err => res.send(err));
    } else {
        res.status(404).send(); //bad request
    };
});

APP.listen(PORT, () => {
    console.log(`Started on port ${PORT}`);
});

module.exports = { APP };