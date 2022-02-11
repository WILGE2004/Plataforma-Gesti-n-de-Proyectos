const router = require('express').Router();
const ctrlAuth = require('../controllers/auth.ctrl');
const auth = require('../lib/authentitacion');

router.post('/login',ctrlAuth.login);

router.use(auth.verifyAdminToken);

router.post('/signup',ctrlAuth.signup);

router.get('/users',ctrlAuth.getUsers);

router.delete('/users/:id',ctrlAuth.deleteUser);

module.exports=router;