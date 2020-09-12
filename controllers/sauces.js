const Thing = require('../models/Thing');
const fs = require('fs');
const { findOne } = require('../models/Thing');
// Gérer correctement la requête entrante
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;
    const thing = new Thing({
        ...thingObject,
        // Afin de générer l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []

    });
    //Enregistrement des données
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));

};
// Modification
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ?
        // S'il existe , on récupére les informations
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body }; // S'il n'existe pas, on prend juste le coprs de la requête

    Thing.updateOne({ _id: req.params.id }, {...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};
// Supprimer
exports.deleteThing = (req, res, next) => {
    // Pour trouver l'objet à supprimer
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            // Pour supprimer le fichier
            fs.unlink(`images/${filename}`, () => {

                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};
// Récupérer un seul objet
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));

};
// Récupérer tout les objets
exports.getAllThings = (req, res, next) => {
    //Récupération de la liste des Things
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));

};
// Gérer les pouce likes et dislikes
exports.likeThing = (req, res, next) => {
    // "switch" évalue une expression et l'exécute
    switch (req.body.like) {
        case 0:
            Thing.findOne({ _id: req.params.id })
                .then((thing) => {
                    if (thing.usersLiked.includes(req.body.userId)) {
                        Thing.updateOne({ _id: req.params.id }, {
                            // "$inc" incrémente une valeur positive
                            $inc: {
                                likes: -1
                            },
                            // "$set" ajoutera +1 au pouce du tableau
                            $pull: { usersLiked: req.body.userId },
                            //_id: req.params.id

                        })

                        .then(() => res.status(201).json({ message: 'Aime a été enlevé!' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    if (thing.usersDisliked.includes(req.body.userId)) {
                        Thing.updateOne({ _id: req.params.id }, {
                            // "$inc" incrémente une valeur positive
                            $inc: {
                                dislikes: -1
                            },
                            // usdjldsnksdk
                            // "$set" ajoutera +1 au pouce du tableau
                            $pull: { usersDisliked: req.body.userId },
                            //_id: req.params.id

                        })

                        .then(() => res.status(201).json({ message: 'Aime a été enlevé!' }))
                            .catch(error => res.status(400).json({ error }));
                    }


                })
                .catch(error => res.status(404).json({ error }));






            break

            // Configuration du pouce like 
        case 1:
            Thing.updateOne({ _id: req.params.id }, {
                    // "$inc" incrémente une valeur positive
                    $inc: {
                        likes: 1
                    },
                    // "$set" ajoutera +1 au pouce du tableau
                    $push: { usersLiked: req.body.userId },
                    //_id: req.params.id
                })
                .then(() => res.status(201).json({ message: 'Aime a été pris en compte!' }))
                .catch(error => res.status(400).json({ error }));
            break
            // Configuration du pouce dislike
        case -1:
            Thing.updateOne({ _id: req.params.id }, {
                    // "$inc" incrémente une valeur négative
                    $inc: {
                        dislikes: -1
                    },
                    // "$set" ajoutera -1 au pouce du tableau
                    $push: { usersDisliked: req.body.userId },
                    // id: req.params.id
                })
                .then(() => res.status(201).json({ message: 'Aime pas a été pris en compte!' }))
                .catch(error => res.status(400).json({ error }));
            break
        default:
    }
}