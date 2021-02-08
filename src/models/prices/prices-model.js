'use strict';

const Model = require('../mongo.js');
const schema = require('./prices-schema.js');

/**
 * Class representing a Prices.
 * @extends Model
 */
class Prices extends Model { }

module.exports = new Prices(schema);