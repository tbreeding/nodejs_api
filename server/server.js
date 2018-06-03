require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');


const {MONGOOSE} = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const APP = EXPRESS();

const PORT = process.env.PORT;

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
        Todo.findById(id).then(todo => {
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

APP.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(ObjectID.isValid(id)) {
        Todo.findByIdAndRemove(id).then(todo => {
            if(todo) {
                res.send({todo});
            } else {
                res.status(404).send(); //not found
            }
    }).catch(err => res.status(400).send());
    } else {
        res.status(404).send(); //bad request
    }
});

APP.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then(todo => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch(err => {
        res.status(400).send();
    })
});

APP.listen(PORT, () => {
    console.log(`Started on port ${PORT}`);
});

APP.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);
    
    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    })
    .catch(err => {
        res.status(400).send(err);
    })
});

module.exports = { APP };