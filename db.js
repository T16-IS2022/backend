require('dotenv').config();
const mongoose = require('mongoose');

function log(message) {
    if(process.env.NODE_ENV === 'test') return;
    console.log(message);
}

const connect = async () => {
    var err;
    mongoose.connect(
        process.env.MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (e) => {
            if (e) return log("Error: ", e);
            err = e;
        });
        if (!err) 
            log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }

const close = async () => { await mongoose.connection.close(); }



module.exports = {connect: connect};