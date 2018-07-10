const express = require('express');

const data = require('../profiles');

const router = express.Router();

let users = [];
let userIds = 0;

// TODO: think about possibly adding /games route

// ========== Basic user HTTP requests (/users) ==========
// GET users
router.get('/users', (req, res) => {
  res.send({ users });
});

// GET user by id
router.get('/users/:id', (req, res) => {
  // TODO: send not found status on invalid id
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  res.send({ user: userById });
});

// POST user
router.post('/users', (req, res) => {
  const userByName = users.find((user) => (user.name === req.body.name));
  if (userByName) {
    // username already exists
    res.send({ user: userByName });
  } else {
    let newUser = {
      id: ++userIds,
      name: req.body.name,
      game: {},
      stats: {
        wins: 0,
        gamesPlayed: 0,
      },
    };

    users = [
      ...users,
      newUser,
    ];
    res.send({ user: newUser });
  }
});

// ========== User game HTTP requests (/users/:id/game) ==========
// GET game session for a user
router.get('/users/:id/game', (req, res) => {
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  
  res.send({ game: userById.game });
});

// POST new game session for a user
router.post('/users/:id/game', (req, res) => {
  const newGame = {
    numCorrect: 0,
    profiles: getProfiles(),
    lastGuess: null,
  };
  newGame.answer = newGame.profiles[randInt(0, 5)];

  const userById = users.find((user) => (user.id === Number(req.params.id)));
  userById.game = newGame;

  res.send({ game: newGame });
});

// POST client guess
// TODO: change guess to query param
router.post('/users/:id/game/guess', (req, res) => {
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  userById.game.numGuesses++;
  if (req.body.guess === userById.game.answer.firstName + ' ' + userById.game.answer.lastName) {
    userById.stats.numWins++;
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

// ========== User statistics HTTP requests (/users/:id/stats and /users/stats) ==========
router.get('/users/:id/stats', (req, res) => {
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  res.send({ stats: userById.stats });
});

// TODO: fix
router.get('/users/stats', (req, res) => {
  console.log('reached');
  const allStats = users.map((user) => (user.stats));
  console.log(allStats);
  res.send({ stats: allStats });
});

// TODO: /users/stats?sort=(ascending|descending)
//       /users/stats?type=(accuracy|speed|amount)
//       /users/stats?limit=(0-stats.length)

module.exports = router;
