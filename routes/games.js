const express = require('express');

const userData = require('../data/users');

const router = express.Router();
let users = userData.users;

// GET all games
router.get('/games', (req, res) => {
  let allGames = users.map((user) => ({ id: user.id, name: user.name, games: user.games }));
  res.send({ users });
});

// GET game by id
router.get('/games/:id', (req, res) => {
  const gamesByUser = users.find((user) => (user.id === Number(req.params.id))).game;
  if (gamesByUser) {
    res.send({ games: gamesByUser });
  } else {
    // game not found
    res.sendStatus(404);
  }
});

module.exports = router;
