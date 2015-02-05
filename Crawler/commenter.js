// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'comment' );
var mongoose = require( 'mongoose' );
var moment = require( 'moment' );
var argv = require( 'yargs' ).argv;


// Load my modules
// var tags = require( '../tags/' );
var config = require( '../config/' );
var initMongo = require( '../models/' );
var Instagram = require( './social/instagram.js' );


// Module variables declaration
var photoCollectionName = config.mongo.collections.photo;
var Model = mongoose.model( photoCollectionName );

// Constant declaration

// Module variables declaration
var tag = argv._[ 0 ];
var instagram = new Instagram( config.instagram.comment );




function handleFatalError( err ) {
  debug( 'Fatal error: %s', err.message );
  debug( err );

  return mongoose
  .disconnectAsync()
  .then( function() {
    process.exit( 1 );
  } );
}



function commentPhoto( id ) {
  debug( 'Commenting photo: %s', id );

  var comment = 'Test comment';

  return instagram
  .addComment( id, comment )
  .spread( function() {
    debug( 'Commented photo: %s', id );
    throw new Error( 'MUST be implemented with user update' );
  } )
  .catch( function( err ) {
    debug( 'Comment photo error: %j', err );
  } );
}

function loop() {
  debug( 'Loop init' );
  var start = moment();

  var aggregate = Promise.promisifyAll( Model.aggregate() );

  aggregate
  .allowDiskUse( true )
  .match( {
    tag: tag
  } )
  .sort( 'username -votesCount' )
  .group( {
    _id: '$username',
    topPhotoVotes: {
        $first: '$votesCount'
    },
    topPhotoId: {
        $first: '$providerId'
    }
  } )
  .sort( '-topPhotoVotes' )
  .execAsync()
  .then( function mapIdToPromises( photos ) {
    if( photos.length===0 )
      return;
    var ids = _.map( photos, 'topPhotoId' );
    // var ids = photos;

    var promise = commentPhoto( ids[ 0 ] );

    for( var i=1; i<ids.length; i++ ) {
      promise = promise
      .return( ids[ i ] )
      .then( commentPhoto );
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