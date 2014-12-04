// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'yourexpo:routes:details' );
var mongoose = require( 'mongoose' );
var request = require( 'request' );

// Load my modules
var rootConfig = require( '../../../config/' );




// Constant declaration


// Module variables declaration


// Module initialization (at first load)
Promise.promisifyAll( request );


module.exports = function( req, res ) {
  debug( 'Details' );
  var PhotoModel = mongoose.model( rootConfig.mongo.collections.photo );
  var PostModel = mongoose.model( rootConfig.mongo.collections.post );
  var id = req.params.id;
  var tag = req.tag;

  PhotoModel
  .findById( id )
  .execAsync()
  .then( function( photo ) {
    if( !photo )
      throw new Error( 'Cannot find object '+id );

    return photo;
  } )
  .then( function( photo ) {

    return PostModel
    .find()
    .where( 'tag', tag )
    .where( 'shortLink', photo.shortLink )
    .execAsync()
    .then( function( posts ) {
      return {
        photo: photo,
        posts: posts
      };
    } );
  } )
  .then( function( data ) {
    return res.render( 'details', data );
  } )
  .catch( debug );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78