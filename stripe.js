require('dotenv').config()
// const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const express = require('express');
const app = express();
app.set('view engine', 'ejs')
// setting all things in the public folder readable by browser
app.use(express.static('public'));
app.use(express.json())
// setting a library to read the items.json 
// const fs = require('fs')
app.listen(4242, () => console.log('Running on port 4242'));
// const cors = require("cors")

let storeItems = new Map([
  [1, { unit_amount: 10000, name: "Learn React Today" }],
  [2, { unit_amount: 20000, name: "Learn CSS Today" }],
])

const stripe = require('stripe')('sk_test_51Ja35HDGZ72Fm55g8XHjetsB6ZbMpFdM2eHo3ojN9lsDXH6gmUtAzItVORrDDEsR6xSYBJtgv94nOuQi047p1YW400llKEaNj7');

app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('try')
    const session = await stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        line_items: req.body.items.map(item => {
          console.log(storeItems)
                  storeItems.get('item.id')
                  return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name
                        },
                        unit_amount: item.unit_amount
                    },
                    
                    quantity: item.quantity
                  }
                }),
        mode: 'payment',
         // selecting the url to send upon successful payment or canceling
      // base url from env (environment) / able to change change endpoint here
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    })
    
    res.json({ url: session.url })
    console.log('yes')  }
catch (e) {
        // res.status(500).removeAllListeners({ error: error.message })
        console.log(e.message)
      }

    })