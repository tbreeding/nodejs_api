const { ObjectID } = require('mongodb');
const JWT = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'tim@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: JWT.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
     _id: userTwoId,
     email: 'tom@example.com',
     password: 'userTwoPass',
     tokens: [{
        access: 'auth',
        token: JWT.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completeAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos, (error, docs) => {
            if(error){
                return done(error);
            }
        });
    }).then(() => done());
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let user1 = new User(users[0]).save();
        let user2 = new User(users[1]).save();

        return Promise.all([user1, user2])
    }).then(() => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};