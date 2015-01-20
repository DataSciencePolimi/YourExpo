// Load system modules

// Load modules
var Promise = require('bluebird');
var _ = require('lodash');
var debug = require('debug')('crawler:actions:follow');
var mongoose = require('mongoose');
var moment = require('moment');

// Load my modules
var rootConfig = require('../../../config/');
var config = require('../config/');
var Instagram = require( '../social/instagram.js' );

// Constant declaration


// Module variables declaration
var userCollectionName = rootConfig.mongo.collections.user;
var instagram = new Instagram( {
  accessToken: '1574448514.00cd22b.ac1d3efbf3074877a97150b708018b52',
  token: true
} );
var userCollectionName = rootConfig.mongo.collections.user;

// Module exports
module.exports = function follow( photo ) {
  var username = photo.username;
  var userId = photo.raw.user.id;
  var Model = mongoose.model( userCollectionName );

  debug( 'Following user %s: %s', username, userId );


  return Model
  .findOrCreateUser( username )
  .then( function( user ) {

    if( !user.followed ) {
      return instagram
      .followUser( userId )
      .then( function() {

        user.followed = true;
        user.followedTimestamp = moment().utc().toDate();

        return user
        .saveAsync();
      } )
      .catch( function( err ) {
        debug( 'Unable to follow/save user %s: %s', username, err.message );
      } );
    }
  } )
  .log( debug, 'Done following user %s', username )
  ;
};

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78