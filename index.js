const Smite = require('./stg.js');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  let stg = new Smite();
  stg.getLists(() => {
    console.log(stg.generateTeam());
    res.send(stg.generateTeam());
  });
});

app.listen('8080');
