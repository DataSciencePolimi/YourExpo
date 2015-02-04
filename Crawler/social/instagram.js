// Load system modules

// Load modules
var Promise = require( 'bluebird' );
var moment = require( 'moment' );
var debug = require( 'debug' )( 'crawler:social:instagram' );
var InstagramLib = require( 'instagram-node' );
var _ = require( 'lodash' );

// Load my modules


// Constant declaration
var WINDOW_SIZE = 60*60*1000;

// Module variables declaration

// Module initialization (at first load)



var Instagram = function constructor( options ) {
  options = options || {};

  this.name = 'Instagram';
  this.api = InstagramLib.instagram();
  this.token = options.token;
  this.tag = options.tag;

  this.setKeys( options );
  // this.setKeys( rootConfig.instagram );

  Promise.promisifyAll( this.api );
};


Instagram.prototype.setKeys = function( data ) {
  this.accessToken = data.accessToken;
  this.clientId = data.clientId;
  this.clientSecret = data.clientSecret;

  /* jshint camelcase:false */
  if( this.token ) {
    debug( 'Set Access token to: %s', this.accessToken );

    this.api.use( {
      access_token: this.accessToken
    } );
  } else {
    debug( 'Set clientId to: %s', this.clientId );
    debug( 'Set clientSecret to: %s', this.clientSecret );

    this.api.use( {
      client_id: this.clientId,
      client_secret: this.clientSecret,
    } );
  }
};
Instagram.prototype.handleError = function( err ) {
  var _this = this;
  var cause = err.cause;
  debug( 'Got error: %s', cause.error_type );
  debug( cause );
  var retryPromise = Promise.method( cause.retry );

  return Promise
  .delay( WINDOW_SIZE )
  .then( function() {
    debug( 'Retry request' );
    return retryPromise();
  } )
  .catch( _this.handleError.bind( _this ) );
};


Instagram.prototype.getMorePages = function( partial, results, pagination ) {
  pagination = pagination || {};

  // Concat the new results
  partial = partial.concat( results );

  // We have more pages
  if( _.isFunction( pagination.next ) ) {
    debug( 'Next page available' );
    var nextPagePromise = Promise.promisify( pagination.next );
    var morePages = _.bind( this.getMorePages, this, partial );

    return nextPagePromise()
    .catch( this.handleError.bind( this ) )
    .spread( morePages )
    ;
  } else {
    return partial;
  }

};


Instagram.prototype.getLikers = function( id ) {
  return this.api
  /* jshint camelcase:false */
  .likesAsync( id )
  /* jshint camelcase:true */
  // .catch( this.handleError.bind( this ) )
  ;
};
Instagram.prototype.likePost = function( id ) {
  return this.api
  /* jshint camelcase:false */
  .add_likeAsync( id )
  /* jshint camelcase:true */
  .catch( this.handleError.bind( this ) );
};

Instagram.prototype.followUser = function( userId ) {
  return this.api
  /* jshint camelcase:false */
  .set_user_relationshipAsync( userId, 'follow' )
  /* jshint camelcase:true */
  .catch( this.handleError.bind( this ) );
};


Instagram.prototype.addComment = function( id, comment ) {
  return this.api
  /* jshint camelcase:false */
  .add_commentAsync( id, comment )
  /* jshint camelcase:true */
  .catch( this.handleError.bind( this ) );
};


Instagram.prototype.searchTag = function( tag, options ) {
  options = options || {};
  var fetchAll = options.fetchAll || false;

  var params = {
    count: options.count || 100,
  };


  debug( 'Seaching for tag "%s" with %j', tag, params );

  var tagPromise = this.api
  /* jshint camelcase:false */
  .tag_media_recentAsync( tag, params )
  /* jshint camelcase:true */
  .catch( this.handleError.bind( this ) )
  ;

  if( fetchAll ) {
    var partial = [];

    var morePages = _.bind( this.getMorePages, this, partial );
    tagPromise = tagPromise
    .spread( morePages );
  }

  return tagPromise;
};


// Module exports
module.exports = Instagram;



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78