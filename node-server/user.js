'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const base64 = require('base-64');

//get env vars
const dotenv = require('dotenv');
dotenv.config()
// Users are just stored in-memory for this sample program
const users = [];
const MAX_USERS = 5000;

function createUser(username, password) {
  const existingUser = findUserByName(username);
  if (existingUser) {
    throw new Error('user already exists');
  }

  const user = {
    username,
    password: sha256hash(password),
    score: 0,
    role: ""
  };

  users.push(user);
  if (users.length > MAX_USERS) {
    // This prevents allocating too much memory
    users.shift();
  }
  if (users.length == 1){
    // make first user an admin, must have an admin to make other admins
    makeAdmin(user.username);
  }
  
  return user;
}

function createSession(username, password) {

  const user = findUserByName(username);
  if (!user) {
    throw new Error('user not found');
  } else if (user.password !== sha256hash(password)) {
    throw new Error('incorrect password');
  } else {
    return encryptUser(user);
  }
}

function findUserByName(username) {
  return users.find(user => user.username === username);
}

function encryptUser(user) {
  const obj = JSON.stringify({ timestamp: Date.now(), ...user });
  const signature = process.env.API_SECRET
  return jwt.sign(obj, signature)
} 

function decryptUser(token) {
  try {
    const data = jwt.verify(token, process.env.API_SECRET);
    delete data.timestamp;
    return data;
  }
  catch (e) {
    throw Error("invalid token");
  }
   
}

function makeAdmin(username) {
  try {
  const user = findUserByName(username);
  if(user == undefined) {
    throw Error("user not found.")
  }
  user.role = 'admin';
  return {success: true}
  }
  catch (e) {
    return {message: e.message};
  }
  
}

function sha256hash(input) {
  // for one way password hash
  return crypto.createHash('sha256').update(String(input), 'utf-8').digest('hex')
}

module.exports = {
  createSession,
  createUser,
  findUserByName,
  encryptUser,
  decryptUser,
  makeAdmin,
  sha256hash,
  test: {
    MAX_USERS
  }
};
