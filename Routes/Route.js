const express = require('express');
const route = express.Router();

const { runLink } = require('../controller/RunLinkController');
route.get('/link/:linkId', runLink);

const { shareLink } = require('../controller/ShareLinkController');
route.post('/link', shareLink);

module.exports = route;