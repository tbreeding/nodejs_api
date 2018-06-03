const expect = require('expect');
const REQUEST = require('supertest');
const { ObjectID} = require('mongodb');

const {APP} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];



beforeEach(done => {
    Todo.remove({}).then(() => {
            return Todo.insertMany(todos, (error, docs) => {
                if(error){
                    return done(error);
                }
            });
        }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', done => {
        let text = 'Test todo text';

        REQUEST(APP)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text})
                .then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err => done(err));
            });
    });
    
    it('should not create todo with invalid body data', done => {
        REQUEST(APP)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', done => {
        REQUEST(APP)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    
    it('should return todo doc', done => {
        REQUEST(APP)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done)
    });

    it('should return 404 if todo not found', done => {
        let valid_id = new ObjectID();

        REQUEST(APP)
            .get(`/todos/${valid_id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if ID not valid', done => {
        let invalid_id = "5b13a09c662e642510495cdc11";
        REQUEST(APP)
            .get(`/todos/${invalid_id}`)
            .expect(404)
            .end(done);
    });

});

    describe('DELETE /todos/:id', () => {
    
        it('should remove a todo doc', done => {
            let hexId = todos[1]._id.toHexString();
            REQUEST(APP)
                .delete(`/todos/${hexId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(hexId);
                })
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }  
                    Todo.findById(hexId)
                    .then(todo => {
                        expect(todo).toBe(null);
                        done();
                    }).catch(err => done(err));
                });
        });
    
        it('should return 404 if todo not found', done => {
            let valid_id = new ObjectID();
    
            REQUEST(APP)
                .delete(`/todos/${valid_id.toHexString()}`)
                .expect(404)
                .end(done);
        });
    
        it('should return 404 if ID not valid', done => {
            let invalid_id = "5b13a09c662e642510495cdc11";
            REQUEST(APP)
                .delete(`/todos/${invalid_id}`)
                .expect(404)
                .end(done);
        });

});