// Load system modules

// Load modules
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'yourexpo:routes:tag:home' );

// Load my modules




// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Home' );

  return res.render( 'index', {
    randomIndex1: _.random( 0, 5 ),
    randomIndex2: _.random( 0, 5 )
  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78