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
// var saveSocialPosts = require( './save_post.js' );
var Instagram = require( './social/instagram.js' );
var Twitter = require( './social/twitter.js' );


// Module variables declaration

/*
Promise
.delay( 1000 )
.then( function() {
  debug( 'In then' );
  throw new Error( 'FUUU' );
})
.catch( function() {
  debug( 'In catch' );
  return Promise
  .delay(1000)
  .then( function() {
    debug( 'In catch after' );
  });
} )
.then( function() {
  debug( 'After all' );
})
.catch( function() {
  debug( 'Later catch' );
});


return;
*/

// Constant declaration

// Module variables declaration
var tag = argv._[ 0 ];
var tagObject;
var social = {
  instagram: new Instagram( { tag: tag } ),
  // twitter: new Twitter()
};


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
  var start = moment();

  return handleTag( tag )
  .catch( function( err ) {
    debug( 'Crawl loop error: %s', err.message );
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
  .then( function() { setImmediate( crawlLoop ); } );
  // .then( crawlLoop );
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
social.instagram.on( 'data', _.partial( saveInstagramPhotos, tag ) );
// social.twitter.on( 'data', _.partial( saveSocialPosts, tag ) );
//social.facebook.on( 'data', _.partial( saveSocialPosts, tag ) );



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
.then( crawlLoop )
.catch( handleFatalError )
;

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78