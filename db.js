require('dotenv').config();
const mongoose = require('mongoose');

const connect = async () => {
    var err;
    mongoose.connect(
        process.env.MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (e) => {
            if (e) return console.log("Error: ", e);
            err = e;
        });
        if (!err) 
            console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }

const close = async () => { await mongoose.connection.close(); }

module.exports = {connect: connect};