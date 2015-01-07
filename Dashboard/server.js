// Load system modules
var url = require( 'url' );
var path = require( 'path' );

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'dashboard:server' );
var _ = require( 'lodash' );

var moment = require( 'moment' );
var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var session = require( 'express-session' );
var serveStatic = require( 'serve-static' );

// Load my modules
var config = require( '../config/' );
var initMongo = require( '../models/' );
var tags = require( '../YourExpo2015/tags/' );
var configureHandlebars = require( './config/handlebars.js' );


// Constant declaration


// Module variables declaration
var app = express();
var port = config.server.port;
var hostname = config.server.hostname || '0.0.0.0';
var externalUrl = config.server.externalUrl;
var Router = express.Router;
var router = new Router();
var viewsPath = path.join( __dirname, 'views' );
var publicPath = path.join( __dirname, 'public' );


// Module initialization (at first load)
Promise.longStackTraces();
Promise.promisifyAll( app );
var hbsInstance = configureHandlebars( app );

/**
 * Configure app
 */
app.name = 'Your Expo 2015 Dashboard';
app.tags = tags;
app.baseUrl = externalUrl;
app.locals.title = app.name;
app.locals.tags = tags;
app.locals.baseUrl = externalUrl;
app.enable( 'trust proxy' );
app.engine( 'hbs', hbsInstance.__express );
app.set( 'views', viewsPath );
app.set( 'view engine', 'hbs' );



router.param( 'tag', function( req, res, next, tag ) {
  if( _.isUndefined( tags[ tag ] ) ) {
    debug( 'Tag not present' );
    return next( new Error( 'Tag not present' ) );
  }

  var tagObject = tags[ tag ];
  req.tag = tag;
  req.tagObject = tagObject;

  res.locals.tag = req.tag;
  res.locals.tagObject = tagObject;

  return next();
} );
/**
 * Routes
 */
router.get( '/', require( './routes/index.js' ) );
router.get( '/:tag', require( './routes/tag_index.js' ) );
router.get( '/:tag/data', require( './routes/tag_data.js' ) );


/**
 * Application middlewares
 */
app.use( serveStatic( publicPath ) );
app.use( session( {
  secret: 'asderfingf',
  resave: false,
  saveUninitialized: false
} ) );
app.use( bodyParser.json() );
app.use( router );


// Entry point
app
.listenAsync( port, hostname )
.log( debug, 'Server started on %s:%d, external url: "%s"', hostname, port, externalUrl )
.then( initMongo )
.log( debug, 'Mongo ready' );


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78