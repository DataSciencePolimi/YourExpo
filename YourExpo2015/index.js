// Load system modules
var url = require('url');
var path = require('path');

// Load modules
var Promise = require('bluebird');
var debug = require('debug')('yourexpo:server');
var _ = require('lodash');

var passport = require('passport');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var serveStatic = require('serve-static');

// Load my modules
var config = require('../config/');
var tags = require('./tags/');
var configureHandlebars = require('./config/handlebars.js');
var configurePassport = require('./config/passport.js');


// Constant declaration


// Module variables declaration
var app = express();
var Router = express.Router;
var router = new Router();
var viewsPath = path.join(__dirname, 'views');
var publicPath = path.join(__dirname, 'public');


// Module initialization (at first load)
var hbsInstance = configureHandlebars(app);


/**
 * Configure app
 */
app.name = 'YourEXPO2015';
app.locals.title = 'YourExpo2015';
app.enable('trust proxy');
app.enable('strict routing');
app.engine('hbs', hbsInstance.__express);
app.set('views', viewsPath);
app.set('view engine', 'hbs');

app.on('mount', function(parent) {
  var baseUrl = url.resolve(config.server.externalUrl, parent.mountpath);
  baseUrl = url.resolve(baseUrl, app.mountpath);

  app.baseUrl = baseUrl;
  app.locals.baseUrl = baseUrl;
});


configurePassport(app);



/**
 * Middleware functions for Authorization.
 */
function checkAuth(req, res, next) {
  if (req.isAuthenticated())
    return next();

  var instagramAuthUrl = url.resolve(req.app.baseUrl, 'auth/instagram');
  debug('Redirecting to %s', instagramAuthUrl);
  res.redirect(instagramAuthUrl);
}

function successAuth(req, res) {
  var tag = req.session.tag;
  var instagramAuthUrl = url.resolve(req.app.baseUrl, tag + '/profile');
  debug('Redirecting to %s', instagramAuthUrl);

  // Successful authentication, redirect home.
  res.redirect(instagramAuthUrl);
}

router.use(function(req, res, next) {
  res.locals.user = req.user;

  return next();
});

/**
 * Auth endpoints
 */
var authenticateOptions = {
  failureRedirect: '/'
};
router.get('/auth/instagram', passport.authenticate('instagram'));
router.get('/auth/instagram/callback', passport.authenticate('instagram', authenticateOptions), successAuth);



/**
 * Parameters
 */
router.param('tag', function(req, res, next, tag) {
  debug('Got param tag: "%s"', tag);

  if (_.isUndefined(tags[tag])) {
    return res.redirect(req.app.baseUrl);
  }
  var segments = req.path.toLowerCase().split( '/' );

  req.tag = tag;
  req.tagObject = tags[tag];

  req.session.tag = tag;

  res.locals.tag = req.tag;
  res.locals.tagObject = req.tagObject;
  res.locals.page = segments.pop();
  res.locals[ res.locals.page+'_active' ] = true;

  return next();
});


/**
 * Endpoints
 */
router.post('/approve', require('./routes/approve.js'));
router.post('/reject', require('./routes/reject.js'));
router.post('/highlight', require('./routes/highlight.js'));
router.get('/vote/:id', require('./routes/vote.js'));
// router.get( '/sample/:id', require( './routes/sample.js' ) );
/**
 * Routes
 */
router.get('/', require('./routes/index.js'));
router.get('/profile', checkAuth, require('./routes/profile.js'));
router.get('/vote/:id', require('./routes/vote.js'));
router.get('/:tag/', require('./routes/tag/index.js'));
router.get('/:tag/home', require('./routes/tag/home.js'));
router.get('/:tag/come', require('./routes/tag/come.js'));
router.get('/:tag/gioca', require('./routes/tag/gioca.js'));
router.get('/:tag/gallery', require('./routes/tag/gallery.js'));
router.get('/:tag/details/:id', require('./routes/tag/details.js'));
router.get('/:tag/about', require('./routes/about.js'));
router.get('/:tag/profile', checkAuth, require('./routes/profile.js'));



/**
 * Application middlewares
 */
app.use(serveStatic(publicPath));
app.use(session({
  secret: 'asderfingf',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(router);


module.exports = app;


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78