const express = require('express');
const app = express();

app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.post("/register",(req,res)=>{
    try {

        //get all data from body

        const {firstName, lastName, email, password} = req.body;

        //validate the data 

        if(!(firstName && lastName && email && password)){
            throw new Error("Entered Details Invalid");
        }

        //check if user already exsist or not 
            
        if(checkDbforEmail())
        

        //encrpyting the password 
        //if not register in db
        //return response

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