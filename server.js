const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const data = require('./profiles');

const index = require('./routes/index');
const users = require('./routes/users');
const profiles = require('./routes/profiles');

const app = express();
const port = process.env.PORT || 8080;

// parse http request body
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/', users);
//app.use('/api/', profiles);

app.listen(port, () => console.log(`Listening on port ${port}`));
