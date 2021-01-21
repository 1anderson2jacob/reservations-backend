'use strict';

const Model = require('../mongo.js');
const schema = require('./reservations-schema.js');

/**
 * Class representing a Reservation.
 * @extends Model
 */
class Reservations extends Model { }

module.exports = new Reservations(schema);