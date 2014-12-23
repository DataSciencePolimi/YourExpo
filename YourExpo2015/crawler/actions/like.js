// Load system modules

// Load modules
var Promise = require('bluebird');
var _ = require('lodash');
var debug = require('debug')('crawler:actions:like');
var mongoose = require('mongoose');
var moment = require('moment');

// Load my modules
var rootConfig = require('../../../config/');
var config = require('../config/');
var Instagram = require( '../social/instagram.js' );

// Constant declaration


// Module variables declaration
var instagram = new Instagram();

// Module exports
module.exports = function like( photo ) {
  var id = photo.providerId;
  return instagram
  .likePost( id )
  .then( function() {
    debug( 'Photo %s liked', id );

    photo.liked = true;
    photo.likedTimestamp = moment().utc().toDate();

    return photo
    .saveAsync();
  } )
  .catch( function( err ) {
    debug( 'Unable to like/save photo %s: %s', id, err.message );
  } )
  ;
};

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78