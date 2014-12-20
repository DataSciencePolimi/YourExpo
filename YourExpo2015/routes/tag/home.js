// Load system modules
var url = require( 'url' );

// Load modules
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'yourexpo:routes:tag:home' );

// Load my modules




// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Home' );

  if( req.tagActive ) {
    debug( 'Tag ACTIVE' );
    return res.render( 'index', {
      randomIndex1: _.random( 0, 5 ),
      randomIndex2: _.random( 0, 5 )
    } );
  } else {
    debug( 'Tag NOT active' );
    var destinationUrl = url.resolve( req.app.baseUrl, req.tag+'/gallery' );
    return res.redirect( destinationUrl );
  }
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78