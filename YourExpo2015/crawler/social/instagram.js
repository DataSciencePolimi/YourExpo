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
// var saveInstagramPhotos = require( '../save_photo.js' );


// Constant declaration
var WINDOW_SIZE = 60*60*1000;

// Module variables declaration
/*
var keys = [
  {
    'clientId': 'fd5404fd42ec400db007736e2517100b',
    'clientSecret': 'bf4965608d7d4380838bea047634f854',
    'accessToken': '1574448514.fd5404f.3f2edfc6269b44dc95ecf991384828b0'
  },
  {
    'clientId': '3bb9963f72584b12a668ec4a9af6d3e1',
    'clientSecret': 'e81f75f0699a43c68e88032151c080ba',
    'accessToken': '1574448514.3bb9963.0419e8f021dd4ed899f41c07c23b53bb'
  },
  {
    'clientId': '50ddf91cf2e34652993aef6c2d07f820',
    'clientSecret': '05aadbd93fdc4489a752b33de27af48a',
    'accessToken': '1574448514.50ddf91.0b7b28f8ee7d4fb49fa5fce72382b397'
  }
];
*/
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
util.inherits( Instagram, EventEmitter );


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
  /*
  return getNewKeys()
  .then( function( data ) {
    _this.setKeys( data );

    return retryPromise()
    .tap( function() {
      debug( 'Hello i\'m here' );
    } )
    .catch( function() {
      debug( err );
    } )
    .catch( _this.handleError.bind( _this ) );
  } );
  */
};

Instagram.prototype.wrapElement = function( element ) {
  debug( 'Wrapping %s element', element.id );

  var date = moment.unix( 1*element.created_time ).utc().toDate();

  var matches = element.link.match( /.*\/([-\w]+)\/?/ );
  var shortLink = matches? matches[1] : undefined;

  return {
    providerId: element.id,
    username: element.user.username,
    userId: element.user.id,
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
  // return saveInstagramPhotos( this.tag, wrappedElements );
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

Instagram.prototype.searchTag = function( tag, options ) {
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

  return tagPromise;
};


// Module exports
module.exports = Instagram;



//  50 6F 77 65 72 65 64  62 79  56 6F 6C 6F 78