var express = require('express');
var router = express.Router();
var User = require('../model/user');
var bcrypt = require('bcryptjs');
var utils = require('../middleware/utils');
var userController = require('../controllers/user');
var secureController = require('../controllers/secureTest');
var unsecureController = require('../controllers/unSecureTest');
/* GET users listing. */
router.get('/api/user', userController.view); 
router.post('/api/user/login',userController.login);
router.post('/api/user/signup',userController.signup);

router.get('/api/secure',utils.isAuthenicated,secureController.secure);
router.get('/api/unsecure', unsecureController.unSecure);

module.exports = router;