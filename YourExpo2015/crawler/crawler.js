// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'crawler' );
var mongoose = require( 'mongoose' );
var moment = require( 'moment' );
var argv = require( 'yargs' ).argv;


// Load my modules
var tags = require( '../tags/' );
var config = require( './config/' );
var initMongo = require( '../../models/' );
var saveInstagramPhotos = require( './save_photo.js' );
var saveSocialPosts = require( './save_post.js' );
var Instagram = require( './social/instagram.js' );
var Twitter = require( './social/twitter.js' );


// Module variables declaration



// Constant declaration
var INTERVAL = config.INTERVAL;

// Module variables declaration
var social = {
  instagram: new Instagram(),
  twitter: new Twitter()
};
var tag = argv._[ 0 ];
var tagObject;


function searchTag( tag, implementation ) {
  // var endDate = config.endDate;
  debug( 'Searching for tag "%s" with %s', tag, implementation.name );


  return implementation
  .searchTag( tag, {
    fetchAll: true,
    startDate: tagObject.startDate,
    endDate: tagObject.endDate
  } )
  ;
}

function handleTag( tag ) {
  var socialPromises = {};
  debug( 'Handling tag %s', tag );

  // Wrap each platform to get all the data
  _.each( social, function( implementation, name ) {

    socialPromises[ name ] = Promise
    .resolve( [ tag, implementation ] )
    .spread( searchTag )
    .catch( function( error ) {
      debug( 'Error while handling the "%s" tag with %s', tag, name );
      debug( error );
    } );

  } );

  // Now get all the data
  return Promise
  .props( socialPromises )
  .catch( function( error ) {
    debug( 'Error while handling the tag "%s"', tag );
    debug( error );
  } )
  ;
}


function crawlLoop() {
  debug( 'Crawl loop started' );

  return handleTag( tag )
  .catch( function( error ) {
    debug( 'Crawl loop error' );
    debug( error );
  } )
  .then( function() {
    debug( 'Pausing for %d ms before next loop', INTERVAL );
  } )
  .delay( INTERVAL )
  .then( crawlLoop );
}

// Module initialization (at first load)


social.instagram.on( 'data', _.partial( saveInstagramPhotos, tag ) );
social.twitter.on( 'data', _.partial( saveSocialPosts, tag ) );
//social.facebook.on( 'data', _.partial( saveSocialPosts, tag ) );



// Entry point

if( _.isUndefined( tags[ tag ] ) ) {
  debug( 'Tag "%s" not present in the configuration', tag );
  return;
}
tagObject = tags[ tag ];

Promise
.resolve()
.then( initMongo )
.catch( debug )
.then( crawlLoop )
.catch( debug )
.finally( function() {
  debug( 'Finished' );

  return mongoose
  .disconnectAsync();
} )
;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78