const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const gamesController = require('../controllers/gamesController');
const tcgController = require('../controllers/tcgController');
const userController = require('../controllers/userController');
// Routes
router.get('/', defaultController.view);

router.get('/login', userController.login);
router.post('/auth', userController.auth);

router.get('/games', gamesController.main);
router.get('/games/:brand', gamesController.viewbrand);
router.get('/games/:brand/:system', gamesController.viewsystem);
router.get('/games/:brand/:system/:id/view', gamesController.viewitem);


router.get('/tcg', tcgController.main);
router.get('/tcg/:brand', tcgController.viewbrand);
router.get('/tcg/:brand/:type', tcgController.viewSet);



router.get('/:object', defaultController.main);
router.get('/:object/:type', defaultController.viewtype);
router.get('/:object/:type/:id/view', defaultController.viewitem);

module.exports = router;