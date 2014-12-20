// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var debug = require( 'debug' )( 'yourexpo:routes:tag:tags' );

// Load my modules
var tags = require('../../tags/');



// Constant declaration

// Module variables declaration

// Module initialization (at first load)


module.exports = function( req, res ) {
  debug( 'Tag list' );

  var sortedTags = _.sortBy( tags, 'startDate' ).reverse();

  return res.render( 'tags', {
    tags: sortedTags
  } );
};


//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78