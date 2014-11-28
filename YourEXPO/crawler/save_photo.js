// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'crawler:save:photo' );
var mongoose = require( 'mongoose' );


// Load my modules
var rootConfig = require( '../../config/' );
var config = require( './config/' );





// Constant declaration


// Module variables declaration
function savePhotos( tag, wrappedElements ) {
  var Model = mongoose.model( rootConfig.mongo.collections.photo );
  debug( 'Saving %d photos to the DB', wrappedElements.length );

  var promises = _.map( wrappedElements, function( element ) {

    return Model
    .findOne()
    .where( 'tag', tag )
    .where( 'providerId', element.providerId )
    .execAsync()
    .then( function( document ) {

      var notPresent = !document;

      var votes = element.votes;
      delete element.votes;

      // Create
      if( notPresent ) {

        document = new Model( element );
        document.tag = tag;

        debug( 'Creating document for %s', document.providerId );
      }

      // Add votes
      document.votes.push( {
        votes: votes
      } );
      document.votesCount += votes;

      return document
      .saveAsync();
    } )
    ;
  } );

  return Promise
  .settle( promises )
  .then( function( /*promiseList*/ ) {
    /*
    _.each( promiseList, function( promise ) {
      if( promise.isRejected() ) {
        debug( 'Promise failed: %s', promise.reason() );
      }
    } );
    */
  } )

  ;
}


// Module exports
module.exports = savePhotos;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78