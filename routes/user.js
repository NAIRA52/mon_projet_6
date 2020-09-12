// Création des routes
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
// Envoi des données mail et mot de passe
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;