// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'yourexpo:routes:about' );

// Load my modules



// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'About' );

  return res.render( 'about' );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78