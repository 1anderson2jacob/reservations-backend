'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const year = 31536000; //in milliseconds
const reservations = mongoose.Schema({
  session_id: { type: String, required: false},
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
        // ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: false
  },
  date: { type: Date, required: false, default: Date.now },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, max: () => new Date(+new Date() + 365*24*60*60*1000), required: true },
  siteNumber: { type: Number, required: true },
  siteType: { type: String, required: true, uppercase: true, enum: ['RV', 'TENT'] }
});

module.exports = mongoose.model('reservations', reservations);
