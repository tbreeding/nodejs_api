const expect = require('expect');
const REQUEST = require('supertest');
const { ObjectID } = require('mongodb');

const {APP} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('/todos Test Cases', () => {
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

  describe('PATCH /todos/:id', () => {
      
      it('should update the todo', done => {
          let hexId = todos[0]._id.toHexString();
          let text = 'new text';
          REQUEST(APP)
              .patch(`/todos/${hexId}`)
              .send({
                  completed: true,
                  text
              })
              .expect(200)
              .expect((res) => {
                  expect(res.body.todo.text).toBe(text);
                  expect(res.body.todo.completed).toBe(true);               
                  expect(typeof res.body.todo.completedAt).toBe('number');
              })
              .end(done);
      });

      it('should clear completedAt when todo is not completed', done => {
          let hexId = todos[1]._id.toHexString();
          let text = 'new text';
          REQUEST(APP)
              .patch(`/todos/${hexId}`)
              .send({
                  completed: false,
                  text,
                  completedAt: null
              })
              .expect(200)
              .expect((res) => {
                  expect(res.body.todo.completed).toBe(false);
                  expect(res.body.todo.text).toBe(text);
                  expect(res.body.todo.completedAt).toBe(null);
              })
              .end(done);
      });

      // it('should return 404 if todo not found', done => {
      //     let valid_id = new ObjectID();

      //     REQUEST(APP)
      //         .patch(`/todos/${valid_id.toHexString()}`)
      //         .expect(404)
      //         .end(done);
      // });

      // it('should return 404 if ID not valid', done => {
      //     let invalid_id = "5b13a09c662e642510495cdc11";
      //     REQUEST(APP)
      //         .patch(`/todos/${invalid_id}`)
      //         .expect(404)
      //         .end(done);
      // });

  });
});

describe('/users Test Cases', () => {
  describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
      REQUEST(APP)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
      REQUEST(APP)
        .get('/users/me')
        .expect(401)
        .expect(res => {
          expect(res.body).toEqual({});
        })
        .end(done);
    });
  });

  describe('POST /users', () => {
    it('should create a user', done => {
      let email = 'example@example.com';
      let password = '123mnb!';
      REQUEST(APP)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect(res => {
          expect(!!res.headers['x-auth']).toBe(true);
          expect(!!res.body._id).toBe(true);
          expect(res.body.email).toBe(email);
        })
        .end(err => {
          if(err) return done(err);
        
          User.findOne({email}).then(user => {
            expect(!!user).toBe(true);
            expect(user.password == password).toBe(false);
            done();
          })
        });
    });

    it('should return validation error if request invalid', done => {
      let email = '123';
      let password = '123';
      REQUEST(APP)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
    });

    it('should not create user if email in user', done => {
      let email = users[0].email;
      let password = '123abc!';
      REQUEST(APP)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
    });
  })
});