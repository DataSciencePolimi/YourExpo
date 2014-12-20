// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var mongoose = require( 'mongoose' );
var debug = require( 'debug' )( 'yourexpo:routes:profile' );

// Load my modules
var rootConfig = require( '../../config/' );
var tags = require( '../tags/' );



// Constant declaration


// Module variables declaration
var maxImages = rootConfig.gallery.maxImages;
var photoCollection = rootConfig.mongo.collections.photo;

// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Profile' );

  var Model = mongoose.model( photoCollection );

  var promises = {};

  _.each( tags, function( nope, tag ) {
    promises[ tag ] = Model
    .find()
    .select( '-raw' )
    .where( 'tag', tag )
    .where( 'username', req.user.username )
    .sort( '-votesCount' )
    .limit( maxImages )
    .execAsync();
  } );

  Promise
  .props( promises )
  .then( function( results ) {
    return res.render( 'profile', {
      galleries: results,
    } );
  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78