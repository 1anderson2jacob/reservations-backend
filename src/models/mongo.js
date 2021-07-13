'use strict';

const { query } = require("express");

/** Class representing a generic mongo model. */
class Model {

  /**
   * Model Constructor
   * @param schema {object} - mongo schema
   */
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * JSON Schema
   * @returns {*}
   */
  jsonSchema() {
    // console.log(typeof this.schema.jsonSchema);
    return typeof this.schema.jsonSchema === 'function'
      ? this.schema.jsonSchema()
      : {};
  }

  /**
   * Retrieves one or more records
   * @param _id {string} optional mongo record id
   * @returns {*}
   */
  get(_id) {
    let queryObject = _id ? { _id } : {};
    return this.schema.find(queryObject);
    // this.schema.find(queryObject, (err, result) => {
    //   if (err) { console.log(err) }
    //   return result;
    // })
  }

  getByDateRange(startDate, endDate) {
    /*
    $eq equal (=).
    $gt greater than >.
    $gte greater or equal than (>=).
    $lt less than (<).
    */

    let queryObject = {
      $or: [
        { "dateStart": { $gte: startDate, $lt: endDate } },
        { "dateEnd": { $gte: startDate, $lt: endDate } }
      ]
    }
    //  like in a hotel, users should be able to schedule their start date the same
    //day another user leaves. right now, it only works one way

    //  if you schedule to leave the day that another person is arriving, then 
    //it (correctly) doesn't see a conflict.
    //  however, if a user schedules to arrive on the same day that another person
    //is leaving, then it has a conflict.

    return this.schema.find(queryObject);
  }

  /**
   * Create a new record
   * @param record {object} matches the format of the schema
   * @returns {*}
   */
  post(record) {
    let newRecord = new this.schema(record);
    return newRecord.save();
  }

  /**
   * Replaces a record in the database
   * @param _id {string} Mongo Record ID
   * @param record {object} The record data to replace. ID is a required field
   * @returns {*}
   */
  put(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, { new: true });
  }

  /**
   * Deletes a recod in the model
   * @param _id {string} Mongo Record ID
   * @returns {*}
   */
  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }

}

module.exports = Model;