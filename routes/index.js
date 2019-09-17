const express = require('express');
const router = express.Router();

router.use('/api/v1.0', require('./api/v1.0'));

module.exports = router;
