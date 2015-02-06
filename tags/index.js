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
  EXPO2015dolceamaro: require( './EXPO2015dolceamaro/' ),
  EXPO2015nightday: require( './EXPO2015nightday/' ),
  EXPO2015italianlife: require( './EXPO2015italianlife/' ),
  EXPO2015fastslow: require( './EXPO2015fastslow/' ),
  EXPO2015gustomondo: require( './EXPO2015gustomondo/' ),
  EXPO2015stuporesapore: require( './EXPO2015stuporesapore/' ),
  EXPO2015artfun: require( './EXPO2015artfun/' ),
  EXPO2015showcooking: require( './EXPO2015showcooking/' ),
  EXPO2015cibovita: require( './EXPO2015cibovita/' ),
  EXPO2015terramare: require( './EXPO2015terramare/' ),
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

    // if we have a valid tag then use it, otherwise use first... :(
    var closestTag = sortedTags[ 0 ];
    if( tagMatches.length === 1 ) {
      closestTag = tagMatches[ 0 ];
    } else if( tagMatches.length === 2 ) {
      closestTag = tagMatches[ 1 ];
    }

    debug( 'Get current tag "%s" from %d matches: %j', closestTag.tag, tagMatches.length, _.map( tagMatches, 'tag' ) );
    return closestTag;
  }
} );

// Module initialization (at first load)
/*
tags[ 'EXPO2015volotest' ] = {
  tag: 'EXPO2015volotest',
  startDate: moment( '2013-12-13', 'YYYY-MM-DD' ).startOf( 'day' ),
  endDate: moment( '2015-12-20', 'YYYY-MM-DD' ).endOf( 'day' ),
};
*/

module.exports = tags;


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78