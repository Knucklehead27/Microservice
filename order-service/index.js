const Eureka = require('eureka-js-client').Eureka;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const isAuthenticated = require("./isAuthenticated");
const Cart = require('./Cart');
const router = express.Router();
const axios = require('axios');


const app = express();
const PORT = process.env.PORT || 6060;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://RishabhAgarwal:V7e71O4jtrYm4wnm@atlascluster.kdlq5jz.mongodb.net/OrderService?retryWrites=true&w=majority")
    .then(() => {
        console.info("Connected to Order service DB");
    })
    .catch((e) => {
        console.log(e);
    }
);




// Route to add item to cart
app.post('/orders/add-to-cart', isAuthenticated, async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            // Cart exists for user, check if product exists, if so increment quantity
            let itemIndex = cart.items.findIndex(p => p.productId == productId);
            if (itemIndex > -1) {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            } else {
                // product does not exists in cart, add new item
                cart.items.push({ productId, quantity });
            }
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            // No cart for user, create new cart
            const newCart = await Cart.create({
                userId,
                items: [{ productId, quantity }]
            });
            return res.status(201).send(newCart);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

//checkout from cart
app.post('/orders/checkout', isAuthenticated, async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Process the checkout (e.g., update inventory, create order, etc.)
        // Your logic for checkout goes here
        // Currently No change in Inventory and any other data


        // Clear the cart after successful checkout
        cart.items = [];
        await cart.save();

        res.status(200).json({ message: 'Checkout successful' });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Error during checkout' });
    }
});

// Function to fetch product details
async function fetchProductDetails(productId) {
    try {
        const url = `http://localhost:8080/product/${productId}`;
        const response = await axios.get(url);
        return response.data; // Assuming the product details are directly in the response body
    } catch (error) {
        console.error(`Error fetching product details: ${error.message}`);
        // Handle the error appropriately
        // Depending on your use case, you might throw the error, return null, or handle it differently
        throw error;
    }
}
app.get('/orders/product-details/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const productDetails = await fetchProductDetails(productId);

        if (!productDetails) {
            return res.status(404).send({ message: 'Product not found' });
        }

        res.json(productDetails);
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send({ message: 'Server error while fetching product details' });
    }
});


const client = new Eureka({
  instance: {
    app: 'order-service',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': 6060,
      '@enabled': 'true',
    },
    vipAddress: 'order-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
  },
});

client.start(error => {
  console.log(error || 'Order service registered with Eureka');
});

// Assuming the client configuration from the previous step
client.start();

setInterval(() => {
    const instance = client.getInstancesByAppId('order-service');
    console.log('Discovered instance:', instance);
}, 50000);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});