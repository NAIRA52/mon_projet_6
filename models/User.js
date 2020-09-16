// Importer mongoose
const mongoose = require('mongoose');
// Importer le package unique validator 
const uniqueValidator = require('mongoose-unique-validator');
// Création du schema
const userSchema = mongoose.Schema({
    // un email obligatoire, unique et ne permet pas de se réinscrire avec le mm email
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
// Assurer aucun utilisateur ne partage la mm adresse email
userSchema.plugin(uniqueValidator);
// Exporter le schema sous forme de model
module.exports = mongoose.model('User', userSchema);