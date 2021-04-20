# reservations-backend

## Steps for setting up local testing with stripe
1. Open Terminal
2. Run `stripe login` and follow login steps
3. Run `stripe listen --forward-to localhost:3000/stripe/payment-status` to redirect stripe webhook to local server
4. In another terminal, go to reservations backend server directory and run `npm start`

