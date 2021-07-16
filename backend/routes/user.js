const express = require('express');
const router = express.Router();
const passwordSchema = require('../middleware/passwordVerify');
const userCtrl = require('../controllers/user');


//Envoyer les informations de l'utilisateur depuis le frontend
router.post('/signup', passwordSchema, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;