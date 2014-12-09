// Load system modules
var path = require( 'path' );

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'server' );
var express = require( 'express' );
var forceTrailingSlash = require( 'express-slash' );
var serveStatic = require( 'serve-static' );


// Load my modules
var config = require( './config/' );
var initMongo = require( './models/' );
var yourExpo = require( './YourExpo2015/' );
var publicPath = path.join(__dirname, 'public');


// Constant declaration


// Module variables declaration
var app = express();
var port = config.server.port;
var hostname = config.server.hostname || '0.0.0.0';
var externalUrl = config.server.externalUrl;

// Module initialization (at first load)
Promise.promisifyAll( app );

app.locals.title = 'YourExpo2015';
app.enable( 'trust proxy' );
app.enable( 'strict routing' );


app.use( forceTrailingSlash() );


// Redirect to the challenge
app.get( '/', function( req, res ) {
  res.redirect( '/YourExpo2015' );
} );

app.use( '/YourExpo2015/', yourExpo );

app.use( serveStatic( publicPath ) ); // Placed after the 'GET /' route to enable redirects

// Entry point
app
.listenAsync( port, hostname )
.log( debug, 'Server started on %s:%d, external url: "%s"', hostname, port, externalUrl )
.then( initMongo )
.log( debug, 'Mongo ready' );




//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78
