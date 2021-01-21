'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const reservations = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  site: { type: Number, required: true },
});

module.exports = mongoose.model('reservations', reservations);