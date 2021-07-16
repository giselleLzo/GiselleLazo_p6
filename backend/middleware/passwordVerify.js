const passwordSchema = require('../models/password');

//Mot de passe fort
module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)) {
        res.status(400).json({
            error: ' Le mot de passe n est pas assez fort : ' + passwordSchema.validate(req.body.password, {list: true})
        });
    }else{
        next();
    }
}