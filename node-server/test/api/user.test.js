'use strict';

const User = require('../../user.js');

it('creates a user happy path', () => {
  const username = 'a new user';
  const password = 'password321';
  const user = User.createUser(username, password);
  expect(user.username).toEqual(username);
  expect(user.password).toEqual(User.sha256hash(password));
  expect(user.score).toEqual(0);
});

it('creates a user that already exists', () => {
  const username = 'new user 2';
  const password = 'pw';
  User.createUser(username, password);
  expect(() => User.createUser(username, 'different')).toThrowError('user already exists');
});

it('creates a new session happy path', () => {
  const username = 'user3';
  const password = 'pw';
  User.createUser(username, password);
  const session = User.createSession(username, password);
  expect(session).toBeDefined();
});

it('creates a new session for invalid user', () => {
  expect(() => User.createSession('invalid user', 'asdf')).toThrowError('user not found');
});

it('creates a new session with incorrect password', () => {
  const username = 'user 4';
  const password = 'pw';
  User.createUser(username, password);
  expect(() => User.createSession(username, password + 'noise')).toThrowError('incorrect password');
});

it('gets a user that doesn\'t exist', () => {
  const username = 'something that is not already used';
  const user = User.findUserByName(username);
  expect(user).not.toBeDefined();
});

it('ejects users FIFO-style if user limit is exceeded', () => {
  // NOTE: This can get out of hand if User.test.MAX_USERS is very large!
  const password = 'pw';
  const users = Array.from({ length: User.test.MAX_USERS }, (_, index) => index + 1)
    .map(i => User.createUser(`User ${i}`, password));

  // Now add one more user
  const newUser = User.createUser('Outlier', password);

  // We expect that newUser is still found
  expect(User.findUserByName(newUser.username)).toBeDefined();

  // And we expect that all but the first user to still be found
  expect(User.findUserByName(users[0].username)).not.toBeDefined();
  users.slice(1).forEach(user => expect(User.findUserByName(user.username)).toBeDefined());
});

it('can encrypt and decrypt a user without losing data', () => {
  const user = User.createUser('test user', 'password123');
  const token = User.encryptUser(user);
  const decryptedUser = User.decryptUser(token);
  expect(user).toEqual(decryptedUser);
});

it('decrypts an invalid token', () => {
  expect(() => User.decryptUser('foo.bar')).toThrowError('invalid token');
});

