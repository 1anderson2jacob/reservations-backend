'use strict';

/**
 * API Server Module
 * @module src/app
 */

const cwd = process.cwd();

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const bodyParser = require('body-parser');

// Esoteric Resources
const errorHandler = require(`${cwd}/src/middleware/500.js`);
const notFound = require(`${cwd}/src/middleware/404.js`);
const v1Router = require(`${cwd}/src/api/v1.js`);

//stripe
const stripeRouter = require(`${cwd}/src/stripe/router.js`)

//adminBro
const adminBro = require(`${cwd}/src/admin/router.js`)

// Prepare the express app
const app = express();

//adminBro 
app.use(adminBro.adminBro.options.rootPath, adminBro.router);

// App Level MW
app.use(cors());
app.use(morgan('dev'));

function excludeSomePaths(fn) {
  return function (req, res, next) {
    if (req.path === '/stripe/payment-status') {
      next();
    } else {
      fn(req, res, next);
    }
    // if (req.path !== '/payment-status') {
    //   fn(req, res, next);
    // }
  }
}
app.use(excludeSomePaths(express.json()));
app.use(express.urlencoded({ extended: true }));

// Static Routes
// app.use('/docs', express.static('docs'));

// Routes
app.use(v1Router);
app.use (stripeRouter);

// Catchalls
app.use(notFound);
app.use(errorHandler);

/**
 * Start Server on specified port
 * @param port {integer} (defaults to process.env.PORT)
 */
let start = (port = process.env.PORT) => {
  app.listen(port, () => {
    console.log(`Server Up on ${port}`);
  });
};

module.exports = { app, start };