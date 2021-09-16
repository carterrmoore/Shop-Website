// ---------- NAVBAR ----------

const closeBtn = document.querySelector('.close-nav')
const openBtn = document.querySelector('.open-nav')
const nav = document.querySelector('.nav')

closeBtn.addEventListener("click", function() {
    nav.classList.remove('navigation-open')
})

openBtn.addEventListener("click", function() {
    nav.classList.add('navigation-open')
})




// ---------- CART -----------
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    updateCartTotal()

}

let inCartItems = []

// OPEN & CLOSE CART

const closeCartBtn = document.querySelector('.close-cart')
const openCartBtn = document.querySelector('.open-cart')
const cart = document.querySelector('.main-cart')

closeCartBtn.addEventListener("click", function() {
    cart.classList.remove('shopping-cart-open')
    console.log('close clicked')
})

openCartBtn.addEventListener("click", function() {
    cart.classList.add('shopping-cart-open')
    console.log('open clicked')
    console.log(inCartItems)

})




// ADD TO CART


const addToCartButtons = document.getElementsByClassName("addtocart") 
{
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i]
        button.addEventListener("click", addToCartClicked)
    }
}

function addToCartClicked(e) {
    let button = e.target
    let title = button.parentElement.querySelector(".shop-item-title").innerText
    let price = parseFloat(button.parentElement.querySelector(".shop-item-price").innerText.replace('Price: $', ''))
    let shopImg = button.parentElement.querySelector(".shop-item-img").src
    addItemToCart(title, price, shopImg)
    
}

function addItemToCart(title, price, shopImg) {
    let cartItemNames = document.getElementsByClassName("cartitem")
    for ( let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('This item is alread in your cart. To add another, please update your quantity.')
            return
        }
    }
    alert(`${title} has been added to your cart!`)

    inCartItems.push({title, price, shopImg})

    let cartRowContents = `
    <div class="cartrow">
        <div class="cartitem">
            <img class="cartimg" src="${inCartItems[inCartItems.length -1].shopImg}" alt="cart item" />
            <p class="title-el">${inCartItems[inCartItems.length -1].title}</p>
        </div>
            <p class="price-el">$ ${inCartItems[inCartItems.length -1].price}</p>
        <div class="quantity-buttons">
            <input type="number" class="quanity-el" min="1" max="99" value="1" />
            <button class="cartupdatebtn btn">update</button>
            <button class="cartremovebtn btn">remove</button>

        </div>
    </div>
`
    let cartRow = document.createElement('div')
    cartRow.innerHTML = cartRowContents
    let mainCart = document.getElementsByClassName("cart")[0]
    mainCart.append(cartRow)

    let removeCartItemButtons = document.getElementsByClassName("cartremovebtn")
    for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i]
    button.addEventListener("click", removeCartItem)
    }

    let updateCartItemButtons = document.getElementsByClassName("cartupdatebtn")
    for (let i = 0; i < updateCartItemButtons.length; i++) {
        let button = updateCartItemButtons[i]
        button.addEventListener("click", updateCartTotal)
    }

    updateCartTotal()

}

// REMOVE CART ITEM

let removeCartItemButtons = document.getElementsByClassName("cartremovebtn")
for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i]
    button.addEventListener("click", removeCartItem)
}


function removeCartItem(e) {
    let buttonClicked = e.target
            let cartTitle = buttonClicked.parentElement.parentElement.querySelector(".title-el").innerText
            const result = inCartItems.find( ({ title }) => title === cartTitle)
            let index = inCartItems.indexOf(result)
            inCartItems.splice(index, 1)
            console.log(inCartItems)
            buttonClicked.parentElement.parentElement.remove()
            updateCartTotal()
        }

// UPDATE CART


let updateCartItemButtons = document.getElementsByClassName("cartupdatebtn")
for (let i = 0; i < updateCartItemButtons.length; i++) {
    let button = updateCartItemButtons[i]
    button.addEventListener("click", updateCartTotal)
}




function updateCartTotal() {
    let total = 0
    const cartRows = document.getElementsByClassName("cartrow")
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceEl = cartRow.getElementsByClassName("price-el")[0]
        let quantityEl = cartRow.getElementsByClassName("quanity-el")[0]
        const price = parseFloat(priceEl.innerText.replace('$', ''))
        const quantity = quantityEl.value
        total += (price * quantity)

    }
    total = Math.round((total) * 100) / 100

    document.getElementsByClassName("cart-total-price")[0].innerText =": $" + total
}


// PURCHASE


let purchasebutton = document.getElementsByClassName("purchasebtn")
for (let i = 0; i < purchasebutton.length; i++) {
    let button = purchasebutton[i]
    button.addEventListener("click", emptyCart) 
}

function emptyCart() {
    let mainCart = document.getElementsByClassName("cart")[0]
    while(mainCart.hasChildNodes()) {
        alert(`Thank you for your purchase of${document.getElementsByClassName("cart-total-price")[0].innerText}!`)
        emptyCart = ''
        mainCart.innerHTML = emptyCart
        document.getElementsByClassName("cart-total-price")[0].innerText = ""
        
    }
 
}


// ---------- FUNCTION BUTTONS ----------
// let healthButton = document.querySelector(".healthbtn")
// let optionsPage = document.querySelector(".healthcontainer")

// console.log(healthButton)
// console.log(optionsPage)

// healthButton.addEventListener('click', nextPage)


// function nextPage() {
//     document.querySelector(".herocontainer").classList.add("hide")
//     optionsPage.classList.add("show")
// }

// function back() {
//     document.querySelector(".herocontainer").classList.remove("hide")
//     optionsPage.classList.remove("show")
// }


// document.querySelector(".back").addEventListener('click', back)

// ---------- STRIPE ------------
let title = inCartItems.title
let priceEl = document.getElementsByClassName("price-el")[0]
let quantityEl = document.getElementsByClassName("quanity-el")[0]
const buttonEl = document.getElementById("purchasebtn")
console.log(buttonEl)
buttonEl.addEventListener("click", async () => {
    console.log(inCartItems)

console.log('start')
const res = await fetch("/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 3, unit_amount: inCartItems[0].price, name: inCartItems[0].title},
        { id: 2, quantity: 2, unit_amount: inCartItems[1].price, name: inCartItems[1].title},
      ],
    }),
  })
    const data = await res.text()
    console.log(data)
    // let url = data.url
    // window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })

    // ============== SERVER ++++++++++++++++


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