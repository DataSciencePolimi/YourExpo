// Load system modules

// Load modules
var debug = require( 'debug' )( 'yourexpo:routes:approve' );

// Load my modules
var app = require( '../index.js' );



// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( req, res, next ) {
  debug( 'Approve' );
  debug( app );

  res.json( {
    baseUrl: req.baseUrl,
    path: app.path(),
    mountpath: app.mountpath
  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78