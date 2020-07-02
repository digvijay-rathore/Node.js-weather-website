const mongoose = require('mongoose');

const User = mongoose.model('user', {
    name : {
        type : String
    },
    email : {
        type : String
    }, 
    password : {
        type : String
    }
});

module.exports = User;