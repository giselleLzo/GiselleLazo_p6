const Sauce = require('../models/Sauces');
const fs = require('fs');

//Création d'un produit

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce ({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() //Sauvegarde dans la base de données
        .then(() => res.status(201).json({ message: 'objet enregistre'}))
        .catch(error => res.status(400).json({ error }));
};

//Modification d'un produit

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'objet modifie' }))
        .catch(error => res.status(400).json({ error }));
};

//Likes et dislikes d'un produit

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const indexLike = sauce.usersLiked.findIndex(
          (e) => e === req.body.userId
        );
        const indexDislike = sauce.usersDisliked.findIndex(
          (e) => e === req.body.userId
        );

        switch (req.body.like) {
            case 1: //si l'utilisateur aime la sauce
              if (indexLike <= -1) {
                sauce.usersLiked.push(req.body.userId);
                sauce.likes += 1;
              }
              if (indexDislike > -1) { 
                sauce.usersDisliked.splice(indexDislike, 1);
                sauce.dislikes -= 1;
              }
              break;
            case 0: 
              if (indexLike > -1) {
                sauce.usersLiked.splice(indexLike, 1);
                sauce.likes -= 1;
              }
    
              if (indexDislike > -1) {
                sauce.usersDisliked.splice(indexDislike, 1);
                sauce.dislikes -= 1;
              }
              break;
            case -1: // si l'utilisateur n'aime pas la sauce
              if (indexLike > -1) {
                sauce.usersLiked.splice(indexLike, 1);
                sauce.likes -= 1;
              }
              if (indexDislike <= -1) {
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes += 1;
              }
    
              break;
          }
    
          Sauce.updateOne({ _id: req.params.id },
              {
                likes: sauce.likes,
                dislikes: sauce.dislikes,
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
              }
            )
            .then((result) => {
              result ? res.status(200).json(result) : res.status(401).json(null);
            })
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({ error }));
    };

//Suppression d'un produit

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'objet supprime' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

//Récuperation d'un produit

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//Récuperation de tous les produits

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};