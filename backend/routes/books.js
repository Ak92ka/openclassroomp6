const express = require('express');
const router = express.Router();
//const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksCtrl = require('../controllers/books');


router.post('/', multer, booksCtrl.createBook);
router.put('/:id', multer, booksCtrl.modifyBook);
router.delete('/:id', booksCtrl.deleteBook);
router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks)
router.post('/:id/rating', booksCtrl.rateBook)
router.get('/bestrating', booksCtrl.getBestRatedBooks);


module.exports = router;