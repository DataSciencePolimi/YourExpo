// Load system modules
var url = require( 'url' );
var util = require( 'util' );
var querystring = require( 'querystring' );
var EventEmitter = require( 'events' ).EventEmitter;

// Load modules
var Promise = require( 'bluebird' );
var moment = require( 'moment' );
var debug = require( 'debug' )( 'crawler:social:twitter' );
var TwitterLib = require( 'mtwitter' );
var _ = require( 'lodash' );

// Load my modules
var rootConfig = require( '../../../config/' );





// Constant declaration
var WINDOW_SIZE = 16*60*1000;
// "Thu Nov 27 15:54:12 +0000 2014"
var DATE_FORMAT = 'ddd MMM D H:m:ss Z YYYY';
var TWITTER_POST_URL = 'https://twitter.com/';

// Module variables declaration


// Module initialization (at first load)



var Twitter = function constructor( options ) {
  options = options || {};

  this.name = 'Twitter';
  this.consumerKey = options.consumerKey || rootConfig.twitter.consumerKey;
  this.consumerSecret = options.consumerSecret || rootConfig.twitter.consumerSecret;

  /* jshint camelcase: false */
  this.api = new TwitterLib( {
    consumer_key: this.consumerKey,
    consumer_secret: this.consumerSecret,
    application_only: true
  } );
  /* jshint camelcase: true */


  Promise.promisifyAll( this.api );
};
util.inherits( Twitter, EventEmitter );


Twitter.prototype.handleError = function( error ) {
  debug( 'Got error: %s', error.message );
  var retryPromise = Promise.promisify( error.retry );

  return Promise
  .delay( WINDOW_SIZE )
  .then( function() {
    return retryPromise();
  } );
};

Twitter.prototype.wrapElement = function( element ) {
  debug( 'Wrapping %s element', element.id );

  var date = moment( element.created_at, DATE_FORMAT, 'en' ).utc().toDate();
  var instagramPost = element.entities.urls[0].expanded_url;
  var matches = instagramPost.match( /.*\/([-\w]+)\/?/ );
  var shortLink = matches? matches[1] : undefined;
  var twitterPost = url.resolve( TWITTER_POST_URL, element.user.screen_name+'/status/'+element.id_str );

  return {
    provider: 'twitter',
    providerId: element.id,
    shortLink: shortLink,
    postLink: twitterPost,
    creationDate: date,
    raw: element,

    votes: element.retweet_count + element.favorite_count,
  };
};

Twitter.prototype.wrapElements = function( elements ) {
  debug( 'Wrapping %d elements to the model structure', elements.length );
  return _.map( elements, this.wrapElement );
};

Twitter.prototype.sendData = function( wrappedElements ) {
  this.emit( 'data', wrappedElements );
};

Twitter.prototype.parseData = function( item ) {
  return Promise
  .resolve( item.statuses )
  .then( this.wrapElements.bind( this ) )
  .then( this.sendData.bind( this ) )
  .return( item )
  ;
};

Twitter.prototype.getMorePages = function( item ) {


  if( item.statuses && item.statuses.length>0 ) {
    var meta = item.search_metadata;

    var searchPath = 'search/tweets';
    var params = {
      q: querystring.unescape( meta.query ),
      count: meta.count,
      max_id: meta.max_id,
      include_entities: meta.include_entitiesn
    };

    debug( 'More page query: %j', params );

    return this.api
    .getAsync( searchPath, params )
    .catch( this.handleError.bind( this ) )
    .spread( this.parseData.bind( this ) )
    .then( this.getMorePages.bind( this ) )
    ;
  }
};



Twitter.prototype.searchTag = function( tag, options, callback ) {
  if( _.isFunction( options ) ) {
    callback = options;
    options = null;
  }

  options = options || {};
  var fetchAll = options.fetchAll || false;

  // var startDate = options.startDate;
  var endDate = options.endDate;

  var searchPath = 'search/tweets';
  var params = {
    q: tag,
    count: 100,
    until: endDate.format( 'YYYY-MM-DD' ),
    include_entities: true
  };


  debug( 'Seaching for tag "%s" with %j', tag, options );

  var tagPromise = this.api
  .getAsync( searchPath, params )
  /* jshint camelcase:true */
  .catch( this.handleError.bind( this ) )
  .spread( this.parseData.bind( this ) )
  ;

  if( fetchAll ) {
    tagPromise = tagPromise
    .then( this.getMorePages.bind( this ) );
  }

  return tagPromise
  .nodeify( callback );
};


// Module exports
module.exports = Twitter;



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78