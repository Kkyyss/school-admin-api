const express = require('express');
const router = express.Router();

router.use(require('./register.route'));
router.use(require('./commonstudents.route'));
router.use(require('./suspend.route'));
router.use(require('./retrievefornotifications.route'));

module.exports = router;
