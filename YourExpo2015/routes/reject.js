// Load system modules

// Load modules
var debug = require('debug')('yourexpo:routes:reject');
var mongoose = require('mongoose');
var moment = require('moment');

// Load my modules
var rootConfig = require('../../config/');


// Constant declaration


// Module variables declaration
var photoCollectionName = rootConfig.mongo.collections.photo;


// Module initialization (at first load)


module.exports = function(req, res, next) {
  debug( 'Reject' );
  var Model = mongoose.model( photoCollectionName );

  var id = req.params.id;
  var method = req.method.toUpperCase();
  var reject = method==='DELETE'? false : true;

  debug( 'Reject set to: %s', reject );

  return Model
  .findById( id )
  .execAsync()
  .then( function( photo ) {
    if( !photo )
      throw new Error( 'Photo not found' );

    var now = moment().utc().toDate();
    photo.moderated = true;
    photo.moderatedTimestamp = now;
    photo.rejected = reject;
    photo.rejectedTimestamp = now;

    return photo
    .saveAsync();
  } )
  .then( function() {
    return res.json( {
      message: 'ok'
    } );
  } )
  .catch( function( err ) {
    debug( 'Error rejecting the photo: %s', err.message );
    debug( err );

    return next( err );
  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78