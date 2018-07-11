const express = require('express');

const userData = require('../data/users');
const profileData = require('../data/profiles');

const router = express.Router();
let profiles = profileData.profiles;
let profileIds = 0;

// GET all profiles
router.get('/profiles', (req, res) => {
  res.send({ profiles });
});

// GET profile by id
router.get('/profiles/:id', (req, res) => {
  const profileById = profiles.find((profile) => (profile.id === Number(req.params.id)));
  if (profileById) {
    res.send({ profile: profileById });
  } else {
    // profile not found
    res.sendStatus(404);
  }
});

// POST profile
router.post('/profiles', (req, res) => {
  const body = req.body;
  let newProfile = {
    id: ++profileIds,
    type: body.type,
    slug: body.slug,
    firstName: body.firstName,
    lastName: body.lastName,
    headshot: body.headshot,
    socialLinks: body.socialLinks,
  };
  profiles.push(newProfile);

  res.send({ profile: newProfile });
});

module.exports = router;
