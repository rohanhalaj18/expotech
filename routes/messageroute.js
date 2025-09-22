const express = require('express');
const app = express();
const router = express.Router();
const {enquiry} = require('../contrlores/messageCons');

router.post('/enquiry', enquiry);

module.exports = router;