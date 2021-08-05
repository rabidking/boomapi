
const loginValidationObject = {
    username: "",
    password: ""
}

const questionValidationObject = {
  prompt: "",
  answer: "",
  otherChoices: []
}

const deleteQuesitonValidationObject = {
  questionId: ""
}

const takeQuizValidationObject = {
  choices: []
}

const choiceValidationObject = {
  question: "",
  answer: ""
}

module.exports = {
  loginValidationObject,
  questionValidationObject,
  takeQuizValidationObject,
  deleteQuesitonValidationObject,
  choiceValidationObject
}