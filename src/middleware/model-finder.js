
'use strict';

const requireDirectory = require('require-directory');

const whitelist = /.*?model.js$/; // Only index *model.js files
const renamer = (name) => name.replace(/(.*?-)model/g, 'model'); // make them all named "model"
const models = requireDirectory(module, '../models', { rename: renamer, include: whitelist });

const list = () => Object.keys(models).filter((model) => model !== "model");

const finder = (req, res, next) => {

  try {
    let modelName = req.params.model.replace(/[^a-z0-9-_]/gi, '');
    req.model = require(`../models/${modelName}/${modelName}-model.js`);
    next();
  }
  catch (e) { next('Invalid Model'); }

};

module.exports = { finder, list };