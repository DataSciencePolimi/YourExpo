// Load system modules

// Load modules
var debug = require( 'debug' )( 'dashboard:routes:tag_index' );

// Load my modules



// Constant declaration


// Module variables declaration

// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Tag Index for: %s', req.tag );

  return res.render( 'tag_index' );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78