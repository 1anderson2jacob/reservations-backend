'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const db = mongoose.connection;

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
db.once('open', _ => {
  console.log('Database connected: ', process.env.MONGODB_URI);
})
db.on('error', err => {
  console.error('connection error: ', err);
})

require('./src/app.js').start(process.env.PORT);