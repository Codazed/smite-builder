const Smite = require('./stg.js');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  let stg = new Smite();
  stg.getLists(() => {
    res.send(stg.lists);
  });
});

app.listen('8080');
