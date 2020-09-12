// Configuration de la route en important nos middleware
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauces');
// Traiter les requêtes 'post' en insérant le middleware "auth" d'authentification
router.post('/', auth, multer, saucesCtrl.createThing);
// Mettre un jour un Thing existant
router.put('/:id', auth, multer, saucesCtrl.modifyThing);
// Supprimer un Thing
router.delete('/:id', auth, saucesCtrl.deleteThing);
// Renvoi information d'une seule sauce
router.get('/:id', auth, saucesCtrl.getOneThing);
//le premier enregistre dans la console et passe l'exécution la premiére route pour les sauces
router.get('/', auth, saucesCtrl.getAllThings);
router.post('/:id/like', auth, saucesCtrl.likeThing);
module.exports = router;