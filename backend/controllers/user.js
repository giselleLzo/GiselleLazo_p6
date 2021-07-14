const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Cryptage du mot de passe 
        .then(hash => {
            const user = new User({ //Création du nouveau utilisateur
                email: req.body.email,
                password: hash
            });
            user.save() //Sauvegarde dans la base de données
                .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //Récuperation de l'email de l'utilisateur de la base de données
        .then(user => {
            if (!user) { //Si l'utilisateur n'est pas trouvé
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }
            bcrypt.compare(req.body.password, user.password) //Comparation du mot de passe avec le hash
                .then(valid => {
                    if (!valid) { //Envoyer une erreur si le mot de passe n'est pas le même
                        return res.status(401).json({ error: 'Mot de passe incorrect' });
                    }
                    res.status(200).json({ //Renvoyer le token si les identifiants sont valables
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET', //Encoder le user
                            { expiresIn: '24h' }
                        )
                    }); 
                })
        
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};