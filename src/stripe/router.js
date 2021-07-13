const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY);
const FRONTEND_URL = 'http://packwoodrv.com';


// API Routes
router.get('/stripe/prices', handleGetPrices);
router.post('/stripe/create-checkout-session', handleCheckout);
router.post('/stripe/payment-status', bodyParser.raw({ type: 'application/json' }), handlePaymentStatus);


// Route Handlers
async function handleGetPrices(request, response, next) {
    //console.log('in handleGetPrices')
    const prices = await stripe.prices.list()

    const pricesObj = {
        daily: prices.data[0].unit_amount,
        weekly: prices.data[1].unit_amount,
        monthly: prices.data[2].unit_amount
    }

    if (prices) {
        response.status(200).json(pricesObj);
    } else {
        console.log('handleGetPrices error');
    }
}
  
async function handleCheckout(request, response, next) {
    //console.log('in handleCheckout');
    const TAX_RATE_ID = process.env.TAX_RATE_ID;
    const DAILY_PRICE = process.env.DAILY_PRICE;
    const WEEKLY_PRICE = process.env.WEEKLY_PRICE;
    const MONTHLY_PRICE = process.env.MONTHLY_PRICE;

    const totalDays = request.body.totalDays;
    let reservationText = `Reservations at Packwood RV Park and Campground from ${request.body.dateStart} to ${request.body.dateEnd}`;

    let price = '';
    if (totalDays < 8) {
    price = await stripe.prices.retrieve(DAILY_PRICE);
    } else if (totalDays < 28) {
    price = await stripe.prices.retrieve(WEEKLY_PRICE);
    } else {
    price = await stripe.prices.retrieve(MONTHLY_PRICE);
    }
    price = price.unit_amount * totalDays;

    let mongoObject = {
    dateStart: request.body.dateStart,
    dateEnd: request.body.dateEnd,
    siteNumber: request.body.siteNumber,
    siteType: request.body.siteType,
    }

    const session = await stripe.checkout.sessions.create({
    metadata: mongoObject,
    payment_method_types: ['card'],
    line_items: [
        {
        price_data: {
            currency: 'usd',
            product_data: {
            name: reservationText,
            },
            unit_amount: price,
        },
        quantity: 1,
        tax_rates: [TAX_RATE_ID]
        },
    ],
    mode: 'payment',
    success_url: `${FRONTEND_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL}`,
    });
    response.json({ id: session.id });
}
  
async function handlePaymentStatus(request, response, next) {
    // console.log('in handlePaymentStatus')
    const endpointSecret = process.env.STRIPE_ENPOINT_SECRET;
    const sig = request.headers['stripe-signature'];
    const body = request.body;

    let event = null;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    let intent = null;
    switch (event['type']) {
        case 'checkout.session.completed':
        intent = event.data.object;
        if (intent.payment_status === 'paid') {
            // console.log('intent.payment_status === paid')
            checkoutSessionCompleted(intent, request, response)
            return;
        }

        break;
    }

    //if    
    response.sendStatus(200);
}

async function checkoutSessionCompleted(obj, req, res) {
    // console.log('in checkoutSessionComplete')
    // console.log("Checkout session completed:", obj.id);
    const customer = await stripe.customers.retrieve(obj.customer);
    const payment_intent = await stripe.paymentIntents.retrieve(obj.payment_intent,
      {
        expand: ['payment_method']
      });
    const customerName = payment_intent.payment_method.billing_details.name;
    let record = {
      name: customerName,
      email: obj.customer_details.email,
      dateStart: obj.metadata.dateStart,
      dateEnd: obj.metadata.dateEnd,
      siteNumber: obj.metadata.siteNumber,
      siteType: obj.metadata.siteType,
    }
    let model = require(`../models/reservations/reservations-model.js`);
    return model.post(record)
    .then(result => res.sendStatus(200))
    .catch(error => res.status(500).send(error)) // try a redirect
}
  
module.exports = router;