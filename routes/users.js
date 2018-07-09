const express = require('express');

const data = require('../profiles');

const router = express.Router();

let users = [];
let userIds = 0;

// GET users
router.get('/users', (req, res) => {
  res.send({ users });
});

// GET user by id
router.get('/users/:id', (req, res) => {
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  res.send({ user: userById });
});

// POST user
router.post('/users', (req, res) => {
  let newUser = {
    id: ++userIds,
    name: req.body.name,
    game: {},
  };

  users = [
    ...users,
    newUser,
  ];
  res.send({ user: newUser });
});

// GET game session for a user
router.get('/users/:id/game', (req, res) => {
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  
  res.send({ game: userById.game });
});

router.post('/users/:id/game', (req, res) => {
  console.log(getProfiles());
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  console.log(userById);
  userById.game.numGuesses = 0;
  userById.game.numCorrect = 0;
  userById.game.profiles = getProfiles();
  userById.game.answer = userById.game.profiles[randInt(0, 5)];
  userById.game.lastGuess = null;

  res.send({ game: userById.game });
});

function getProfiles() {
  let randProfiles = [];
  for (let i = 0; i < 6; i++) {
    randProfiles.push(data.profiles[randInt(0, data.profiles.length - 1)]);
  }
  return randProfiles;
}

function randInt(lower, upper) {
  let range = (upper - lower) + 1;
  return Math.floor(Math.random() * range) + lower;
}

module.exports = router;
