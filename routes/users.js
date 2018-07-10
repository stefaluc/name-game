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
    numWins: 0,
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

// POST new game session for a user
router.post('/users/:id/game', (req, res) => {
  const newGame = {
    numGuess: 0,
    numCorrect: 0,
    profiles: getProfiles(),
    lastGuess: null,
  };
  newGame.answer = newGame.profiles[randInt(0, 5)];

  const userById = users.find((user) => (user.id === Number(req.params.id)));
  userById.game = newGame;

  res.send({ game: newGame });
});

router.post('/users/:id/game/guess', (req, res) => {
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  if (req.body.guess === userById.game.answer.firstName + ' ' + userById.game.answer.lastName) {
    userById.numWins++;
    res.send({ correct: true });
  } else {
    res.send({ correct: false });
  }
});

function getProfiles() {
  let randProfiles = [];
  let set = new Set();
  let i = 0;
  while (i !== 6) {
    let randomNum = randInt(0, data.profiles.length - 1);
    // only add profile if its not a duplicate and it has a headshot url
    if (!set.has(randomNum) && data.profiles[randomNum].headshot.url) {
      randProfiles.push(data.profiles[randomNum]);
      set.add(randomNum);
      i++;
    }
  }
  return randProfiles;
}

function randInt(lower, upper) {
  let range = (upper - lower) + 1;
  return Math.floor(Math.random() * range) + lower;
}

module.exports = router;
