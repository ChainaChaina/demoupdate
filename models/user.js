const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    user: {type: String, required: true, max: 20},
    password: {type: String, required: true, max: 20},
});


// Export the model
module.exports = mongoose.model('User', userSchema);