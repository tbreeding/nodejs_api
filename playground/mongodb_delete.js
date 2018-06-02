 const { MongoClient, ObjectID } = require('mongodb');

 MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        console.log("Unable to connecto to MongoDB server.");
    }
    console.log("Connected to MongoDB server" );
    const db = client.db('TodoApp');

    //deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'Eat lunch'
    // }).then(result => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({
    //     text: 'Eat lunch'
    // }).then(result => {
    //     console.log(result);
    // });
    
    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({
    //     complete: false
    // }).then(result => {
    //     console.log(result);
    // });
    db.collection('Users').deleteMany({
        name: 'Tim'
    }).then(result => {
        console.log(result);
    });

    db.collection('Users').findOneAndDelete({
        _id: ObjectID("5b124df0e6424e1f947e383c")
    }).then(result => {
        console.log(result);
    });

    // client.close();
 });