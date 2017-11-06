var express = require('express');
var router = express.Router();

const UserController = require('../controllers/user.controller');


/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', { title: 'Express' });
});


router.post('/registo', UserController.register);

router.post('/login', UserController.login);

module.exports = router;
