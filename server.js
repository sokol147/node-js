const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const QUERY_USER_SCHEMA = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required().pattern(new RegExp("[a-zA-Z0-9]")),
  age: Joi.number().required().min(4).max(130),
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const USERS = [];

app.listen(4000, () => {
  console.log("Listening on 4000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/users", (req, res) => {
  res.send(USERS);
});

app.get("/users/autosuggest", (req, res) => {
  const users = getAutoSuggestUsers("test", 2);
  res.send(users);
});

app.get("/users/:id", (req, res) => {
  const user = findUser(req.params.id);
  res.send(user);
});

app.post("/users", (req, res) => {
  const validation = QUERY_USER_SCHEMA.validate(req.body);
  if (validation.error) {
    res.status(400).json({
      message: validation.error.toString(),
    });
  } else {
    addUser(req.body);
    return res.status(200).send("User added");
  }
});

app.delete("/users", (req, res) => {
  deleteUser(req.body);
});

app.put("/users", (req, res) => {
  updateUser(req.body);
});

function addUser(user) {
  USERS.push({
    ...user,
    id: user.login + user.password,
    isDeleted: false,
  });
}

function findUser(id) {
  return USERS.find((user) => user.id === id);
}

function deleteUser(user) {
  USERS.forEach((userItem, index) => {
    if (userItem.id === user.id) {
      USERS[index] = {
        ...user,
        isDeleted: true,
      };
    }
  });
}

function updateUser(user) {
  USERS.forEach((userItem, index) => {
    if (userItem.id === user.id) {
      USERS[index] === user;
    }
  });
}

function getAutoSuggestUsers(loginSubstring, limit) {
  const users = [];

  USERS.forEach((user) => {
    if (user.login.include(loginSubstring) && users.length <= limit) {
      users.push(user);
    }
  });

  users.sort((a, b) => {
    return a.login - b.login;
  });

  return users;
}
