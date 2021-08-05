'use strict';
const Trivia = require('../../api/trivia');

it('gets questions', () => {
  const questions = Trivia.getQuestions();
  expect(questions).toBeDefined();
  expect(questions.length).toEqual(Trivia.test.questions.length);
});

it('scores questions with perfect accuracy', () => {
  const choices = Trivia.test.questions.map(question => { return { question: question.id, answer: question.answer }; });
  const score = Trivia.scoreQuestions(choices);
  expect(score.filter(result => result.isCorrect).length).toEqual(Trivia.test.questions.length);
});

it('scores questions at 0% accuracy', () => {
  const choices = [];
  const score = Trivia.scoreQuestions(choices);
  expect(score.filter(result => result.isCorrect).length).toEqual(0);
});

it('deletes a question', () => {
  const question = Trivia.test.questions[0];
  const isDeleted = Trivia.deleteQuestion(question.id);
  expect(isDeleted).toEqual(true);

});

it('cant find question to delete', () => {
  const isDeleted = Trivia.deleteQuestion('garbageID');
  expect(isDeleted).toEqual(false);
});

it('adds a question', () => {
  const prompt = "test";
  const answer = "testAnswer";
  const choices = ["test1", "test2", "test3"];
  const results = Trivia.addQuestion(prompt, answer, choices);
  const returnedChoiceList = results.choices.map(o => o.prompt).sort()
  expect(results.prompt).toEqual(prompt);
  expect(returnedChoiceList).toEqual(["test1", "test2", "test3", "testAnswer"].sort());
})

