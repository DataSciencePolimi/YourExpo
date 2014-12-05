// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'crawler:save:post' );
var mongoose = require( 'mongoose' );


// Load my modules
var rootConfig = require( '../../config/' );
var config = require( './config/' );





// Constant declaration


// Module variables declaration
function savePosts( tag, wrappedElements ) {
  var PostModel = mongoose.model( rootConfig.mongo.collections.post );
  var PhotoModel = mongoose.model( rootConfig.mongo.collections.photo );
  debug( 'Saving %d posts to the DB', wrappedElements.length );

  var promises = _.map( wrappedElements, function( element ) {

    var votes = element.votes;
    delete element.votes;

    return PostModel
    .findOne()
    .where( 'tag', tag )
    .where( 'provider', element.provider )
    .where( 'providerId', element.providerId )
    .execAsync()
    .then( function( document ) {

      var notPresent = !document;


      // Create
      if( notPresent ) {

        document = new PostModel( element );
        document.tag = tag;

        debug( 'Creating document for %s', document.providerId );
      }

      // Add votes
      document.votes.push( {
        votes: votes
      } );

      return document
      .saveAsync();
    } )

    // Update the photo votes counter
    /*
    .then( function() {

      // Try to find the corresponding photo
      return PhotoModel
      .findOne()
      .where( 'tag', tag )
      .where( 'shortLink', element.shortLink )
      .execAsync();
    } )
    .then( function( photoDocument ) {

      if( photoDocument ) {
        photoDocument.votesCount += votes;
        return photoDocument
        .saveAsync();
      }

    } )
    */
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
module.exports = savePosts;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78