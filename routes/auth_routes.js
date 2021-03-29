const { Router } = require('express');
const router = Router();
const auth_controller = require('../controller/auth_controller');

router.get('/signup', auth_controller.signup_get);

router.post('/signup', auth_controller.signup_post);

router.get('/login', auth_controller.login_get);

router.post('/login', auth_controller.login_post);

router.get('/logout', auth_controller.logout_get);

module.exports = router;
