// middleware d'authentification
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // S'il y a des problémes que celle-ci soit gérer à l'interieur de try et catch
    try {
        // Récupération des informations apres le header grâce aà "split"
        const token = req.headers.authorization.split(' ')[1];
        // Décoder le token grêce à "verify"
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récuperer le userId
        const userId = decodedToken.userId;
        // Si le userId est différent de celui-ci
        if (req.body.userId && req.body.userId !== userId) {
            // On renvoit une erreur
            throw 'Invalid user ID';
            // Si tout va bien , on passe au prochain middleware
        } else {
            next();
        }
        // Les erreurs seront afficher dans "catch"
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};