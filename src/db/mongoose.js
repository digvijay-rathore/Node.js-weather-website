const mongoose = require('mongoose');

const MongoDb_URL = 'mongodb+srv://digvijay-weather-application:Madhu54321@cluster0.q94mr.mongodb.net/test?retryWrites=true&w=majority' || 'mongodb://127.0.0.1:27017/test'

mongoose.connect(MongoDb_URL, { useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology : true});