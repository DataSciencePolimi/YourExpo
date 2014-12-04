// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var mongoose = require( 'mongoose' );
var debug = require( 'debug' )( 'yourexpo:routes:tag:gallery' );

// Load my modules
var rootConfig = require( '../../../config/' );




// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Gallery' );
  var Model = mongoose.model( rootConfig.mongo.collections.photo );

  var trendingPromise = Model
  .find()
  .where( 'tag', req.tag )
  .where( 'rejected', false )
  .where( 'highlighted', false )
  .where( 'votesCount' ).gt( 50 )
  // .sort( '-delta -votesCount' )
  .sort( '-votesCount' )
  .limit( 20 )
  .execAsync();

  var topPromise = Model
  .find()
  .where( 'tag', req.tag )
  .where( 'rejected', false )
  .where( 'highlighted', false )
  .where( 'votesCount' ).gt( 50 )
  .limit( 20 )
  .sort( '-votesCount' )
  .execAsync();

  var highlightedPromise = Model
  .find()
  .where( 'tag', req.tag )
  .where( 'rejected', false )
  .where( 'highlighted', true )
  .where( 'votesCount' ).gt( 50 )
  .limit( 20 )
  .sort( '-votesCount' )
  .execAsync();

  var recentPromise = Model
  .find()
  .where( 'tag', req.tag )
  // .where( 'rejected', false )
  // .where( 'highlighted', false )
  // .where( 'votesCount' ).gt( 50 )
  .limit( 20 )
  .sort( '-_id' )
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