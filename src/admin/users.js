'use strict';
const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);
const bcrypt = require('bcrypt');

const Users = mongoose.Schema({
  email: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  role: { type: String, enum: ['admin', 'restricted'], required: true },
})
// const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'

module.exports = mongoose.model('Users', Users);