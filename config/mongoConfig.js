const mongoose = require('mongoose');

const connectDb = async ()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/nemtask')
        console.log('Connection Sucessfull with Mongoose')
    } catch (err) {
        console.log(err)
    }
}
module.exports = {connectDb};