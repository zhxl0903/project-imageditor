//refrence from hhttp://jasonwatmore.com/post/2018/06/14/nodejs-mongodb-simple-api-for-authentication-registration-and-user-management#user-service-js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const mongodb = require("mongodb");
const https = require('https');
const app = express();
const logger = require('morgan');
const cookie = require('cookie');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));
app.use(cors());

// function to redirect http client traffic to https
// https://stackoverflow.com/questions/29810607/how-to-force-https-redirect-on-heroku-with-express-4-0
var https_redirect = function(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        } else {
            return next();
        }
    } else {
        return next();
    }
};

// redirects http client traffic to https
app.use(https_redirect);

// uses JWT auth to secure the api
app.use(jwt());

// api routes and validator for security
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

app.get('', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// sets port and starts server
// SSL termination is done on Heroku servers before traffic gets to application
// Heroku server then opens a http connection to this backend and the results are
// sent back to the client as https. Thus we start an http server here
// https://stackoverflow.com/questions/25148507/https-ssl-on-heroku-node-express
var privateKey = fs.readFileSync( 'imageditor.me.key' );
var certificate = fs.readFileSync( 'imageditor.me.pem' );
var config = {
        key: privateKey,
        cert: certificate
};
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
