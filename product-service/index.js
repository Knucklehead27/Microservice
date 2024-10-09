const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 8080;
const mongoose = require("mongoose");
const Product = require("./Product");
const jwt = require("jsonwebtoken");
const amqp = require("amqplib");
const isAuthenticated = require("./isAuthenticated");
const Eureka = require('eureka-js-client').Eureka;


app.use(express.json());

mongoose.connect("mongodb+srv://RishabhAgarwal:V7e71O4jtrYm4wnm@atlascluster.kdlq5jz.mongodb.net/ProductService?retryWrites=true&w=majority")
.then(() => {
        console.info("Connected to Product service DB");
})
.catch((e) =>{
        console.log(e);
});

// Create/Add a product
app.post("/product/create", isAuthenticated, async (req, res) => {
    const { name, description, price } = req.body;
    const newProduct = new Product({
        name,
        description,
        price,
    });
    newProduct.save();
    return res.json(newProduct);
});

//Delete a product
app.delete("/product/:id", isAuthenticated, async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).send(`Product with id ${req.params.id} has been deleted.`);
        } else {
            res.status(404).send('Product not found.');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

//View all product by user

app.get('/product/getAll', async (req, res) => {
    try {
        const products = await Product.find(); // Find all products
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while retrieving products.", error: error });
    }
});

//Edit/Remove product details
app.patch('/product/:id', isAuthenticated, async (req, res) => {
    const updates = req.body;
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Update the fields that are provided in the request body
        Object.keys(updates).forEach((update) => product[update] = updates[update]);

        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

//get product by product id
app.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

const client = new Eureka({
    instance: {
        app: 'product-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 8080,
            '@enabled': 'true',
        },
        vipAddress: 'product-service',
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
    console.log(error || 'Product service registered with Eureka');
});
client.start();

setInterval(() => {
    const instance = client.getInstancesByAppId('product-service');
    console.log('Discovered instance:', instance);
}, 20000);


app.listen(PORT, () => {
    console.log(`Product-Service at ${PORT}`);
});
