'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const prices = mongoose.Schema({
  _id: { type: String },
  daily: { type: Number, get: getPrice, set: setPrice },
  weekly: { type: Number, get: getPrice, set: setPrice },
  monthly: { type: Number, get: getPrice, set: setPrice },
});

function getPrice(num) {
  return (num / 100).toFixed(2);
}

function setPrice(num) {
  return num * 100;
}

module.exports = mongoose.model('prices', prices);