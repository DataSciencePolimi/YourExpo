// Load system modules

// Load modules
var debug = require( 'debug' )( 'yourexpo:routes:tag' );

// Load my modules
var tags = require( '../tags/' );




// Constant declaration


// Module variables declaration
var DATE_FORMAT = 'DD MMMM';


// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Tag' );

  var currentTag = tags.current;

  var startDate = currentTag.startDate.clone();
  var endDate = currentTag.endDate.clone();
  var data = {
    tag: currentTag.tag,
    startDate: startDate.locale( 'it' ).format( DATE_FORMAT ),
    endDate: endDate.locale( 'it' ).format( DATE_FORMAT ),
    en: {
      startDate: startDate.locale( 'en' ).format( DATE_FORMAT ),
      endDate: endDate.locale( 'en' ).format( DATE_FORMAT ),
    }
  };

  return res.json( data );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78