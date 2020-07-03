const mongoose = require('mongoose');

const MongoDb_URL = 'mongodb+srv://digvijay-weather-application:<password>@cluster0.q94mr.mongodb.net/weather?retryWrites=true&w=majority' || 'mongodb://127.0.0.1:27017/test'

mongoose.connect(MongoDb_URL, { useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology : true});
