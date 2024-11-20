const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { DBConnection } = require('./database/db');
const User = require('./model/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

DBConnection();
dotenv.config();

//middleWare
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
    try {

        //get all data from body
        const { firstName, lastName, email, password } = req.body;

        //validate the data 
        if (!(firstName && lastName && email && password)) {
            throw new Error("Entered Details Invalid");
        }

        //check for exsisting user
        const exisitingUser = await User.findOne({ email });
        if (exisitingUser) {
            return res.status(400).send("User already exsists.");
        }

        //encrypting password
        const hashedPassword = bcrypt.hashSync(password, 10);

        //save user into the db
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        //return response 
        res.status(200).json({
            message: "User have been successfully registered!",
            user,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            error: "Bad Request",
            message: error.message
        });
    }
});


app.post("/login", async (req, res) => {
    try {
        //get user email and pw 
        const { email, password } = req.body;

        //check valid email and password
        if (!(email && password)) {
            res.status(400).send("Invalid email or password");
        }

        //if email exsist return user 
        const userDetails = await User.findOne({ email }).exec();

        const passwordMatch = await bcrypt.compare(password, userDetails.password);
        if (!passwordMatch) {
            throw new Error("User Login Failed!");
        }

        //generate jwt token
        const token = jwt.sign({id: userDetails._id},process.env.SECRET_KEY, ({
            expiresIn: "1h",
        }));

        userDetails.token = token;
        userDetails.password = undefined;

        //store cookie
        const option = {
            expires: new Date(Date.now()+1*24*60*60*1000),
            httpOnly: true
        }

        //send token
        res.status(200).cookie("token", token, option).json({
            message:"User logged in successfully",
            token,
        })


    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            error: "Bad Request",
            message: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("Server Listening on port 5000!");
});