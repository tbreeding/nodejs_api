const expect = require('expect');
const REQUEST = require('supertest');

const {APP} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    text: 'First test todo'
}, {
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
                })
                .catch(err => done(err));
            });
    });
    
    it('should not create todo with invalid body data', (done) => {
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