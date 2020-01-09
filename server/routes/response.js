const express = require('express');
const response = express.Router();
const path = require('path');

const statsController = require('../controller/statsController');

response.post('/', statsController.createResponse, (req, res) => {
  res.status(200).send('hit response post route');
});

response.get('/leaderboard', statsController.leaderboard, (req, res) => {
  res.status(200).json(res.locals.leaders);
});

module.exports = response;
