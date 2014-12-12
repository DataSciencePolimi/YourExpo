// Load system modules
var url = require( 'url' );

// Load modules
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'yourexpo:routes:index' );
var moment = require( 'moment' );

// Load my modules
var config = require( '../../config/' );
var tags = require( '../tags/' );




// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Index' );

  var now = moment();


  var sortedTags = _.sortBy( tags, 'startDate' );
  var tagMatches = _.filter( sortedTags, function( tagObject ) {
    if( now.isAfter( tagObject.startDate ) && now.isBefore( tagObject.endDate ) ) {
      return true;
    }
  } );
  debug( 'sortedTags: %j', _.map( sortedTags, 'tag' ) );
  debug( 'tagMatches: %j', _.map( tagMatches, 'tag' ) );

  // if we have a valid tag then use it, otherwise use first... :(
  var closestTag = tagMatches[ 0 ]? tagMatches[ 0 ].tag : sortedTags[ 0 ].tag;

  var destinationUrl = url.resolve( req.app.baseUrl, closestTag+'/' );
  res.redirect( destinationUrl );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78