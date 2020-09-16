// Création routeur express
const express = require('express');
//Enregistrer nos routes dans le routeur express
const router = express.Router();
// Importer le controlleur "user"
const userCtrl = require('../controllers/user');
// Envoi des données mail et mot de passe
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
// On exporte le routeur
module.exports = router;