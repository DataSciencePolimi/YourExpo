// Load system modules
var url = require( 'url' );

// Load modules
var debug = require( 'debug' )( 'yourexpo:routes:tag:index' );

// Load my modules




// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Index' );

  var destinationUrl = url.resolve( req.app.baseUrl, req.tag+'/' );
  destinationUrl = url.resolve( destinationUrl, 'home' );
  debug( 'Dest url: %s', destinationUrl );

  return res.redirect( destinationUrl );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78