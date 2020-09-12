// On importe multer
const multer = require('multer');
// Creation d'une constante dictionnaire qui indique les 3 MIME_TYPES différent depuis le frontend
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
// Creation objet de configuration
const storage = multer.diskStorage({
    // Enregistre les fichiers dans dossier images
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Indique quel fichier utiliser
    filename: (req, file, callback) => {
        // Créer le nom en utlisant le fichier d'origine, on remplace les espaces par des underscores grâce à "split"
        const name = file.originalname.split(' ').join('_');
        // Création de l'extension MIME_TYPES
        const extension = MIME_TYPES[file.mimetype];
        // On appelle le callback avec un argument"null" +  le nom créer au-dessus avec un nombre à la milliseconde+ un point + extension
        callback(null, name + Date.now() + '.' + extension);
    }
});
// On exporte l'élément multer configuré en passant la constante storage et gérer juste les fichiers images
module.exports = multer({ storage: storage }).single('image');