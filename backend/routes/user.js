const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//Envoyer les informations de l'utilisateur depuis le frontend
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;