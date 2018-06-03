const {ObjectID} = require('mongodb');
const {MONGOOSE} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5b13ad3d41bae329f0b8f57f';


// Todo.remove({})
//     .then(result => {
//         console.log(result);
//     });
    
Todo.findOneAndRemove({_id: id})
    .then(todo => {
        console.log(todo);
    })

// Todo.findByIdAndRemove(id)
//     .then(todo => {
//         console.log(todo);
//     })
