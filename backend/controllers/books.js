const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp');


exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const outputFileName = `images/${Date.now()}.webp`;

  sharp(req.file.buffer)
    .resize({height: 320, fit: 'inside' })
    .webp({ quality: 80 })
    .toFile(outputFileName)
    .then(() => {
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/${outputFileName}`
      });
      return book.save();
    })
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};


exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete bookObject._userId;
  const outputFileName = `images/${Date.now()}.webp`;

  sharp(req.file.buffer)
    .resize({height: 320, fit: 'inside' })
    .webp({ quality: 80 })
    .toFile(outputFileName)
    .then(() => {
      Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ message: 'Not authorized' });
        }
        if (req.file) {
          const oldFilename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${oldFilename}`, (err) => {
          });
        }
        Book.updateOne({ _id: req.params.id }, {
           ...bookObject, 
           _id: req.params.id,
           imageUrl: `${req.protocol}://${req.get('host')}/${outputFileName}`
           })
          .catch(error => res.status(400).json({ error }));
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  
    })
    .then(() => res.status(200).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(400).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.rateBook = (req, res, next) => {
  const userId = req.body.userId;
  const grade = req.body.rating;

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: "Book not found!" });
      }
      const existingRating = book.ratings.find(r => r.userId === userId);
      if (existingRating) {
        return res.status(400).json({ message: "User has already rated this book!" });
      }
      book.ratings.push({ userId, grade });
      let total = 0;
      let index = 0;
      book.ratings.forEach((rate) => {
        total += rate.grade;
        index++;
      })
      let averageRating = total / index;
      book.averageRating = averageRating;
      book.save()
        .then(() => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

