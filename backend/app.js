const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Thing = require('./models/Thing');

const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://giselle:Iannick.Loic2@cluster0.fgo1j.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('conexion a mongo'))
    .catch(() => console.log('conexion echoue'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.urlencoded({extended: true})); 
app.use(express.json());


app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const thing = new Thing ({
        ...req.body
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'objet enregistre'}))
        .catch(error => res.status(400).json({ error }));
});

app.use('/api/sauces', (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
});

app.use('/api/auth', userRoutes);

module.exports = app;