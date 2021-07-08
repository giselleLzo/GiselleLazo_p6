const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

router.post('/', saucesCtrl.createThing);
router.put('/:id', saucesCtrl.modifyThing); 
router.delete('/:id', saucesCtrl.deleteThing); 
router.get('/:id', saucesCtrl.deleteThing);  
router.get('/', saucesCtrl.deleteThing);  

module.exports = router;