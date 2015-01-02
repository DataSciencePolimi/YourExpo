// Load system modules
// var url = require( 'url' );

// Load modules
var _ = require( 'lodash' );
var mongoose = require( 'mongoose' );
var debug = require( 'debug' )( 'yourexpo:routes:tag:moderate' );

// Load my modules
var rootConfig = require( '../../../config/' );



// Constant declaration


// Module variables declaration
var photoCollection = rootConfig.mongo.collections.photo;

// Module initialization (at first load)


module.exports = function( req, res, next ) {
  var tag = req.tag;
  debug( 'Moderating: %j', req.query );

  // Auth required
  if( req.query.asd!=='polimi' ) {
    debug( 'Auth not valid' );
    return next();
  }


  var Model = mongoose.model( photoCollection );

  return Model
  .find()
  .select( '-raw' )
  .where( 'tag', tag )
  .sort( '-_id' )
  .lean()
  .execAsync()
  .then( function( images ) {

    return res.render( 'moderate', {
      images: images
    } );
  } )
  ;


};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78