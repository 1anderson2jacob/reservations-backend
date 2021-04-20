# reservations-backend

## Steps for setting up local testing with stripe
1. Open Terminal
2. Run `stripe login` and follow login steps
3. Run `stripe listen --forward-to localhost:3000/stripe/payment-status` to redirect stripe webhook to local server
4. In another terminal, go to reservations backend server directory and run `npm start`

### Todo before 4/21
- [ ] Add login credentials to adminbro and create user accounts for me, Steven, and whatshername
- [ ] Put dropdown of available sites in adminbro 'add reservation' functionality instead of a textbox
- [ ]* Add field for cash accepted for admin-made reservations

### Todo general
- [ ] Put limit on user reservations for 1 year out.
- [ ] Construct and implement custom email to be sent after a reservation is made that contains a link which allows user to undo the reservation and trigger a refund
- [ ] Implement 5 minute temporary reservation lock on selected site (for selected dates)
- [ ] Eliminate excess routes on server, and restrict access (CORs policy) to remaining routes to specific URLs
- [ ] Write documentation about the process of setting up the backend with stripe testing, and converting both the server and frontend to live (updating keys etc...)
- [ ] Cleanup server of excess code and comments, then either reimplement the REST documentation tool, or get rid of its remaining documentation.
- [ ] Write a test suite for backend that simulates the front end routes to trigger a successful reservation (complete with stripe integration), to test unsuccessful reservations at every step (payment declined, site now unavailable etc) and finish by sending verification email.
- [ ] Update README.md to reflect all the documentation, and website/server hosting.