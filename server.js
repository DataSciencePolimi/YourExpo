// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'server' );
var express = require( 'express' );
var forceTrailingSlash = require( 'express-slash' );


// Load my modules
var config = require( './config/' );
var initMongo = require( './models/' );
var yourExpo = require( './YourEXPO/' );


// Constant declaration


// Module variables declaration
var app = express();

// Module initialization (at first load)
Promise.promisifyAll( app );

app.locals.title = 'Your Expo 2015';
app.enable( 'trust proxy' );
app.enable( 'strict routing' );

app.use( forceTrailingSlash() );


// Routes
app.use( '/YourEXPO2015/', yourExpo );

// Entry point
app
.listenAsync( config.server.port, config.server.hostname )
.then( initMongo );



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78