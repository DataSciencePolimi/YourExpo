// Load system modules

// Load modules
var moment = require( 'moment' );
var mongoose = require( 'mongoose' );
var debug = require( 'debug' )( 'dashboard:routes:tag_data' );

// Load my modules
var rootConfig = require( '../../config/' );



// Constant declaration


// Module variables declaration
var photoCollectionName = rootConfig.mongo.collections.photo;
var DATE_FORMAT = 'YYYY-MM-DD_HH:mm:ss';

// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Tag data index for: %s', req.tag );

  var Model = mongoose.model( photoCollectionName );
  var from = moment( req.query.from, DATE_FORMAT ).utc();
  var to = moment( req.query.to, DATE_FORMAT ).utc();
  debug( 'From: %s', from );
  debug( 'To: %s', to );

  var query = Model
  .find()
  .select( '-raw' )
  .where( 'tag', req.tag );

  if( from.isValid() ) {
    query
    .where( 'creationDate' ).gte( from.toDate() );
  }

  if( to.isValid() ) {
    query
    .where( 'creationDate' ).lte( to.toDate() );
  }

  return query
  .lean()
  .execAsync()
  .then( function( images ) {
    return res.json( {
      from: from,
      to: to,
      images: images
    } );
  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78