// Load system modules

// Load modules
var Promise = require('bluebird');
var _ = require('lodash');
var debug = require('debug')('crawler:actions');

// Load my modules
var rootConfig = require('../../config/');
var config = require('./config/');


// Constant declaration


// Module variables declaration
var tasks = {
  monitorLikers: require( './actions/monitor_likers.js' ),
  like: require( './actions/like.js' ),
  // follow: require( './actions/follow.js' ),
  // comment: require( './actions/comment.js' ),
};


function doActions( prevPromise, document ) {
  return Promise
  .resolve( prevPromise )
  .then( function() {
    debug( 'Doing actions on element %s', document.id );

    var actionsPromise = Promise.resolve( document );
    _.each( tasks, function( action ) {
      actionsPromise = actionsPromise
      .then( action )
      .return( document );
    } );

    return actionsPromise;
  } )
  ;
}

// Module exports
module.exports = function actions( documents ) {


  Promise
  .reduce( documents, doActions, Promise.resolve() )
  .catch( function( err ) {
    debug( 'Cannot perform actions on documents' );
    debug( err );
  } )
  .then( function() {
    debug( 'All is done' );
  } )
  ;
};

//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78