// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var mongoose = require( 'mongoose' );
var debug = require( 'debug' )( 'yourexpo:routes:tag:gallery' );

// Load my modules
var rootConfig = require( '../../../config/' );




// Constant declaration


// Module variables declaration
var minVotes = rootConfig.gallery.minVotes;
var maxImages = rootConfig.gallery.maxImages;
var photoCollection = rootConfig.mongo.collections.photo;

// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Gallery, min votes: %d', minVotes );
  var Model = mongoose.model( photoCollection );
  var tag = req.tag;
  var tagActive = req.tagActive;

  var baseQuery = Model
  .find()
  .limit( maxImages )
  .select( '-raw -votes -likers' )
  .where( 'tag', tag )
  .where( 'rejected', false )
  // .where( 'highlighted', true )
  // .where( 'votesCount' ).gt( minVotes )
  // .sort( '-votesCount' )
  .lean()
  .toConstructor();

  debug( 'Tag %s is active: %s', tag, tagActive );

  var highlightedPromise = baseQuery()
  .where( 'highlighted', true )
  .where( 'votesCount' ).gt( minVotes )
  .sort( '-_id' ) // TODO change with the highlighted timestamp
  .execAsync();

  var data = {
    highlighted: highlightedPromise,
  };

  // Active TAG
  if( tagActive ) {
    // Add trending
    data.trending = baseQuery()
    .where( 'highlighted', false )
    .where( 'votesCount' ).gt( minVotes )
    .sort( '-delta' )
    .execAsync();

    // Add top voted
    data.top = baseQuery()
    .where( 'highlighted', false )
    .where( 'votesCount' ).gt( minVotes )
    .sort( '-votesCount' )
    .execAsync();

    // Add recent
    data.recent = baseQuery()
    .where( 'highlighted', false )
    .sort( '-_id' )
    .execAsync();

  // Unactive TAG
  } else {
    // Add all images
    data.images = baseQuery()
    .where( 'votesCount' ).gt( minVotes )
    .sort( '-_id' )
    .execAsync();
  }



  // Make the promise for the datas
  return Promise
  .props( data )
  .then( function( results ) {
    return res.render( 'gallery', results );
  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78