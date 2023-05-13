const express = require('express');
const bettingRoutes = require('./modules/betting/betting.routes');

const router = express.Router();

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/airdata', bettingRoutes);

module.exports = router;
