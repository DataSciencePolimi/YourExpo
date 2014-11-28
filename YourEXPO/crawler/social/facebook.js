// Load system modules
var url = require( 'url' );
var EventEmitter = require( 'events' ).EventEmitter;

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'crawler:facebook' );
var Facebook = require( 'fbgraph' );
var _ = require( 'lodash' );

// Load my modules
var config = require( '../config/config.js' );





// Constant declaration
// var DATE_FORMAT = '';
var MAX_EMPTY_RESULTS = 10;
var MAX_PAGES = Infinity;
var WINDOW_SIZE = 15*60*1000;
var RATE_LIMIT = {
  'search': Infinity
};
// Module variables declaration
var status = {
  'search': 0
};
var emptyResults = 0;

// Module initialization (at first load)
Facebook.setAccessToken( config.facebook.appToken );
Promise.promisifyAll( Facebook );

var emitter = new EventEmitter();



function waitForEndpoint( endpoint ) {
  // debug( 'Current "%s" status: %d/%d', endpoint, status[ endpoint ], RATE_LIMIT[ endpoint ] );
  if( status[ endpoint ]<RATE_LIMIT[ endpoint ] ) {
    status[ endpoint ] += 1;
    return Promise.resolve();
  } else {
    emitter.emit( 'paused', WINDOW_SIZE );

    return Promise
    .delay( WINDOW_SIZE )
    .then( function() {
      status[ endpoint ] = 0;
    } );
  }
}

function makeRequest( fbResponse ) {
  var firstQuery = _.isUndefined( fbResponse );

  fbResponse = fbResponse || {};
  var endpoint = this.endpoint;
  var params = this.params;
  var fbPosts = fbResponse.data || [];

  var paging = fbResponse.paging || {};
  var page = this.page;

  var ctx = this;

  return waitForEndpoint( endpoint )
  .then( function addData() {

    fbPosts = _.map( fbPosts, function( data ) {
      return {
        raw: data,
        provider: 'facebook',
        providerId: data.id,
        created: new Date( data.created_time ),
        votes: data.likes || 0
      };
    } );

    // ctx.posts = ctx.posts.concat( fbPosts );
    emitter.emit( 'data', fbPosts );

    if( fbPosts.length===0 ) {
      emptyResults += 1;
      debug( 'Got an empty set %d/%d', emptyResults, MAX_EMPTY_RESULTS );
    } else {
      emptyResults = 0;
      debug( 'Resetting empty results' );
    }

    var moreResults = _.isString( paging.next ) && emptyResults<MAX_EMPTY_RESULTS;

    // Check if we have to perform more queries (paging)
    if( moreResults && page<MAX_PAGES ) { // More results
      // debug( 'We have more results' );
      ctx.page += 1;
      ctx.params = url.parse( paging.next, true ).query;
    }

    if( firstQuery || moreResults ) {
      // debug( 'Making request: %s', searchUrl );
      return Facebook
      .getAsync( endpoint, params )
      .then( makeRequest.bind( ctx ) );
    } else {
      return ctx.posts;
    }
  } )
  ;
}


function searchTag( tag ) {
  var startDate = config.startDate;
  var endDate = config.endDate;

  var endpoint = 'search';
  var query = '#'+tag;
  var params = {
    q: query,
    type: 'post',
    limit: 100,
    since: startDate.unix(), // .format( DATE_FORMAT ),
    until: endDate.unix() //.format( DATE_FORMAT )
  };

  var context = {
    posts: [],
    endpoint: endpoint,
    params: params,
    page: 0
  };

  return Promise
  .try( makeRequest, null, context );
}



// Module exports
module.exports = {
  searchTag: searchTag,
  emitter: emitter
};



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78