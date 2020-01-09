const express = require('express');
const response = express.Router();
const path = require('path');

const statsController = require('../controller/statsController');

response.post(
  '/',
  statsController.createResponse,
  statsController.leaderByCategory,
  (req, res) => {
    res.status(200).send('hit response post route');
  }
);

module.exports = response;
