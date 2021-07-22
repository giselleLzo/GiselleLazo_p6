const passwordSchema = require('../models/password');

//Validation du mot de passe fort
module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)) {
        res.status(400).json({
            error: ' Le mot de passe doit contenir au moins une majuscule, une minuscule et un numéro : ' + passwordSchema.validate(req.body.password, {list: true})
        });
    }else{
        next();
    }
}