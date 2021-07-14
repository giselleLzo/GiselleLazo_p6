const multer = require('multer');

const MIME_TYPES = { //Générer les extensions d'image
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ //Enregistrer les fichiers
    destination: (req, file, callback) => { //Destination du fichier
        callback(null, 'images')
    },
    filename: (req, file, callback) => { //Nommer le fichier
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; //Extension du fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage : storage }).single('image');