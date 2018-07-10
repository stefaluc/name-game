const express = require('express');

const userData = require('../data/users');

const router = express.Router();
let users = userData.users;

// GET stats of all users
// accepts query params: type=(accuracy|speed|amount), sort=(ascending|descending), limit=(int)
router.get('/stats', (req, res) => {
  let allStats = users.map((user) => ({ id: user.id, name: user.name, stats: user.stats }));
  if (req.query.type) {
    switch (req.query.type) {
      // for each case, trim stats to only the type and sort (default ascending) by that type
      case 'accuracy':
        allStats = trimAndSort(users, 'accuracy', req.query.sort);
        break;
      case 'speed':
        allStats = trimAndSort(users, 'speed', req.query.sort);
        break;
      case 'amount':
        allStats = trimAndSort(users, 'amount', req.query.sort);
        break;
    }
  }
  if (req.query.limit) {
    allStats = allStats.slice(0, Number(req.query.limit));
  } 

  res.send({ stats: allStats });
});

// return all stats of users sorted and trimmed by type
function trimAndSort(users, type, sort) {
  // map of types to corresponding stat variable names
  const map = {
    accuracy: 'test',
    speed: 'avgFinishTime',
    amount: 'correctGuesses',
  }
  let allStats = users.map((user) =>
    ({ id: user.id, name: user.name, stats: user.stats[map[type]] })
  );
  if (sort === 'descending') {
    allStats.sort((a, b) => (b[map[type]] - a[map[type]]));
  } else {
    allStats.sort((a, b) => (a[map[type]] - b[map[type]]));
  }
  return allStats;
}

router.get('/stats/:id', (req, res) => {
  const statsByUser = users.find((user) => (user.id === Number(req.params.id))).stats;
  if (statsByUser) {
    res.send({ stats: statsByUser });
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
