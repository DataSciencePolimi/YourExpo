// Load system modules
var url = require( 'url' );

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'crawler' );
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
var instagram = new Instagram( config.instagram.crawler );




function handleFatalError( err ) {
  debug( 'Fatal error: %s', err.message );
  debug( err );

  return mongoose
  .disconnectAsync()
  .then( function() {
    process.exit( 1 );
  } );
}



function saveOrUpdatePhoto( photo ) {
  var id = photo.providerId;
  debug( 'Saving/updating photo %s', id );

  return Model
  .findOne()
  .where( 'tag', tag )
  .where( 'providerId', id )
  .select( 'votes votesCount delta' )
  .execAsync()
  .then( function( document ) {
    var photoNotFound = !document;

    // Save a reference to the current number of votes of the photo
    var votes = photo.votes;

    if( photoNotFound ) {
      delete photo.votes; // Need to remove the field because the Photo Schema already contains a votes field as an Array, that should not be overwrited

      debug( 'Creating document for %s', id );
      document = new Model( photo );
      document.tag = tag;
      document.votesCount = votes;
    }


    // Update fields on the document

    // Add the current number of votes to the list of votes
    document.votes.push( {
      votes: votes
    } );

    // Caluculate the "deltas" for the photo
    var delta = votes - document.votesCount;

    document.delta = delta;
    document.votesCount = votes;


    // Save/update the document
    return document
    .saveAsync();
  } );
}




function wrapInstagramPhotos( igPhotos ) {
  debug( 'Wrapping %d photos', igPhotos.length );
  if( igPhotos.length===0 ) return [];

  return _.map( igPhotos, function( photo ) {

    var date = moment.unix( 1*photo.created_time ).utc().toDate();
    var matches = photo.link.match( /.*\/([-\w]+)\/?/ );
    var shortLink = matches? matches[1] : undefined;

    return {
      providerId: photo.id,
      username: photo.user.username,
      userId: photo.user.id,
      shortLink: shortLink,
      imageUrl: url.resolve( photo.link, 'media/?size=l' ),
      postLink: photo.link,
      creationDate: date,
      raw: photo,

      votes: photo.likes.count,
    };
  } );
}


function loop() {
  debug( 'Loop init' );
  // var start = moment();

  instagram
  .searchTag( tag, {
    fetchAll: true,
  } )
  .then( wrapInstagramPhotos )
  .then( function( data ) {
    debug( 'Wrapped %d photos', data.length );
    return data;
  } )
  .then( function mapInsagramPhotos( wrappedElements ) {
    if( wrappedElements.length===0 ) return;

    var promise = saveOrUpdatePhoto( wrappedElements[ 0 ] );

    for( var i=1; i<wrappedElements.length; i++ ) {
      promise = promise
      .return( wrappedElements[ i ] )
      .then( saveOrUpdatePhoto );
    }

    return promise;
  } )
  .then( function() {
    debug( 'Saved all photos' );
  } )
  .catch( function( err ) {
    debug( 'Error during loop: %j', err );
  } )
  .delay( 60*60*1000 )
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