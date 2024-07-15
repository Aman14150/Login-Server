const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/nemtask', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });
        console.log('Connection Successful with Mongoose');
    } catch (err) {
        console.log(err);
    }
};

module.exports = { connectDb };
