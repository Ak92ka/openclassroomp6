const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const booksCtrl = require('../controllers/books');


router.post('/', booksCtrl.createBook);
router.put('/:id', auth, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/:id', auth, booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks)


module.exports = router;