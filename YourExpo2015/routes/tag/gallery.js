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

  debug( 'Tag %s is active: %s', tag, req.tagActive );

  // Active TAG
  if( req.tagActive ) {
    var trendingPromise = Model
    .find()
    .select( '-raw' )
    .where( 'tag', tag )
    .where( 'rejected', false )
    .where( 'highlighted', false )
    .where( 'votesCount' ).gt( minVotes )
    .sort( '-votesCount' )
    .limit( maxImages )
    .lean()
    .execAsync();

    var topPromise = Model
    .find()
    .select( '-raw' )
    .where( 'tag', tag )
    .where( 'rejected', false )
    .where( 'highlighted', false )
    .where( 'votesCount' ).gt( minVotes )
    .sort( '-votesCount' )
    .limit( maxImages )
    .lean()
    .execAsync();

    var highlightedPromise = Model
    .find()
    .select( '-raw' )
    .where( 'tag', tag )
    .where( 'rejected', false )
    .where( 'highlighted', true )
    .where( 'votesCount' ).gt( minVotes )
    .sort( '-votesCount' )
    .limit( maxImages )
    .lean()
    .execAsync();

    var recentPromise = Model
    .find()
    .select( '-raw' )
    .where( 'tag', tag )
    .where( 'rejected', false )
    .sort( '-_id' )
    .limit( maxImages )
    .lean()
    .execAsync();


    var data = {
      trending: trendingPromise,
      top: topPromise,
      highlighted: highlightedPromise,
      recent: recentPromise
    };

    return Promise
    .props( data )
    .then( function( results ) {
      results.active = true;
      return res.render( 'gallery', results );
    } );



  // Unactive TAG
  } else {

    return Model
    .find()
    .select( '-raw' )
    .where( 'tag', tag )
    .where( 'rejected', false )
    .where( 'votesCount' ).gt( minVotes )
    .sort( '-_id' )
    .limit( 100 ) // BAD FIX
    .lean()
    .execAsync()
    .then( function( images ) {
      return res.render( 'gallery', {
        active: false,
        images: images
      } );
    } );
  }
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78