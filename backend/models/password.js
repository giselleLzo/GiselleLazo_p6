const passwordValidator = require('password-validator')

const passwordSchema = new passwordValidator();

//Mot de passe
passwordSchema
.is().min(8)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()

module.exports = passwordSchema;