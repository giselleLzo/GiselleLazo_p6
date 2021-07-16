const rateLimit = require('express-rate-limit');

//Limiter les requêtes

const limit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
});

module.exports = limit;