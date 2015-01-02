// Load system modules

// Load modules
var debug = require('debug')('yourexpo:routes:highlight');
var mongoose = require('mongoose');
var moment = require('moment');

// Load my modules
var rootConfig = require('../../config/');


// Constant declaration


// Module variables declaration
var photoCollectionName = rootConfig.mongo.collections.photo;

// Module initialization (at first load)


module.exports = function(req, res, next) {
  debug( 'Highlight' );
  var Model = mongoose.model( photoCollectionName );

  var id = req.params.id;
  var method = req.method.toUpperCase();
  var highlight = method==='DELETE'? false : true;

  debug( 'Highlight set to: %s', highlight );

  return Model
  .findById( id )
  .execAsync()
  .then( function( photo ) {
    if( !photo )
      throw new Error( 'Photo not found' );

    var now = moment().utc().toDate();
    photo.moderated = true;
    photo.moderatedTimestamp = now;
    photo.highlighted = highlight;
    photo.highlightedTimestamp = now;

    return photo
    .saveAsync();
  } )
  .then( function() {
    return res.json( {
      message: 'ok'
    } );
  } )
  .catch( function( err ) {
    debug( 'Error highlighting the photo: %s', err.message );
    debug( err );

    return next( err );
  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78