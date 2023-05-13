const express = require('express');
const bettingCtrl = require('./betting.controller');

const router = express.Router();

router.route('/')
  .get(bettingCtrl.list);

router.route('/create')
  .post(
    bettingCtrl.create
    )

module.exports = router;
