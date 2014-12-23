// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'yourexpo:tag:index' );
var _ = require( 'lodash' );
var moment = require( 'moment' );

// Load my modules





// Constant declaration


// Module variables declaration
var tags = {
  EXPO2015showcooking: require( './EXPO2015showcooking/' ),
  EXPO2015cibovita: require( './EXPO2015cibovita/' ),
  EXPO2015terramare: require( './EXPO2015terramare/' ),
  //EXPO2015volotest: require( './EXPO2015volotest/' ),
};


Object.defineProperty( tags, 'current', {
  enumerable: false,
  // writable: false,
  configurable: false,
  get: function() {
    var now = moment();

    var sortedTags = _.sortBy( tags, 'startDate' );
    var tagMatches = _.filter( sortedTags, function( tagObject ) {
      if( now.isAfter( tagObject.startDate ) && now.isBefore( tagObject.endDate ) ) {
        return true;
      } else {
        return false;
      }
    } );
    debug( 'sortedTags: %j', _.map( sortedTags, 'tag' ) );
    debug( 'tagMatches: %j', _.map( tagMatches, 'tag' ) );

    // if we have a valid tag then use it, otherwise use first... :(
    var closestTag = sortedTags[ 0 ];
    if( tagMatches.length === 1 ) {
      closestTag = tagMatches[ 0 ];
    } else if( tagMatches.length === 2 ) {
      closestTag = tagMatches[ 1 ];
    }

    return closestTag;
  }
} );

// Module initialization (at first load)


module.exports = tags;


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78