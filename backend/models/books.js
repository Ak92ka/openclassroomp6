const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Book', thingSchema);