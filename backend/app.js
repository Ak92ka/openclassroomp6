const express = require("express");
const app = express();
const mongoose = require("mongoose");
const booksRoutes = require('./routes/books')

require('dotenv').config()

const mongoMP = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://ahmedinho0o0:${mongoMP}@cluster0.cim10.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/books', booksRoutes);


module.exports = app;