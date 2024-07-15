const mongoose =  require('mongoose');

const { Schema, model} = mongoose;

const userDataSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    token: { type: String, default: '', required: true}
})

const UserModel= model('users', userDataSchema);
module.exports = UserModel;