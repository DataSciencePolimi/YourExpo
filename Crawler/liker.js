// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'like' );
var mongoose = require( 'mongoose' );
var moment = require( 'moment' );
var argv = require( 'yargs' ).argv;


// Load my modules
// var tags = require( '../tags/' );
var config = require( '../config/' );
var initMongo = require( '../models/' );
var Instagram = require( './social/instagram.js' );


// Module variables declaration
var userCollectionName = config.mongo.collections.user;
var User = mongoose.model( userCollectionName );

// Constant declaration

// Module variables declaration
var tag = argv._[ 0 ];
var instagram = new Instagram( config.instagram.like );




function handleFatalError( err ) {
  debug( 'Fatal error: %s', err.message );
  debug( err );

  return mongoose
  .disconnectAsync()
  .then( function() {
    process.exit( 1 );
  } );
}


function likePhoto( data ) {
  debug( 'Like photo: %s', data.id );

  return instagram
  .likePost( data.id )
  .spread( function() {
    debug( 'Liked photo: %s', data.id );

    // Try to save the user
    var user = new User( {
      username: data.username,
      userId: data.userId
    } );

    user.externalLike = true;
    user.externalLikePhotoId = data.id;
    user.externalLikeTag = data.tag;
    user.externalLikeTimestamp = moment().utc().toDate();

    return user
    .saveAsync()
    .catch( function( err ) {
      debug( 'Error while saving the user (can be a duplicate): %j', err );
    } );
  } )
  .catch( function( err ) {
    debug( 'Like photo error: %j', err );
  } );
}

function loop() {
  debug( 'Loop init' );
  var start = moment();


  instagram
  .searchTag( tag )
  .spread( function( instragramMediaList ) {
    debug( 'Got %d photos', instragramMediaList.length );

    var userMap = _.groupBy( instragramMediaList, function( photo ) {
      return photo.user.username;
    } );
    var usernames = _.keys( userMap );

    var data = [];
    _.each( usernames, function( username ) {
      var photo = userMap[ username ][ 0 ];
      data.push( {
        id: photo.id,
        userId: photo.user.id,
        username: photo.user.username,
        tag: tag
      } );
    } );

    return data;
  } )
  .then( function mapIdToPromises( data ) {
    if( data.length===0 )
      return;

    var MAX_REQUEST = 29;
    var promise = likePhoto( data[ 0 ] );

    for( var i=1; i<MAX_REQUEST; i++ ) {
      promise = promise
      .return( data[ i ] )
      .then( likePhoto );
    }

    return promise;
  } )
  .then( function() {
    debug( 'Updated all photos' );
  } )
  .then( function() {
    var diff = moment().diff( start, 'h', true );
    if( diff<1 ) {
      var interval = ( 1 - diff )*60*60;
      debug( 'Pausing for %d seconds', interval );

      return Promise
      .delay( interval*1000 );
    }
  } )
  .then( function() {
    debug( 'Loop ended' );
    setImmediate( loop );
  } );
}

// Module initialization (at first load)


// Entry point
initMongo()
.then( loop )
.catch( handleFatalError );

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78