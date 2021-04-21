'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const reservations = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  date: { type: Date, required: false, default: Date.now },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  siteNumber: { type: Number, required: true },
  siteType: { type: String, required: true, uppercase: true, enum: ['RV', 'TENT'] }
});

module.exports = mongoose.model('reservations', reservations);