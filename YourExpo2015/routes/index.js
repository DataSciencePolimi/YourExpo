// Load system modules
var url = require( 'url' );

// Load modules
var debug = require( 'debug' )( 'yourexpo:routes:index' );

// Load my modules
var tags = require( '../../tags/' );




// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Index for: %s', req.originalUrl );

  var closestTag = tags.current.tag;

  var destinationUrl = url.resolve( req.app.baseUrl, closestTag+'/' );
  debug( 'Redirecting to root of current tag: %s', closestTag );
  return res.redirect( destinationUrl );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78