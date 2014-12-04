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

  var closestTag;
  var dist = +Infinity;

  _.each( tags, function( tagObject, tag ) {

    if( now.isAfter( tagObject.startDate ) && now.isBefore() ) {
      closestTag = tag;
      return false;
    }

    var currDist = now.diff( tagObject.startDate );
    if( currDist<dist ) {
      dist = currDist;
      closestTag = tag;
    }
  } );


  var destinationUrl = url.resolve( req.app.baseUrl, closestTag+'/' );
  res.redirect( destinationUrl );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78