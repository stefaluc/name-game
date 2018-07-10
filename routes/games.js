const express = require('express');

const profileData = require('../data/profiles');
const userData = require('../data/users');

const router = express.Router();
let users = userData.users;

router.get('/games', (req, res) => {
  res.send({ users });
});

router.get('/games/:id', (req, res) => {
  res.send({ users });
});

module.exports = router;
