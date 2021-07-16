const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

module.exports = (req, res, next) => { //Vérification du token
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return res.status(403).json({error: 'Accès interdit'});
          }
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        
        if (req.body.userId && (req.body.userId !== decodedToken.userId) ) {
            return res.status(403).json({error: 'Identifiant non valide'});
        } else {
            console.log(req.body);
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requete non authentifie' });
    }
};