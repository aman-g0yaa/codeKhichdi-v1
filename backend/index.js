const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const {DBConnection} = require('./database/db');
const User = require('./model/User');

DBConnection();

//middleWare
app.use(bodyParser.json());

app.post("/register", async (req,res)=>{
    try {

        //get all data from body
        const {firstName, lastName, email, password} = req.body;

        //validate the data 
        if(!(firstName && lastName && email && password)){
            throw new Error("Entered Details Invalid");
        }

        //check for exsisting user
        const exisitingUser = await User.findOne({email});
        if(exisitingUser){
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
            message:"User have been successfully registered!",
            user,
        });

    } catch(error) {
        console.error(error.message);
        return res.status(400).json({
            error: "Bad Request",
            message: error.message
        });
    }
});

app.listen(5000,()=>{
    console.log("Server Listening on port 5000!");
});