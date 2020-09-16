// Importer l'application express
const express = require('express');
// Importer "body-parser" afin de transformer le corps de la requête en objet Javascropt utiisable(Json)
const bodyParser = require('body-parser');
// Création application express
const app = express();
// Importer "mongoose" (base de donnée)
const mongoose = require('mongoose');
const path = require('path');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
// Connexion à notre base de donnée mongoose
mongoose.connect('mongodb+srv://naira:tounsia52@cluster0.o5eeu.mongodb.net/cluster0?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Accéder à notre API depuis n'importe quelle origine ('*'),ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.),envoyer des requêtes avec les méthodes mentionnées(GET,POST,etc.).
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
// Définir la fonction Json comme middleware global pour l'application
app.use(bodyParser.json());
// Indique à express de gérer la ressources images à chaque requête venant de la route images
app.use('/images', express.static(path.join(__dirname, 'images')));
// enregistrer nos routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/sauces/', saucesRoutes);
// Exporter notre application dans les autres fichiers
module.exports = app;