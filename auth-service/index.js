const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const mongoose = require("mongoose");
const User = require("./User");
const jwt = require("jsonwebtoken");
const Eureka = require('eureka-js-client').Eureka;


app.use(express.json());
mongoose.connect("mongodb+srv://RishabhAgarwal:V7e71O4jtrYm4wnm@atlascluster.kdlq5jz.mongodb.net/AuthService?retryWrites=true&w=majority")
.then(() => {
	console.info("Connected to Auth service DB");
})
.catch((e) =>{
	console.log(e);
});



app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "User doesn't exist" });
    } else {
        if (password !== user.password) {
            return res.json({ message: "Password Incorrect" });
        }
        const payload = {
            email,
            name: user.name
        };
        jwt.sign(payload, "secret", (err, token) => {
            if (err) console.log(err);
            else return res.json({ token: token });
        });
    }
});

app.post("/auth/register", async (req, res) => {
    const { name, email, password} = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.json({ message: "User already exists" });
    } else {
        const newUser = new User({
            email,
            name,
            password,
        });
        newUser.save();
        return res.json(newUser);
    }
});

const client = new Eureka({
    instance: {
        app: 'auth-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 7070,
            '@enabled': 'true',
        },
        vipAddress: 'auth-service',
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
    console.log(error || 'Auth service registered with Eureka');
});
client.start();

setInterval(() => {
    const instance = client.getInstancesByAppId('auth-service');
    console.log('Discovered instance:', instance);
}, 10000);

app.listen(PORT, () => {
    console.log(`Auth-Service at ${PORT}`);
});
