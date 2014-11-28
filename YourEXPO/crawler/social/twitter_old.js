// Load system modules
var querystring = require( 'querystring' );
var EventEmitter = require( 'events' ).EventEmitter;

// Load modules
var Promise = require( 'bluebird' );
var debug = require( 'debug' )( 'crawler:twitter' );
var Twit = require( 'twit' );
var _ = require( 'lodash' );

// Load my modules
var config = require( '../config/config.js' );





// Constant declaration
var DATE_FORMAT = 'YYYY-MM-DD';
var WINDOW_SIZE = 15*60*1000;
var RATE_LIMIT = {
  'search/tweets': 180
};
// Module variables declaration
var status = {
  'search/tweets': 0
};

// Module initialization (at first load)
var Twitter = new Twit( {
  /* jshint camelcase: false */
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret,
  /* jshint camelcase: true */
} );
Promise.promisifyAll( Twitter );

var emitter = new EventEmitter();



function waitForEndoint( endpoint ) {
  debug( 'Current "%s" status: %d/%d', endpoint, status[ endpoint ], RATE_LIMIT[ endpoint ] );
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

function makeRequest( data ) {
  data = data || {};
  var endpoint = this.endpoint;
  var params = this.params;
  var twPosts = data.statuses || [];
  var metadata = data.search_metadata || {};
  var ctx = this;

  var firstQuery = _.isUndefined( metadata.query );

  return waitForEndoint( endpoint )
  .then( function addData() {

    twPosts = _.map( twPosts, function( data ) {

      var votes = data.retweet_count + data.favourites_count;

      votes = votes || 0;

      return {
        raw: data,
        provider: 'twitter',
        providerId: data.id_str,
        created: new Date( data.created_at ),
        votes: votes
      };
    } );

    // ctx.posts = ctx.posts.concat( twPosts );
    emitter.emit( 'data', twPosts );


    var moreResults = _.isString( metadata.next_results );

    // Check if we have to perform more queries (paging)
    if( moreResults ) { // More results
      // debug( 'We have more results, adding "max_id" param' );

      var nextResultsQueryString = metadata.next_results.slice( 1 );
      var parsedQueryParams = querystring.parse( nextResultsQueryString );
      var maxId = parsedQueryParams.max_id;

      params.max_id = maxId;
    }

    if( firstQuery || moreResults ) {
      var qs = querystring.unescape( querystring.stringify( params, ' ', ': ' ) );
      // debug( 'Performing the query: %s', qs );

      return Twitter
      .getAsync( endpoint, params )
      .spread( makeRequest.bind( ctx ) )
      ;
    }
  } )
  ;
}




function searchTag( tag ) {
  var startDate = config.startDate;
  var endDate = config.endDate;

  var endpoint = 'search/tweets';
  var query = '#'+tag;
  query += ' since:'+startDate.format( DATE_FORMAT );
  query += ' until:'+endDate.format( DATE_FORMAT );

  var params = {
    q: query,
    //result_type: 'recent' || 'popular'
    count: 100
  };

  var context = {
    endpoint: endpoint,
    query: query,
    params: params
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