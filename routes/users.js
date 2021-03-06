const express = require('express');

const profileData = require('../data/profiles');
const userData = require('../data/users');

const router = express.Router();

let users = userData.users;
let userIds = 0;

// ========== Basic user HTTP requests (/users) ==========
// GET users
router.get('/users', (req, res) => {
  res.send({ users });
});

// GET user by id
router.get('/users/:id', (req, res) => {
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  if (userById) {
    res.send({ user: userById });
  } else { // user not found
    res.sendStatus(404);
  }
});

// POST user
router.post('/users', (req, res) => {
  const userByName = users.find((user) => (user.name === req.body.name));
  if (!userByName) {
    let newUser = {
      id: ++userIds,
      name: req.body.name,
      game: {},
      stats: {
        correctGuesses: 0,
        wrongGuesses: 0,
        timeSpent: 0,
        avgFinishTime: 0,
        accuracy: 0,
      },
    };
    users.push(newUser);

    res.send({ user: newUser });
  } else { // username already exists
    res.send({ user: userByName });
  }
});

// ========== User game HTTP requests (/users/:id/games) ==========
// GET game session for a user
router.get('/users/:id/games', (req, res) => {
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  if (userById) {
    res.send({ game: userById.game });
  } else { // user not found
    res.sendStatus(404);
  }
});

// POST new game session for user, or process user guess for a game
router.post('/users/:id/games', (req, res) => {
  const userById = users.find((user) => (user.id === Number(req.params.id)));
  if (userById) {
    if (!req.query.guess) { // create new game
      const newGame = {
        profiles: getRandProfiles(),
        gameStartTime: Date.now(),
      };
      newGame.answer = newGame.profiles[randInt(0, 5)];

      userById.game = newGame;

      res.send({ game: newGame });
    } else { // guess submitted
      let stats = userById.stats;
      let game = userById.game
      let correctAnswer = game.answer.firstName + ' ' + game.answer.lastName;
      // update statistics for users based on correct/incorrect answer
      if (req.query.guess === correctAnswer) {
        stats.correctGuesses++;
        // get time it took for user to guess correctly and update avg
        let finishTime = (new Date(
          new Date(Date.now() - new Date(game.gameStartTime)))).getUTCSeconds();
        stats.timeSpent += finishTime;
        stats.avgFinishTime = stats.timeSpent / stats.correctGuesses;
        // assign accuracy (ratio) and avoid divide by 0
        stats.accuracy = (stats.wrongGuesses) ?
          stats.correctGuesses / stats.wrongGuesses : stats.correctGuesses;

        res.send({ correct: true, finishTime });
      } else { // incorrect answer
        stats.wrongGuesses++;
        stats.accuracy = stats.correctGuesses / stats.wrongGuesses;

        res.send({ correct: false });
      }
    }
  } else { // user not found
    res.sendStatus(404);
  }
});

// ========== User stats HTTP requests (/users/:id/stats) ==========
router.get('/users/:id/stats', (req, res) => {
  const statsByUser = users.find((user) => (user.id === Number(req.params.id))).stats;
  if (statsByUser) {
    res.send({ stats: statsByUser });
  } else {
    // user not found
    res.sendStatus(404);
  }
})

// get six random profiles from data
function getRandProfiles() {
  let randProfiles = [];
  let set = new Set();
  let i = 0;
  while (i !== 6) {
    let randomNum = randInt(0, profileData.profiles.length - 1);
    // only add profile if its not a duplicate and it has a headshot url
    if (!set.has(randomNum) && profileData.profiles[randomNum].headshot.url) {
      randProfiles.push(profileData.profiles[randomNum]);
      set.add(randomNum);
      i++;
    }
  }
  return randProfiles;
}

// get random integer between lower and upper params (inclusive)
function randInt(lower, upper) {
  let range = (upper - lower) + 1;
  return Math.floor(Math.random() * range) + lower;
}

module.exports = router;
