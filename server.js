// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'server' );
var express = require( 'express' );
var forceTrailingSlash = require( 'express-slash' );


// Load my modules
var config = require( './config/' );
var initMongo = require( './models/' );
var yourExpo = require( './YourExpo2015/' );


// Constant declaration


// Module variables declaration
var app = express();
var port = config.server.port;
var hostname = config.server.hostname || '0.0.0.0';

// Module initialization (at first load)
Promise.promisifyAll( app );

app.locals.title = 'YourExpo2015';
app.enable( 'trust proxy' );
app.enable( 'strict routing' );

app.use( forceTrailingSlash() );


// Routes
app.use( '/YourExpo2015/', yourExpo );

// Entry point
app
.listenAsync( port, hostname )
.log( debug, 'Server started on %s:%d', hostname, port )
.then( initMongo )
.log( debug, 'Mongo ready' );




//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78