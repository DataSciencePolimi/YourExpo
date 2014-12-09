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

  var trendingPromise = Model
  .find()
  .select( '-raw' )
  .where( 'tag', req.tag )
  .where( 'rejected', false )
  .where( 'highlighted', false )
  .where( 'votesCount' ).gt( minVotes )
  .sort( '-votesCount' )
  .limit( maxImages )
  .execAsync();

  var topPromise = Model
  .find()
  .select( '-raw' )
  .where( 'tag', req.tag )
  .where( 'rejected', false )
  .where( 'highlighted', false )
  .where( 'votesCount' ).gt( minVotes )
  .sort( '-votesCount' )
  .limit( maxImages )
  .execAsync();

  var highlightedPromise = Model
  .find()
  .select( '-raw' )
  .where( 'tag', req.tag )
  .where( 'rejected', false )
  .where( 'highlighted', true )
  .where( 'votesCount' ).gt( minVotes )
  .sort( '-votesCount' )
  .limit( maxImages )
  .execAsync();

  var recentPromise = Model
  .find()
  .select( '-raw' )
  .where( 'tag', req.tag )
  .where( 'rejected', false )
  .sort( '-_id' )
  .limit( maxImages )
  .execAsync();


  var data = {
    trending: trendingPromise,
    top: topPromise,
    highlighted: highlightedPromise,
    recent: recentPromise
  };

  Promise
  .props( data )
  .then( function( results ) {
    return res.render( 'gallery', results );
  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78