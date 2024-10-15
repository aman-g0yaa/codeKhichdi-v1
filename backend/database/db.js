const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connection established");
    } catch(error){
        console.log("Error while connection to MongoDB, MongoDB URL: " + process.env.MONGODB_URL + "  |", error.message);
    }
}

module.exports = {DBConnection};