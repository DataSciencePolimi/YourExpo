// Load system modules
var url = require( 'url' );

// Load modules
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );
var rootConfig = require( '../config/' );
var config = require( './config/' );
var debug = require( 'debug' )( 'crawler:postToCS' );
var request = require( 'request' );

// Load my modules





// Constant declaration
var MAX_QUEUE_SIZE = config.MAX_QUEUE_SIZE;
var csBaseUrl = rootConfig.crowdSearcher.url;
var addObjectPath = rootConfig.crowdSearcher.addObjectLocation;
var taskId = rootConfig.crowdSearcher.taskId;

// Module variables declaration
var queue = [];


// Module initialization (at first load)
Promise.promisifyAll( request );

// Module exports
module.exports = function postToCS( document ) {
  // Do not use Mongoose objects
  /*
  document = document.toObject( {
    getter: true,
    virtual: true
  } );
  document.id = document._id;
  */


  // Add to queue
  queue.push( document );
  if( queue.length<MAX_QUEUE_SIZE )
    return;

  // If the numer of likes is too little, do not post
  if( document.numVotes<50 )
    return;

  // Map the queue to the CS objects
  var objects = _.map( queue, function( data ) {
    return {
      data: data
    };
  } );

  var postUrl = url.resolve( csBaseUrl, addObjectPath  );

  // Post to CS
  request
  .postAsync( {
    url: postUrl,
    qs: {
      task: taskId
    },
    json: {
      objects: objects
    }
  } )
  .spread( function() {
    debug( 'Post done!' );

    // Reset the queue
    queue = [];
  } );
};



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78