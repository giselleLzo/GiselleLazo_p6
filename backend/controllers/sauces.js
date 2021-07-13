const Thing = require('../models/Thing');
const fs = require('fs');

//Création d'un produit

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    const thing = new Thing ({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'objet enregistre'}))
        .catch(error => res.status(400).json({ error }));
};

//Modification d'un produit

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ?
    {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'objet modifie' }))
        .catch(error => res.status(400).json({ error }));
};

//Likes et dislikes d'un produit

exports.likeThing = (req, res, next) => {
    Object.findOne({ _id: req.params.id })
      .then((thing) => {
        const indexLike = thing.usersLiked.findIndex(
          (e) => e === req.body.userId
        );
        const indexDislike = thing.usersDisliked.findIndex(
          (e) => e === req.body.userId
        );

        switch (req.body.like) {
            case 1: //si l'utilisateur aime la sauce
              if (indexLike <= -1) {
                thing.usersLiked.push(req.body.userId);
                thing.likes += 1;
              }
              if (indexDislike > -1) { 
                thing.usersDisliked.splice(indexDislike, 1);
                thing.dislikes -= 1;
              }
              break;
            case 0: 
              if (indexLike > -1) {
                thing.usersLiked.splice(indexLike, 1);
                thing.likes -= 1;
              }
    
              if (indexDislike > -1) {
                thing.usersDisliked.splice(indexDislike, 1);
                thing.dislikes -= 1;
              }
              break;
            case -1: // si l'utilisateur n'aime pas la sauce
              if (indexLike > -1) {
                thing.usersLiked.splice(indexLike, 1);
                thing.likes -= 1;
              }
              if (indexDislike <= -1) {
                thing.usersDisliked.push(req.body.userId);
                thing.dislikes += 1;
              }
    
              break;
          }
    
          Thing.updateOne({ _id: req.params.id },
              {
                likes: thing.likes,
                dislikes: thing.dislikes,
                usersLiked: thing.usersLiked,
                usersDisliked: thing.usersDisliked,
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

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'objet supprime' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

//Récuperation d'un produit

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

//Récuperation de tous les produits

exports.getAllThings = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};