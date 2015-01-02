// Load system modules

// Load modules
var Promise = require('bluebird');
var debug = require('debug')('crawler:actions:monitor_likers');
var _ = require('lodash');

// Load my modules
var rootConfig = require('../../../config/');
var config = require('../config/');
var Instagram = require( '../social/instagram.js' );

// Constant declaration


// Module variables declaration
var instagram = new Instagram( {
  token: true
} );

// Module exports
module.exports = function monitorLikers( photo ) {
  debug( 'Monitoring likes' );
  var id = photo.providerId;

  return instagram
  .getLikers( id )
  .spread( function( likers ) {
    debug( 'Got %d likers', likers.length );

    var likerList = _.map( likers, 'username' );
    photo.likers.push( {
      list: likerList
    } );

    return photo
    .saveAsync();
  } )
  .catch( function( err ) {
    debug( 'Unable to update the likers photo %s: %s', id, err.message );
  } )
  .log( debug, 'Done monitoring likes' )
  ;
};

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78