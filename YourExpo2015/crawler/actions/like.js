// Load system modules

// Load modules
var Promise = require('bluebird');
var debug = require('debug')('crawler:actions:like');
var moment = require('moment');
var mongoose = require('mongoose');

// Load my modules
var rootConfig = require('../../../config/');
var config = require('../config/');
var Instagram = require( '../social/instagram.js' );

// Constant declaration


// Module variables declaration
var instagram = new Instagram( {
  accessToken: '1574448514.00cd22b.ac1d3efbf3074877a97150b708018b52',
  token: true
} );
var userCollectionName = rootConfig.mongo.collections.user;

// Module exports
module.exports = function like( photo ) {
  var tag = photo.tag;
  var id = photo.providerId;
  var username = photo.username;
  var Model = mongoose.model( userCollectionName );

  var promise = Promise.resolve();

  if( !photo.liked ) {
    debug( 'Liking photo %s', id );

    promise = instagram
    .likePost( id )
    .then( function() {
      debug( 'Photo %s liked', id );

      photo.liked = true;
      photo.likedTimestamp = moment().utc().toDate();

      return photo
      .saveAsync();
    } )
    // Update the user model
    .then( function() {
      debug( 'Search/create the user: %s', username );

      return Model
      .findOrCreateUser( username );
    } )
    .then( function( user ) {
      debug( 'Updating user model' );

      var likedTagName = 'liked'+tag;
      var likedTimestampTagName = likedTagName+'Timestamp';
      user[ likedTagName ] = true;
      user[ likedTimestampTagName ] = moment().utc().toDate();

      return user
      .saveAsync();
    } )
    .catch( function( err ) {
      debug( 'Unable to like/save photo %s: %s', id, err.message );
      debug( err );
    } );
  }

  return promise
  .log( debug, 'Done liking photo %s', id )
  ;
};

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78