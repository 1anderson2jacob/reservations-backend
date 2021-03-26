const cwd = process.cwd();
// AdminBro
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

AdminBro.registerAdapter(AdminBroMongoose);
// const express = require('express');

const Reservations = require(`${cwd}/src/models/reservations/reservations-schema.js`);

const AdminBroOptions = {
  // resources: [Reservations],
  resources: [
    { resource: Reservations, options: { listProperties: ['email', 'name', 'address', 'date', 'dateStart', 'dateEnd', 'siteNumber'] } }
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Packwood RV',
  },
}

const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpress.buildRouter(adminBro);

module.exports = {
  adminBro,
  router,
}

