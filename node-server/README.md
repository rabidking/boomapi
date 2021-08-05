# Boom Sports Coding Test
Welcome to the Boom Sports Coding Test. This is designed to be a fun, relatively quick exercise to see how you approach problem-solving in a software development context.

### Overview
This project is an in-memory REST API for running a quiz. The general flow 
through a quiz looks like this:

* `POST /user` to create a new user of the quiz
* `POST /session` to log in with a new session
* `GET /quiz` to get the quiz for a user using token from session call
* `POST /quiz` to submit answers for the quiz using token from session call

There is no front-end interface, so you will have to use `curl`, `wget`, or 
another program for making HTTP requests. Sample curl commands are provided 
here for convenience:

```shell
curl -i --request POST 'http://localhost:3000/user' \
  --header 'Content-Type: application/json' \
  --data-raw '{ "username": "dummy", "password": "pass" }'
```

```shell
curl -i --request POST 'http://localhost:3000/session' \
  --header 'Content-Type: application/json' \
  --data-raw '{ "username": "dummy", "password": "pass" }'
```

```shell
curl -i --request GET 'http://localhost:3000/quiz' \
  --header 'Authorization: Bearer {{TOKEN FROM SESSION CALL GOES HERE}}'
```

```shell
curl -i --request POST 'http://localhost:3000/quiz' \
  --header 'Authorization: Bearer {{TOKEN FROM SESSION CALL GOES HERE}}' \
  --header 'Content-Type: application/json' \
  --data-raw '{ 
    "choices": [
      {"question":"e802a0d2-8a9e-4fbf-82ee-3a9fb8904599","answer":"d08f2e65-e64d-4c19-935b-b5a8690df3e4"},
      {"question":"515048fd-6c61-47e5-be26-0b83a4a820d4","answer":"65afbe70-67e9-43da-a58f-d5bbcfea4045"},
      {{ETC}}
    ]
  }'
```

(Be sure to replace the tokens with the appropriate session token for your user.)

### Objectives
While fully functioning, this API is buggy and brittle. The following tasks 
must be performed to improve and harden the system. You may modify any of the 
files in this project to meet the objectives. Be sure to read through this
entire list first before starting, as the order they are listed may not be the
most efficient order to perform the tasks in.

1. **Endpoint Validation**

   Improve validation on the endpoints and control error responses.  Ensure that the data given is what we expect and return errors if it is not.
   
   Also, since we do not want to return potentially sensitive information to the caller we should ensure that no uncaught exceptions are returned.  

1. **Use JWTs Properly**

    Currently the createSession call returns a rudimentary encryption of the user data.  The proper implementation would 
create a new jwt token and return that.  All subsequent calls would accept an *Authorization* header and verify the identity of the caller.

1. **New Endpoints**

   We would like to also support adding and removing questions from the quiz.  There are already `POST /question` and `DELETE /question` endpoints stubbed
   out. Implement these. You may change their signatures if necessary.

1. **Unit testing**

   The project presented to you has 100% code coverage. You can see this by
   running `npm test` for this project:

   ```shell
   npm test
   
   > boom-sports-trivia-app@1.0.0 test
   > jest --collect-coverage --forceExit
   
   PASS  test/api/trivia.test.js
   PASS  test/api/user.test.js
   -----------|---------|----------|---------|---------|-------------------
   File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
   -----------|---------|----------|---------|---------|-------------------
   All files  |     100 |      100 |     100 |     100 |
    trivia.js |     100 |      100 |     100 |     100 |
    user.js   |     100 |      100 |     100 |     100 |
   -----------|---------|----------|---------|---------|-------------------
   
   Test Suites: 2 passed, 2 total
   Tests:       12 passed, 12 total
   Snapshots:   0 total
   Time:        1.488 s, estimated 2 s
   Ran all test suites.
   ```

   Ensure that all of your changes have unit test coverage.

1. **Password Security** 
   While this is a temporary and rudimentary implementation it is still bad practice to store plain text passwords.  Add one-way encryption of the password before 'storing' the user.  

### Bonus Objectives

The following objectives are not required but can be completed if you have extra time and want to extend functionality further than requested.

1. **Roles and Permissions**  
   Design a new feature that will separate admins from normal users adding a permissions system so that only admins can perform CRUD operations on questions.  There are quite a few
   things to account for in this design.  The design should account for 
   * what roles and permissions are needed
   * how to grant these roles to users
   * how to validate that a user has permission to call a particular endpoint or execute a piece of code
   You can implement this if you desire but it is not necessary for this task. 


    


