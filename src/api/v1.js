'use strict';

/**
 * API Router Module (V1)
 * Integrates with various models through a common Interface (.get(), .post(), .put(), .delete())
 * @module src/api/v1
 */

const cwd = process.cwd();
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);
const router = express.Router();
const bodyParser = require('body-parser');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY);
// const FRONTEND_URL = 'http://localhost:8080';
// const Model = require('../models/mongo.js');
// const errorHandler = require(`${cwd}/src/middleware/500.js`);

// Evaluate the model, dynamically
router.param('model', modelFinder.finder);

// Swagger Docs
// const swaggerDocs = require(`${cwd}/docs/config/swagger.json`);
// router.use('/api/v1/doc/', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Models List
router.get('/api/v1/models', (request, response) => {
  modelFinder.list()
    .then(models => response.status(200).json(models));
});

// JSON Schema
router.get('/api/v1/:model/schema', (request, response) => {
  response.status(200).json(request.model.jsonSchema());
});

// API Routes
router.get('/api/v1/:model', handleGetAll);
router.post('/api/v1/:model', handlePost);
router.get('/api/v1/:model/available-sites/', handleGetAvailableSites)

router.get('/api/v1/:model/:id', handleGetOne);
router.put('/api/v1/:model/:id', handlePut);
router.delete('/api/v1/:model/:id', handleDelete);

// router.get('/prices', handleGetPrices);
// router.post('/create-checkout-session', handleCheckout);
// router.post('/payment-status', bodyParser.raw({ type: 'application/json' }), handlePaymentStatus);


// Route Handlers

/**
 * Fetches all records from a given model.
 * @example router.get('/api/v1/:model', handleGetAll);
 * @param req {object} Express Request Object (required params: model)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handleGetAll(request, response, next) {
  request.model.get()
    .then(data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch(next);
}

/**
 * Fetches a single record from a given model.
 * @example router.get('/api/v1/:model/:id', handleGetOne);
 * @param req {object} Express Request Object (required params: model, id)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handleGetOne(request, response, next) {
  request.model.get(request.params.id)
    .then(result => response.status(200).json(result[0]))
    .catch(next);
}

/*
 * Gets all sites that are available in a date range
 */
function handleGetAvailableSites(request, response, next) {
  request.model.getByDateRange(request.query.startDate, request.query.endDate)
    .then(data => {
      let sites = data.map(record => record.siteNumber)
      const output = {
        // count: data.length,
        results: sites,
      };
      response.status(200).json(output);
    })
    .catch(next);
}

/**
 * Creates a single record in a given model.
 * @example router.post('/api/v1/:model', handlePost);
 * @param req {object} Express Request Object (required params: req.model)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handlePost(request, response, next) {
  request.model.post(request.body)
    .then(result => response.status(200).json(result))
    .catch(next);
}

/**
 * Updates a single record in a given model.
 * @example router.put('/api/v1/:model/:id', handlePut);
 * @param req {object} Express Request Object (required params: model, id)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handlePut(request, response, next) {
  request.model.put(request.params.id, request.body)
    .then(result => response.status(200).json(result))
    .catch(next);
}

/**
 * Deletes a single record from a given model.
 * @example router.delete('/api/v1/:model/:id', handleDelete);
 * @param req {object} Express Request Object (required params: model, id)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handleDelete(request, response, next) {
  request.model.delete(request.params.id)
    .then(result => response.status(200).json(result))
    .catch(next);
}

module.exports = router;