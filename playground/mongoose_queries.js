const {ObjectID} = require('mongodb');
const {MONGOOSE} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5b1309d90d7c934b20e714e9';
let user_id = '5b127c470fcd762d90274d08';

if(!ObjectID.isValid(id)) {
    console.log('ID not valid');
} else {

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos)
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo)
});

Todo.findById(id).then(todo => {
    if(!todo) return console.log('ID not found');
    console.log('Todo_Id', todo);
}).catch(err => console.log(err));

}

if(!ObjectID.isValid(user_id)) {
    console.log('User ID not valid');
} else {
    User.findById(user_id).then(user => {
        if(!user) return console.log('User ID not found');
        console.log('User Id', JSON.stringify(user, undefined, 2));
    }).catch(err => console.log(err));
}

