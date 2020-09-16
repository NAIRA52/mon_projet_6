// Création routeur express
const express = require('express');
// Enregistrer nos routes dans le routeur express
const router = express.Router();
// Importer le middleware "auth"
const auth = require('../middleware/auth');
// Importer le middleware "multer"
const multer = require('../middleware/multer-config');
// Importer le controlleur "sauces"
const saucesCtrl = require('../controllers/sauces');
// Traiter les requêtes 'post' en insérant le middleware "auth" d'authentification
router.post('/', auth, multer, saucesCtrl.createSauce);
// Mettre un jour un Thing existant
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// Supprimer un Thing
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// Renvoi information d'une seule sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);
//le premier enregistre dans la console et passe l'exécution la premiére route pour les sauces
router.get('/', auth, saucesCtrl.getAllSauces);
// Traiter les requêtes d'un utilisateur concernant les likes
router.post('/:id/like', auth, saucesCtrl.likeSauce);
// On exporte le routeur
module.exports = router;