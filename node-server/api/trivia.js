'use strict';
// Load questions from json
const questions = require('./questions.json');
const { v4: uuidv4 } = require('uuid');


const questionsWithoutAnswers = questions.map(question => {
  return { id: question.id, prompt: question.prompt, choices: question.choices };
});

function getQuestions() {
  return questionsWithoutAnswers;
}

function scoreQuestions(choices) {
  return questions.map(question => {
    const id = question.id;
    const choice = choices.find(x => x.question === id) || {};
    return { id, isCorrect: question.answer === choice.answer, correctAnswer: question.answer };
  });
}

function addQuestion(prompt, answer, otherChoices) {

  otherChoices.push(answer)
  const question = {
    id: uuidv4(),
    prompt,
    choices: shuffleChoices(otherChoices.map((choice) => {
      return {
        id: uuidv4(),
        prompt: choice
      }
    })),
    answer: ""
  }

  //set answer uuid
  question.answer = question.choices.filter((o) => o.prompt == answer)[0].id

  questions.push(question)
  return question
}



function deleteQuestion(questionId) {
  const questionToDeleteArr = questions.filter(o => o.id == questionId)
  if (questionToDeleteArr.length > 0) {
    const indexOfQ = questions.indexOf(questionToDeleteArr[0])
    delete questions[indexOfQ]
    return true
  }
  else {
    return false
  }
}

function shuffleChoices (arr){
  // using this so we dont always have the answer at #4
  return [...arr].map( (_, i, arrCopy) => {
      var rand = i + ( Math.floor( Math.random() * (arrCopy.length - i) ) );
      [arrCopy[rand], arrCopy[i]] = [arrCopy[i], arrCopy[rand]]
      return arrCopy[i]
  })
}


module.exports = {
  getQuestions,
  scoreQuestions,
  addQuestion,
  deleteQuestion,
  test: {
    questions,
  },
};
