const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const cookieSession = require('cookie-session');
const helmet = require('helmet');
const rateLimit = require('./middleware/ratelimit');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

//Conexion à mongoose
mongoose.connect('mongodb+srv://giselle:Iannick.Loic2@cluster0.fgo1j.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('conexion a mongo'))
    .catch(() => console.log('conexion echoue'));

const app = express();

app.use(rateLimit); //Limiter les requêtes
app.use(helmet()); //Protéger les en-têtes http

//Acces à l'api
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Cookies
app.use(cookieSession({
    secret: 'sessionS3cur3',
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'http://localhost:3000'
    }
}))

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes); //Enregistrer la route d'autentification 
app.use('/api/sauces', saucesRoutes);

module.exports = app;