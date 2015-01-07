// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'fixer' );
var mongoose = require( 'mongoose' );
var moment = require( 'moment' );
var argv = require( 'yargs' ).argv;


// Load my modules
var tags = require( '../tags/' );
var config = require( './config/' );
var initMongo = require( '../../models/' );
var rootConfig = require( '../../config/' );
// var saveInstagramPhotos = require( './save_photo.js' );
// var saveSocialPosts = require( './save_post.js' );
var Instagram = require( './social/instagram.js' );
var actions = require( './actions.js' );

// Module variables declaration
var photoCollectionName = rootConfig.mongo.collections.photo;

// Constant declaration

// Module variables declaration
var tag = argv._[ 0 ];
var tagObject;


function handleTag( tag ) {
  debug( 'Handling tag %s', tag );

  var Model = mongoose.model( photoCollectionName );

  return Model
  .find()
  .where( 'tag', tag )
  .select( '-raw' )
  .execAsync()
  .then( actions )
  ;
}


function fixerLoop() {
  debug( 'Fixer loop started' );
  var start = moment();

  return handleTag( tag )
  .catch( function( err ) {
    debug( 'Fixer loop error: %s', err.message );
    debug( err );
  } )
  .then( function() {
    var diff = moment().diff( start, 'h', true );
    debug( 'Check if 1 hour is passed: %d', diff );

    if( diff<1 ) {
      var interval = (1-diff)*60*60;
      debug( 'Pausing for %d seconds', interval );

      return Promise
      .delay( interval*1000 );
    }
  } )
  .then( fixerLoop );
}

function handleFatalError( err ) {
  debug( 'Fatal error: %s', err.message );
  debug( err );

  return mongoose
  .disconnectAsync()
  .then( function() {
    process.exit( 1 );
  } );
}

// Module initialization (at first load)



// Entry point
Promise
.resolve( tag )
.then( function( tag ) {
  if( _.isUndefined( tags[ tag ] ) ) {
    throw new Error( 'Tag "'+tag+'" not present in the configuration' );
  }
  tagObject = tags[ tag ];
} )
.then( initMongo )
.catch( handleFatalError )
.then( fixerLoop )
.catch( handleFatalError )
;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78