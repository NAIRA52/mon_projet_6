// Importer "thing" du dossier models
const Sauce = require('../models/Sauce');
// Importer le package fs(systeme de fichiers)donne accès aux fonctions qui permet de modifier le système de fichiers,
const fs = require('fs');
// Gérer correctement la requête entrante
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        // Afin de générer l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []

    });
    //Enregistrement des données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};
// Modification
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        // S'il existe , on récupére les informations
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body }; // S'il n'existe pas, on prend juste le corps de la requête
    // "updateOne" permet de mettre à jour l'objet
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};
// Supprimer
exports.deleteSauce = (req, res, next) => {
    // Pour trouver l'objet à supprimer
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            // Pour supprimer le fichier
            fs.unlink(`images/${filename}`, () => {

                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};
// Récupérer un seul objet
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));

};
// Récupérer tout les objets
exports.getAllSauces = (req, res, next) => {
    //Récupération de la liste des Things
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
// Gérer les pouce likes et dislikes
exports.likeSauce = (req, res, next) => {
    // "switch" évalue une expression et l'exécute
    switch (req.body.like) {
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: {
                                    likes: -1
                                },
                                $pull: { usersLiked: req.body.userId },

                            })
                            .then(() => res.status(201).json({ message: 'Aime a été enlevé!' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: {
                                    dislikes: -1
                                },
                                $pull: { usersDisliked: req.body.userId },
                            })
                            .then(() => res.status(201).json({ message: 'Aime pas a été enlevé!' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(404).json({ error }));
            break
            // Configuration du pouce like 
        case 1:
            Sauce.updateOne({ _id: req.params.id }, {
                    // "$inc" incrémente une valeur positive
                    $inc: {
                        likes: 1
                    },
                    // "$push" ajoutera +1 au pouce du tableau
                    $push: { usersLiked: req.body.userId },
                })
                .then(() => res.status(201).json({ message: 'Aime a été pris en compte!' }))
                .catch(error => res.status(400).json({ error }));
            break
            // Configuration du pouce dislike
        case -1:
            Sauce.updateOne({ _id: req.params.id }, {
                    // "$inc" incrémente une valeur négative
                    $inc: {
                        dislikes: 1
                    },
                    // "$push" ajoutera -1 au pouce du tableau
                    $push: { usersDisliked: req.body.userId },
                })
                .then(() => res.status(201).json({ message: 'Aime pas a été pris en compte!' }))
                .catch(error => res.status(400).json({ error }));
            break
        default:
    }
}