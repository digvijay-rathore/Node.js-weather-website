const path = require('path');
require('./db/mongoose');
const User = require('./db/model');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const express = require('express');
const hbs = require('hbs');
const { check, validationResult } = require('express-validator');
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 3000;

var urlencodedParser = bodyParser.urlencoded({extended:false});

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('login', {
        title : 'Weather',
        name : 'Digvijay Rathore'
    });
})

app.post(
    '/login', 
    urlencodedParser, 
    [
        check("t1", "Invalid email address!").isEmail(),
        check("t2", "Password should be atleast 5 characters long!").isLength({min:5})
    ], 
    (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('login', {
                title : 'Weather',
                name : 'Digvijay Rathore',
                error : errors.mapped()
            });
        }else{
            User.findOne({email : req.body.t1, password : req.body.t2}).then((user) => {
                if(!user){
                    res.render('login', {
                        title : 'Weather',
                        name : 'Digvijay Rathore',
                        loginError : true
                    });
                }else{
                    res.render('index', {
                        title : 'Weather',
                        name : 'Digvijay Rathore',
                        username : user.name
                    });
                }
            });
        }
    }
);

app.get('/signup', (req, res) => {
    res.render('signup', {
        title : 'Weather',
        name : 'Digvijay Rathore'
    });
});

app.post(
    '/signup-validate',
    urlencodedParser,
    [
        check("s1", "This field is required!").notEmpty(),
        check("s2", "Invalid email address!").isEmail(),
        check("s3", "Password should be atleast 5 characters long!").isLength({min:5}),
        check("s4", "Passwords do not match!").custom((value, {req}) => (value === req.body.s3))
    ], 
    (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('signup', {
                title : 'Weather',
                name : 'Digvijay Rathore',
                error : errors.mapped()
            });
        }else{
            User.findOne({email : req.body.s2}).then((user) => {
                if(user){
                    res.render('signup', {
                        title : 'Weather',
                        name : 'Digvijay Rathore',
                        signupError : true
                    });
                }else{
                    const userDocument = new User({
                        name : req.body.s1,
                        email : req.body.s2,
                        password : req.body.s3
                    });
        
                    userDocument.save().then(() => {
                        res.render('login', {
                            title : 'Weather',
                            name : 'Digvijay Rathore'
                        });
                    }).catch((e) => {
                        res.render('error', {
                            title : 'Oops..Server Down!',
                            msg : 'We cannot register you right because of some technical issue.',
                            name : 'Digvijay Rathore'
                        });
                    });
                }
            }).catch((e) => {
                res.render('error', {
                    title : 'Oops..Server Down!',
                    msg : 'We cannot register you right because of some technical issue.',
                    name : 'Digvijay Rathore'
                });
            });
        }
    }
);

app.get('/home', (req, res) => {
    res.render('index', {
        title : 'Weather',
        name : 'Digvijay Rathore'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title : 'About Me',
        name : 'Digvijay Rathore'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title : 'Help',
        name : 'Digvijay Rathore'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error : 'You have to provide an address'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error){
            return res.send({
                error : error
            });
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({
                    error : error
                })
            }   
                 
            res.send({
                location : location,
                forecast : forecastData,
            });
        });
    });
});

app.get('/help/*', (req, res) => {
    res.render('error', {
        title : '404',
        msg : 'Help article not found.',
        name : 'Digvijay Rathore'
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        title : '404',
        msg : 'Page not found.',
        name : 'Digvijay Rathore'
    });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});