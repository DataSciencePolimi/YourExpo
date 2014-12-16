// Load system modules

// Load modules
var debug = require( 'debug' )( 'yourexpo:routes:like' );
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
  .then( function( photo ) {
    if( !photo )
      throw new Error( 'Photo not found' );

    // Add one vote from the platform
    photo.platform.push( {
      votes: 1
    } );

    return photo
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