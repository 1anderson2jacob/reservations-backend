const cwd = process.cwd();
// AdminBro
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const bcrypt = require('bcrypt');
AdminBro.registerAdapter(AdminBroMongoose);

const Reservations = require(`${cwd}/src/models/reservations/reservations-schema.js`);
const Users = require(`${cwd}/src/admin/users.js`);

// Roled based access functions
// const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
// const canModifyReservations

const AdminBroOptions = {
  resources: [
    { resource: Reservations,
      options: { 
        properties: {
          // siteNumber: {
          //   components: {

          //   }
          // }
        },
        listProperties: ['email', 'name', 'address', 'dateStart', 'dateEnd', 'siteNumber'],
        actions: {
          new: {
            layout: ['email', 'name', 'address', 'dateStart', 'dateEnd', 'siteNumber'],
          },
        }
      } 
    },
    { resource: Users,
      options: {
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: 'string',
            isVisible: {
              list: false, edit: true, filter: false, show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if(request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                  password: undefined,
                }
              }
              return request
            },
          },
          // edit: { isAccessible: canModifyUsers },
          // delete: { isAccessible: canModifyUsers },
          // new: { isAccessible: canModifyUsers },
        }
      }
    }
  ],
  rootPath: '/admin',
  branding: {    companyName: 'Packwood RV',
  },

}


const adminBro = new AdminBro(AdminBroOptions)
// const router = AdminBroExpress.buildRouter(adminBro);

// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await Users.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})

module.exports = {
  adminBro,
  router,
}