const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    _id: String,
    name: {type: String, required: true},
    email: {
        type: String, 
        required: true, 
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    token: {type: String, required: true},
});
module.exports = mongoose.model('Patient', patientSchema);
