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
              .set('x-auth', users[0].tokens[0].token)
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
              .set('x-auth', users[0].tokens[0].token)
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
              .set('x-auth', users[0].tokens[0].token)
              .expect(200)
              .expect(res => {
                  expect(res.body.todos.length).toBe(1);
              })
              .end(done);
      });
  });

  describe('GET /todos/:id', () => {
      
      it('should return a todo doc', done => {
          REQUEST(APP)
              .get(`/todos/${todos[0]._id.toHexString()}`)
              .set('x-auth', users[0].tokens[0].token)
              .expect(200)
              .expect((res) => {
                  expect(res.body.todo.text).toBe(todos[0].text);
              })
              .end(done)
      });

      it('should not return a todo doc created by other user', done => {
        REQUEST(APP)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

      it('should return 404 if todo not found', done => {
          let valid_id = new ObjectID();

          REQUEST(APP)
              .get(`/todos/${valid_id.toHexString()}`)
              .set('x-auth', users[0].tokens[0].token)
              .expect(404)
              .end(done);
      });

      it('should return 404 if ID not valid', done => {
          let invalid_id = "5b13a09c662e642510495cdc11";
          REQUEST(APP)
              .get(`/todos/${invalid_id}`)
              .set('x-auth', users[0].tokens[0].token)
              .expect(404)
              .end(done);
      });

  });

  describe('DELETE /todos/:id', () => {
      
          it('should remove a todo doc', done => {
              let hexId = todos[1]._id.toHexString();
              REQUEST(APP)
                  .delete(`/todos/${hexId}`)
                  .set('x-auth', users[1].tokens[0].token)
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
                          expect(todo).toBeFalsy();
                          done();
                      }).catch(err => done(err));
                  });
          });

          it('should not remove a todo doc created by other user', done => {
            let hexId = todos[0]._id.toHexString();
            REQUEST(APP)
                .delete(`/todos/${hexId}`)
                .set('x-auth', users[1].tokens[0].token)
                .expect(404)
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }  
                    Todo.findById(hexId)
                    .then(todo => {
                        expect(todo).toBeTruthy();
                        done();
                    }).catch(err => done(err));
                });
        });
      
          it('should return 404 if todo not found', done => {
              let valid_id = new ObjectID();
      
              REQUEST(APP)
                  .delete(`/todos/${valid_id.toHexString()}`)
                  .set('x-auth', users[0].tokens[0].token)
                  .expect(404)
                  .end(done);
          });
      
          it('should return 404 if ID not valid', done => {
              let invalid_id = "5b13a09c662e642510495cdc11";
              REQUEST(APP)
                  .delete(`/todos/${invalid_id}`)
                  .set('x-auth', users[0].tokens[0].token)
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
              .set('x-auth', users[0].tokens[0].token)
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

      it('should not update a todo created by other user', done => {
        let hexId = todos[0]._id.toHexString();
        let text = 'new text';
        REQUEST(APP)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(404)
            .end(done);
    });

        it('should clear completedAt when todo is not completed', done => {
            let hexId = todos[1]._id.toHexString();
            let text = 'new text';
            REQUEST(APP)
                .patch(`/todos/${hexId}`)
                .set('x-auth', users[1].tokens[0].token)
                .send({
                    completed: false,
                    text,
                    completedAt: null
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completedAt).toBeFalsy();
                })
                .end(done);
        });
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
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body._id).toBeTruthy();
          expect(res.body.email).toBe(email);
        })
        .end(err => {
          if(err) return done(err);
        
          User.findOne({email}).then(user => {
            expect(!!user).toBe(true);
            expect(user.password).not.toBe(password);
            done();
          }).catch(err => done(err));
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
  });

  describe('POST /users/login', () => {
      it('should login user and return AUTH token', done => {
        REQUEST(APP)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(users[1]._id).then(user => {
                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    // expect(user.tokens[1].access == 'auth').toBe(true);
                    // expect(user.tokens[1].token == res.headers['x-auth']).toBe(true);
                    done();
                }).catch(err => done(err));
            });
      });

      it('should reject invalid login', done => {
        let invalid = 'blah';
        REQUEST(APP)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: invalid
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err) return done(err);

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch(err => done(err));
            })
      });

      describe('DELETE /users/me/token', () => {
        it('should delete a token if it exists', done => {
            REQUEST(APP)
                .delete('/users/me/token')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .end((err, res) => {
                    if(err) return done(err);

                    User.findById(users[0]._id).then(user => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch(err => done(err));
                })
        });
      });
  }); 
});