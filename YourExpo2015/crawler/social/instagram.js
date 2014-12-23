// Load system modules
var url = require( 'url' );
var util = require( 'util' );
var EventEmitter = require( 'events' ).EventEmitter;

// Load modules
var Promise = require( 'bluebird' );
var moment = require( 'moment' );
var debug = require( 'debug' )( 'crawler:social:instagram' );
var InstagramLib = require( 'instagram-node' );
var _ = require( 'lodash' );

// Load my modules
var rootConfig = require( '../../../config/' );





// Constant declaration
var WINDOW_SIZE = 60*60*1000;

// Module variables declaration


// Module initialization (at first load)



var Instagram = function constructor( options ) {
  options = options || {};

  this.name = 'Instagram';
  this.accessToken = options.accessToken || rootConfig.instagram.accessToken;
  this.clientId = options.clientId || rootConfig.instagram.clientId;
  this.clientSecret = options.clientSecret || rootConfig.instagram.clientSecret;
  this.api = InstagramLib.instagram();


  /* jshint camelcase:false */
  this.api.use( {
    client_id: this.clientId,
    client_secret: this.clientSecret,
    access_token: this.accessToken
  } );
  /* jshint camelcase:true */

  Promise.promisifyAll( this.api );
};
util.inherits( Instagram, EventEmitter );


Instagram.prototype.handleError = function( error ) {
  debug( 'Got error: %s', error.message );
  var retryPromise = Promise.promisify( error.retry );

  return Promise
  .delay( WINDOW_SIZE )
  .then( function() {
    return retryPromise();
  } );
};

Instagram.prototype.wrapElement = function( element ) {
  debug( 'Wrapping %s element', element.id );

  var date = moment.unix( 1*element.created_time ).utc().toDate();

  var matches = element.link.match( /.*\/([-\w]+)\/?/ );
  var shortLink = matches? matches[1] : undefined;

  return {
    providerId: element.id,
    username: element.user.username,
    shortLink: shortLink,
    imageUrl: url.resolve( element.link, 'media/?size=l' ),
    postLink: element.link,
    creationDate: date,
    raw: element,

    votes: element.likes.count,
  };
};

Instagram.prototype.wrapElements = function( elements ) {
  debug( 'Wrapping %d elements to the model structure', elements.length );
  return _.map( elements, this.wrapElement );
};

Instagram.prototype.sendData = function( wrappedElements ) {
  this.emit( 'data', wrappedElements );
};

Instagram.prototype.parseData = function( results ) {
  // debug( 'Got %d results', results.length );

  return Promise
  .resolve( results )
  .then( this.wrapElements.bind( this ) )
  .then( this.sendData.bind( this ) )
  // .then( this.saveElements.bind( this ) )
  .return( _.toArray( arguments ) )
  ;
};

Instagram.prototype.getMorePages = function( result, pagination ) {
  pagination = pagination || {};

  // We have more pages
  if( _.isFunction( pagination.next ) ) {
    // debug( 'Next page available' );
    var nextPagePromise = Promise.promisify( pagination.next );

    return nextPagePromise()
    .catch( this.handleError.bind( this ) )
    .spread( this.parseData.bind( this ) )
    .spread( this.getMorePages.bind( this ) )
    ;
  }

};


Instagram.prototype.likePost = function( id, callback ) {
  return this.api
  /* jshint camelcase:false */
  .add_likeAsync( id )
  /* jshint camelcase:true */
  .catch( this.handleError.bind( this ) )
  .nodeify( callback );
};

Instagram.prototype.followUser = function( user, callback ) {
  return this.api
  /* jshint camelcase:false */
  .set_user_relationshipAsync( user, 'follow' )
  /* jshint camelcase:true */
  .catch( this.handleError.bind( this ) )
  .nodeify( callback );
};

Instagram.prototype.searchTag = function( tag, options, callback ) {
  if( _.isFunction( options ) ) {
    callback = options;
    options = null;
  }

  options = options || {};
  var fetchAll = options.fetchAll || false;

  var minId = options.startFromId;
  if( !minId && options.startDate && _.isFunction( options.startDate.unix ) ) {
    minId = options.startDate.unix()+'000000';
  }

  var params = {
    count: 100,
    /* jshint camelcase: false */
    min_tag_id: minId,
    /* jshint camelcase: true */
  };


  debug( 'Seaching for tag "%s" with %j', tag, options );

  var tagPromise = this.api
  /* jshint camelcase:false */
  .tag_media_recentAsync( tag, params )
  /* jshint camelcase:true */
  .catch( this.handleError.bind( this ) )
  .spread( this.parseData.bind( this ) )
  ;

  if( fetchAll ) {
    tagPromise = tagPromise
    .spread( this.getMorePages.bind( this ) );
  }

  return tagPromise
  .nodeify( callback );
};


// Module exports
module.exports = Instagram;



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78