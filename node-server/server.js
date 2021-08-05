'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { loginValidationObject, questionValidationObject, deleteQuesitonValidationObject, takeQuizValidationObject, choiceValidationObject } = require('./dtos/api.dto.js')
const validator = require('./utils/validator.js')
const User = require('./user.js');
const Trivia = require('./api/trivia.js');
const guards = require('./guards/roleguard.js')
const UNAUTHED_ENDPOINTS = [
  "/session",
  "/user"
]

const app = express();
app.use(bodyParser.json({ extended: true }));


// auth middleware
app.use(function authenticationMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    if(UNAUTHED_ENDPOINTS.includes(req.originalUrl)) {
      next()
      return;
    }
    res.status('401').json({"message": 'Unauthorized'})
  }
  const [authType, token] = authHeader && authHeader.split(' ')

  if (authType.toLocaleLowerCase() !== 'bearer') {
    throw new Error('authorization header improperly supplied');
  }

  req.user = User.decryptUser(token)
  next()
})


// Define endpoints
app.post('/user', validator.validate(loginValidationObject, ["username", "password"]), (req, res) => {
    User.createUser(req.body.username, req.body.password);
    res.status(200).json({ success: true }); 
});

// Any admin can make an admin
app.post('/user/makeadmin', validator.validate(loginValidationObject, ["username"]), guards.roleGuard('admin'), (req, res) => {
    res.status(200).json({ success: User.makeAdmin(req.body.username) });
})

app.get('/user/:username', (req, res) => {
  const user = User.findUserByName(req.params.username);
  if (!user) {
    res.status(404).json({ errorCode: '2', message: 'User Not Found' });
    return;
  } else {
    res.status(200).json({ username: user.username, score: user.score });
  }
});

app.post('/session', validator.validate(loginValidationObject, ["username", "password"]), (req, res) => {
    const token = User.createSession(req.body.username, req.body.password);
    res.status(200).json({ token });
});

app.get('/quiz', (req, res) => {
  res.status(200).json({ quiz: Trivia.getQuestions() });
});

app.post('/quiz', validator.validate(takeQuizValidationObject, ["choices"]), (req, res) => {
  try { 
    // do nested validation here
    req.body.choices.forEach((o) => {
      validator.isValid(o, choiceValidationObject, ["question", "answer"])
    })
  }
  catch (e) {
    res.status(400).json({"message": e.message})
  }
  finally {
    const user = req.user;
    const choices = req.body.choices;
    const scores = Trivia.scoreQuestions(choices);
    user.score += scores.filter(result => result.isCorrect).length;
    res.status(200).json({ scores });
  }
});

/**
 * TODO: Implement me! Should add a new question to the quiz.
 */
app.post('/question', validator.validate(questionValidationObject, ["answer", "prompt", "otherChoices"]), guards.roleGuard('admin'), (req, res) => {
    Trivia.addQuestion(req.body.prompt, req.body.answer, req.body.otherChoices)
    res.status(200).json({ success: true });
});

/**
 * TODO: Implement me! Should remove a question from the quiz.
 */
app.delete('/question', validator.validate(deleteQuesitonValidationObject, ['questionId']), guards.roleGuard('admin'), (req, res) => {
  
    const isDeleted = Trivia.deleteQuestion(req.body.questionId)
    if (isDeleted) {
      res.status(200).json({ success: isDeleted });
    }
    else {
      res.status(404).json({ success: isDeleted, message: "Question not found" });
    }
});


// Custom error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({"message": "Server side error."})
});

// Start listening
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Boom Sports Quiz API listening at http://localhost:${port}`));
