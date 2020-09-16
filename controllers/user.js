// Importer le package de cryptage pour les mot de passe
const bcrypt = require('bcrypt');
// Créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');
// Importer le model "user"
const User = require('../models/User');
// Enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // Pour crypter le mot de passe
    bcrypt.hash(req.body.password, 10)
        // On récupere le hash du mot de passe 
        .then(hash => {
            // On enregistre dans le nouveau user
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Enregistrer dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
// Fonction pour connecter les utilisateurs
exports.login = (req, res, next) => {
    // Récupération de l'utilisateur qui correspond à l'adresse mail entrée
    User.findOne({ email: req.body.email })
        // Si on reçoit pas le bon 'user' ,on envoi une erreur
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // On compare le mot de passe du 'user' avec le hash qui est garder dans la base de donnée
            bcrypt.compare(req.body.password, user.password)
                // Si la comparaison est fausse , on renvoi une erreur
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si les identifiants sont valables , on lui renvoi son 'userId et un token(une chaine de caractére d'authentification')
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};