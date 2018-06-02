 const { MongoClient, ObjectID } = require('mongodb');

 MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        console.log("Unable to connecto to MongoDB server.");
    }
    console.log("Connected to MongoDB server" );
    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: ObjectID("5b124c48eb7eda1a60b6890a")
    // }, {
    //     $set: { 
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then(result => {
    //     console.log(result);
    // })
    db.collection('Users').findOneAndUpdate({
        _id: ObjectID("5b124d078e1cf32a7c3bf2f3")
    }, {
        $set: { 
            name: 'Tim'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then(result => {
        console.log(result);
    })
    // client.close();
 });