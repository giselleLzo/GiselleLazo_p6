const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//UserSchema pour la création et le login des utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);