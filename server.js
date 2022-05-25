'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

// JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL database
const pg = require('pg');
const config = {
    host: 'localhost',
    // TODO implement environment variables
    user: 'boraelci',     
    password: 'testpwd',
    database: 'boraelci',
    port: 5432,
    // ssl: true
};
const db = new pg.Client(config);
db.connect(err => {
  if (err) throw err;
  else { console.log("Connected to database"); }
})

const routes = require('./routes/routes.js')(app, db);

const server = app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
  console.log('listening on port %s...', server.address().port);
});