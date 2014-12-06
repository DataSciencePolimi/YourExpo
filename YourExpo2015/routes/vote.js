// Load system modules

// Load modules
var debug = require( 'debug' )( 'yourexpo:routes:vote' );
var mongoose = require( 'mongoose' );

// Load my modules
var rootConfig = require( '../../config/' );



// Constant declaration


// Module variables declaration


// Module initialization (at first load)


module.exports = function( req, res, next ) {
  var Model = mongoose.model( rootConfig.mongo.collections.photo );
  var id = req.params.id;

  debug( 'Voting for: %s', id );

  Model
  .findById( id )
  .execAsync()
  .then( function( post ) {
    if( !post )
      throw new Error( 'Post not found' );

    // Add one vote from the platform
    post.platform.push( {
      votes: 1
    } );

    return post
    .saveAsync();
  } )
  .spread( function() {
    return res.json( {
      message: 'ok'
    } );
  } )
  .catch( next );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78